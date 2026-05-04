import { Request, Response } from 'express';
import { db } from '../config/database';
import { logger } from '../utils/logger';

export class ReviewController {
  // Create a review
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { restaurantId, orderId, rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_RATING',
            message: 'Rating must be between 1 and 5',
          },
        });
      }

      // Check if user already reviewed this order
      const existingReview = await db.query(
        'SELECT id FROM reviews WHERE user_id = $1 AND order_id = $2',
        [userId, orderId]
      );

      if (existingReview.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'REVIEW_EXISTS',
            message: 'You have already reviewed this order',
          },
        });
      }

      const result = await db.query(
        `INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, restaurantId, orderId, rating, comment || null]
      );

      // Update restaurant average rating
      await this.updateRestaurantRating(restaurantId);

      res.status(201).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      logger.error('Error creating review', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create review',
        },
      });
    }
  }

  // Get reviews for a restaurant
  async getByRestaurant(req: Request, res: Response) {
    try {
      const { restaurantId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const query = `
        SELECT 
          r.*,
          p.name as user_name,
          r.created_at
        FROM reviews r
        LEFT JOIN profiles p ON r.user_id = p.user_id
        WHERE r.restaurant_id = $1
        ORDER BY r.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await db.query(query, [restaurantId, limit, offset]);

      // Get total count and average rating
      const statsQuery = `
        SELECT 
          COUNT(*) as total_reviews,
          AVG(rating) as average_rating
        FROM reviews
        WHERE restaurant_id = $1
      `;

      const statsResult = await db.query(statsQuery, [restaurantId]);

      res.json({
        success: true,
        data: result.rows,
        stats: {
          total: parseInt(statsResult.rows[0].total_reviews),
          average: parseFloat(statsResult.rows[0].average_rating || 0).toFixed(1),
        },
      });
    } catch (error) {
      logger.error('Error getting restaurant reviews', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get reviews',
        },
      });
    }
  }

  // Restaurant responds to a review
  async respond(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { response } = req.body;
      const userId = (req as any).user.id;

      if (!response) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_RESPONSE',
            message: 'Response text is required',
          },
        });
      }

      // Verify the restaurant owns this review
      const reviewCheck = await db.query(
        `SELECT r.id, r.restaurant_id, rest.user_id as restaurant_owner_id
         FROM reviews r
         JOIN restaurants rest ON r.restaurant_id = rest.id
         WHERE r.id = $1`,
        [id]
      );

      if (reviewCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'REVIEW_NOT_FOUND',
            message: 'Review not found',
          },
        });
      }

      if (reviewCheck.rows[0].restaurant_owner_id !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You can only respond to reviews for your restaurant',
          },
        });
      }

      const result = await db.query(
        `UPDATE reviews 
         SET response = $1, response_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [response, id]
      );

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      logger.error('Error responding to review', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to respond to review',
        },
      });
    }
  }

  // Get user's reviews
  async getMyReviews(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const query = `
        SELECT 
          r.*,
          rest.name as restaurant_name,
          rest.image as restaurant_image
        FROM reviews r
        JOIN restaurants rest ON r.restaurant_id = rest.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
      `;

      const result = await db.query(query, [userId]);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      logger.error('Error getting user reviews', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get user reviews',
        },
      });
    }
  }

  // Helper function to update restaurant rating
  private async updateRestaurantRating(restaurantId: string) {
    try {
      const result = await db.query(
        'SELECT AVG(rating) as avg_rating FROM reviews WHERE restaurant_id = $1',
        [restaurantId]
      );

      const avgRating = parseFloat(result.rows[0].avg_rating || 0);

      await db.query(
        'UPDATE restaurants SET rating = $1 WHERE id = $2',
        [avgRating, restaurantId]
      );
    } catch (error) {
      logger.error('Error updating restaurant rating', { error });
    }
  }
}

export const reviewController = new ReviewController();

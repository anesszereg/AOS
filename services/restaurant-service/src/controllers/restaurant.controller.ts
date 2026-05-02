import { Request, Response } from 'express';
import { db } from '../config/database';
import { logger } from '../utils/logger';

export class RestaurantController {
  async getAll(req: Request, res: Response) {
    try {
      const { cuisine, search, limit = 50, offset = 0 } = req.query;
      
      let query = 'SELECT * FROM restaurants WHERE 1=1';
      const params: any[] = [];
      let paramCount = 1;

      if (cuisine) {
        query += ` AND cuisine = $${paramCount}`;
        params.push(cuisine);
        paramCount++;
      }

      if (search) {
        query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
        params.push(`%${search}%`);
        paramCount++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(limit, offset);

      const result = await db.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          limit: Number(limit),
          offset: Number(offset),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error getting restaurants', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get restaurants'
        }
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await db.query(
        'SELECT * FROM restaurants WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Restaurant not found'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error getting restaurant', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get restaurant'
        }
      });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { q, cuisine, minRating, maxDistance } = req.query;

      let query = 'SELECT * FROM restaurants WHERE 1=1';
      const params: any[] = [];
      let paramCount = 1;

      if (q) {
        query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount} OR cuisine ILIKE $${paramCount})`;
        params.push(`%${q}%`);
        paramCount++;
      }

      if (cuisine) {
        query += ` AND cuisine = $${paramCount}`;
        params.push(cuisine);
        paramCount++;
      }

      if (minRating) {
        query += ` AND rating >= $${paramCount}`;
        params.push(minRating);
        paramCount++;
      }

      query += ' ORDER BY rating DESC, created_at DESC';

      const result = await db.query(query, params);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('Error searching restaurants', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to search restaurants'
        }
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, cuisine, address, phone, description, image } = req.body;
      const userId = (req as any).user.id;

      const result = await db.query(
        `INSERT INTO restaurants (user_id, name, cuisine, address, phone, description, image, rating, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [userId, name, cuisine, address, phone, description, image || null, 0, 'active']
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error creating restaurant', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create restaurant'
        }
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, cuisine, address, phone, description, image, status } = req.body;

      const result = await db.query(
        `UPDATE restaurants 
         SET name = COALESCE($1, name),
             cuisine = COALESCE($2, cuisine),
             address = COALESCE($3, address),
             phone = COALESCE($4, phone),
             description = COALESCE($5, description),
             image = COALESCE($6, image),
             status = COALESCE($7, status),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $8
         RETURNING *`,
        [name, cuisine, address, phone, description, image, status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Restaurant not found'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error updating restaurant', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update restaurant'
        }
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await db.query(
        'DELETE FROM restaurants WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Restaurant not found'
          }
        });
      }

      res.json({
        success: true,
        data: { message: 'Restaurant deleted successfully' }
      });
    } catch (error) {
      logger.error('Error deleting restaurant', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete restaurant'
        }
      });
    }
  }
}

export const restaurantController = new RestaurantController();

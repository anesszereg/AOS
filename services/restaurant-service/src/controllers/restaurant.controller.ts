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
      const { name, cuisine, address, phone, email, description, image } = req.body;
      const userId = (req as any).user.id;

      // Parse address if it's a single string
      const addressParts = address ? address.split(',').map((s: string) => s.trim()) : [];
      const street = addressParts[0] || '';
      const city = addressParts[1] || 'Naperville';
      const state = addressParts[2] || 'IL';
      const zip = addressParts[3] || '60540';

      const result = await db.query(
        `INSERT INTO restaurants (owner_id, name, cuisine, description, address_street, address_city, address_state, address_zip, phone, email, rating, is_active, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING *`,
        [userId, name, cuisine, description || '', street, city, state, zip, phone, email || '', 0, true, image || null]
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
      const { name, cuisine, address, phone, email, description, image } = req.body;
      const userId = (req as any).user.id;

      console.log('[Update Restaurant] Request:', { id, userId, body: req.body });

      // Verify ownership
      const ownerCheck = await db.query(
        'SELECT id, owner_id FROM restaurants WHERE id = $1',
        [id]
      );

      if (ownerCheck.rows.length === 0) {
        console.log('[Update Restaurant] Restaurant not found:', id);
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Restaurant not found'
          }
        });
      }

      if (ownerCheck.rows[0].owner_id !== userId) {
        console.log('[Update Restaurant] Unauthorized:', { owner: ownerCheck.rows[0].owner_id, user: userId });
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this restaurant'
          }
        });
      }

      // Parse address if it's a single string
      const addressParts = address ? address.split(',').map((s: string) => s.trim()) : [];
      const street = addressParts[0] || null;
      const city = addressParts[1] || null;
      const state = addressParts[2] || null;
      const zip = addressParts[3] || null;

      console.log('[Update Restaurant] Parsed address:', { street, city, state, zip });

      const result = await db.query(
        `UPDATE restaurants 
         SET name = COALESCE($1, name),
             cuisine = COALESCE($2, cuisine),
             address_street = COALESCE($3, address_street),
             address_city = COALESCE($4, address_city),
             address_state = COALESCE($5, address_state),
             address_zip = COALESCE($6, address_zip),
             phone = COALESCE($7, phone),
             email = COALESCE($8, email),
             description = COALESCE($9, description),
             image = COALESCE($10, image),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $11 AND owner_id = $12
         RETURNING *`,
        [name, cuisine, street, city, state, zip, phone, email, description, image, id, userId]
      );

      console.log('[Update Restaurant] Update result:', result.rows[0]);

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error: any) {
      console.error('[Update Restaurant] Error:', error);
      console.error('[Update Restaurant] Error message:', error.message);
      console.error('[Update Restaurant] Error stack:', error.stack);
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

  async getMyRestaurant(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const result = await db.query(
        'SELECT * FROM restaurants WHERE owner_id = $1 LIMIT 1',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'No restaurant found for this user. Please create a restaurant first.'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error getting my restaurant', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get restaurant'
        }
      });
    }
  }
}

export const restaurantController = new RestaurantController();

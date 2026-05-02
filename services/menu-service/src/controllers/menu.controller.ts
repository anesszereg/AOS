import { Request, Response } from 'express';
import { db } from '../config/database';
import { logger } from '../utils/logger';

export class MenuController {
  async getAll(req: Request, res: Response) {
    try {
      const { category, available, limit = 100, offset = 0 } = req.query;
      
      let query = 'SELECT * FROM menu_items WHERE 1=1';
      const params: any[] = [];
      let paramCount = 1;

      if (category) {
        query += ` AND category = $${paramCount}`;
        params.push(category);
        paramCount++;
      }

      if (available !== undefined) {
        query += ` AND available = $${paramCount}`;
        params.push(available === 'true');
        paramCount++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(limit, offset);

      const result = await db.query(query, params);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('Error getting menu items', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get menu items'
        }
      });
    }
  }

  async getByRestaurant(req: Request, res: Response) {
    try {
      const { restaurantId } = req.params;
      const { category, available } = req.query;

      let query = 'SELECT * FROM menu_items WHERE restaurant_id = $1';
      const params: any[] = [restaurantId];
      let paramCount = 2;

      if (category) {
        query += ` AND category = $${paramCount}`;
        params.push(category);
        paramCount++;
      }

      if (available !== undefined) {
        query += ` AND available = $${paramCount}`;
        params.push(available === 'true');
        paramCount++;
      }

      query += ' ORDER BY category, name';

      const result = await db.query(query, params);

      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      logger.error('Error getting restaurant menu', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get restaurant menu'
        }
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await db.query(
        'SELECT * FROM menu_items WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Menu item not found'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error getting menu item', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get menu item'
        }
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { restaurantId, name, description, price, category, image, available = true } = req.body;

      const result = await db.query(
        `INSERT INTO menu_items (restaurant_id, name, description, price, category, image, available)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [restaurantId, name, description, price, category, image || null, available]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error creating menu item', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create menu item'
        }
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, category, image, available } = req.body;

      const result = await db.query(
        `UPDATE menu_items 
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             price = COALESCE($3, price),
             category = COALESCE($4, category),
             image = COALESCE($5, image),
             available = COALESCE($6, available),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [name, description, price, category, image, available, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Menu item not found'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error updating menu item', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update menu item'
        }
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await db.query(
        'DELETE FROM menu_items WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Menu item not found'
          }
        });
      }

      res.json({
        success: true,
        data: { message: 'Menu item deleted successfully' }
      });
    } catch (error) {
      logger.error('Error deleting menu item', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete menu item'
        }
      });
    }
  }
}

export const menuController = new MenuController();

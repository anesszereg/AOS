import { Request, Response } from 'express';
import { db } from '../config/database';
import { logger } from '../utils/logger';

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const { restaurantId, items, deliveryAddress, totalAmount, notes } = req.body;
      const userId = (req as any).user.id;

      const result = await db.query(
        `INSERT INTO orders (user_id, restaurant_id, delivery_address, total_amount, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId, restaurantId, deliveryAddress, totalAmount, notes || null, 'placed']
      );

      const order = result.rows[0];

      // Insert order items
      for (const item of items) {
        await db.query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.menuItemId, item.quantity, item.price]
        );
      }

      res.status(201).json({
        success: true,
        data: order
      });
    } catch (error) {
      logger.error('Error creating order', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create order'
        }
      });
    }
  }

  async getUserOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { status, limit = 50, offset = 0 } = req.query;

      let query = 'SELECT * FROM orders WHERE user_id = $1';
      const params: any[] = [userId];
      let paramCount = 2;

      if (status) {
        query += ` AND status = $${paramCount}`;
        params.push(status);
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
      logger.error('Error getting user orders', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get user orders'
        }
      });
    }
  }

  async getRestaurantOrders(req: Request, res: Response) {
    try {
      const { restaurantId } = req.params;
      const { status, limit = 50, offset = 0 } = req.query;

      let query = 'SELECT * FROM orders WHERE restaurant_id = $1';
      const params: any[] = [restaurantId];
      let paramCount = 2;

      if (status) {
        query += ` AND status = $${paramCount}`;
        params.push(status);
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
      logger.error('Error getting restaurant orders', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get restaurant orders'
        }
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const orderResult = await db.query(
        'SELECT * FROM orders WHERE id = $1',
        [id]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Order not found'
          }
        });
      }

      const order = orderResult.rows[0];

      // Get order items
      const itemsResult = await db.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [id]
      );

      res.json({
        success: true,
        data: {
          ...order,
          items: itemsResult.rows
        }
      });
    } catch (error) {
      logger.error('Error getting order', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get order'
        }
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['placed', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Invalid order status'
          }
        });
      }

      const result = await db.query(
        `UPDATE orders 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Order not found'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error updating order status', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update order status'
        }
      });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await db.query(
        `UPDATE orders 
         SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND status IN ('placed', 'confirmed')
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CANNOT_CANCEL',
            message: 'Order cannot be cancelled'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error cancelling order', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to cancel order'
        }
      });
    }
  }
}

export const orderController = new OrderController();

import { Request, Response } from 'express';
import { db } from '../config/database';
import { logger } from '../utils/logger';

export class DeliveryController {
  async create(req: Request, res: Response) {
    try {
      const { orderId, driverId, pickupAddress, deliveryAddress } = req.body;

      const result = await db.query(
        `INSERT INTO deliveries (order_id, driver_id, pickup_address, delivery_address, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [orderId, driverId, pickupAddress, deliveryAddress, 'assigned']
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error creating delivery', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create delivery'
        }
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await db.query(
        'SELECT * FROM deliveries WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Delivery not found'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error getting delivery', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get delivery'
        }
      });
    }
  }

  async getByOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;

      const result = await db.query(
        'SELECT * FROM deliveries WHERE order_id = $1',
        [orderId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Delivery not found for this order'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error getting delivery by order', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get delivery'
        }
      });
    }
  }

  async getDriverDeliveries(req: Request, res: Response) {
    try {
      const driverId = (req as any).user.id;
      const { status, limit = 50, offset = 0 } = req.query;

      let query = 'SELECT * FROM deliveries WHERE driver_id = $1';
      const params: any[] = [driverId];
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
      logger.error('Error getting driver deliveries', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get driver deliveries'
        }
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['assigned', 'picked_up', 'in_transit', 'delivered', 'failed'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Invalid delivery status'
          }
        });
      }

      const result = await db.query(
        `UPDATE deliveries 
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
            message: 'Delivery not found'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error updating delivery status', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update delivery status'
        }
      });
    }
  }

  async updateLocation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { latitude, longitude } = req.body;

      const result = await db.query(
        `UPDATE deliveries 
         SET current_latitude = $1, 
             current_longitude = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [latitude, longitude, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Delivery not found'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error updating delivery location', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update delivery location'
        }
      });
    }
  }
}

export const deliveryController = new DeliveryController();

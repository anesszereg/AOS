import { Request, Response } from 'express';
import { db } from '../config/database';
import { logger } from '../utils/logger';

export class NotificationController {
  async create(req: Request, res: Response) {
    try {
      const { userId, type, subject, message, metadata } = req.body;

      const result = await db.query(
        `INSERT INTO notifications (user_id, type, subject, message, metadata, read)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId, type, subject || null, message, metadata ? JSON.stringify(metadata) : null, false]
      );

      res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error creating notification', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create notification'
        }
      });
    }
  }

  async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { read, type, limit = 50, offset = 0 } = req.query;

      let query = 'SELECT * FROM notifications WHERE user_id = $1';
      const params: any[] = [userId];
      let paramCount = 2;

      if (read !== undefined) {
        query += ` AND read = $${paramCount}`;
        params.push(read === 'true');
        paramCount++;
      }

      if (type) {
        query += ` AND type = $${paramCount}`;
        params.push(type);
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
      logger.error('Error getting user notifications', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get notifications'
        }
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await db.query(
        'SELECT * FROM notifications WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Notification not found'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error getting notification', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get notification'
        }
      });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await db.query(
        `UPDATE notifications 
         SET read = true, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Notification not found'
          }
        });
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error marking notification as read', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to mark notification as read'
        }
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await db.query(
        'DELETE FROM notifications WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Notification not found'
          }
        });
      }

      res.json({
        success: true,
        data: { message: 'Notification deleted successfully' }
      });
    } catch (error) {
      logger.error('Error deleting notification', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete notification'
        }
      });
    }
  }
}

export const notificationController = new NotificationController();

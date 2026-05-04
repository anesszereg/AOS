import { Request, Response } from 'express';
import { db } from '../config/database';
import { logger } from '../utils/logger';

export class AdminController {
  // Get pending restaurant applications
  async getPendingRestaurants(req: Request, res: Response) {
    try {
      const query = `
        SELECT 
          r.*,
          p.name as owner_name,
          p.phone as owner_phone,
          u.email as owner_email
        FROM restaurants r
        JOIN users u ON r.user_id = u.id
        LEFT JOIN profiles p ON r.user_id = p.user_id
        WHERE r.status = 'pending'
        ORDER BY r.created_at DESC
      `;

      const result = await db.query(query);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      logger.error('Error getting pending restaurants', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get pending restaurants',
        },
      });
    }
  }

  // Approve restaurant
  async approveRestaurant(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await db.query(
        `UPDATE restaurants 
         SET status = 'active', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND status = 'pending'
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESTAURANT_NOT_FOUND',
            message: 'Restaurant not found or already processed',
          },
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
        message: 'Restaurant approved successfully',
      });
    } catch (error) {
      logger.error('Error approving restaurant', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to approve restaurant',
        },
      });
    }
  }

  // Reject restaurant
  async rejectRestaurant(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'REASON_REQUIRED',
            message: 'Rejection reason is required',
          },
        });
      }

      const result = await db.query(
        `UPDATE restaurants 
         SET status = 'rejected', rejection_reason = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND status = 'pending'
         RETURNING *`,
        [reason, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESTAURANT_NOT_FOUND',
            message: 'Restaurant not found or already processed',
          },
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
        message: 'Restaurant rejected successfully',
      });
    } catch (error) {
      logger.error('Error rejecting restaurant', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to reject restaurant',
        },
      });
    }
  }
}

export const adminController = new AdminController();

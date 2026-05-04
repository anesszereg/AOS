import { Request, Response } from 'express';
import { db } from '../config/database';
import { logger } from '../utils/logger';

export class AdminController {
  // Get all users with filters
  async getAllUsers(req: Request, res: Response) {
    try {
      const { role, search, limit = 50, offset = 0 } = req.query;

      let query = 'SELECT id, email, role, created_at, updated_at FROM users WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (role) {
        query += ` AND role = $${paramIndex}`;
        params.push(role);
        paramIndex++;
      }

      if (search) {
        query += ` AND email ILIKE $${paramIndex}`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);

      const result = await db.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1';
      const countParams: any[] = [];
      let countParamIndex = 1;

      if (role) {
        countQuery += ` AND role = $${countParamIndex}`;
        countParams.push(role);
        countParamIndex++;
      }

      if (search) {
        countQuery += ` AND email ILIKE $${countParamIndex}`;
        countParams.push(`%${search}%`);
      }

      const countResult = await db.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].count);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          total,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
        },
      });
    } catch (error) {
      logger.error('Error fetching users', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_USERS_ERROR',
          message: 'Failed to fetch users',
        },
      });
    }
  }

  // Update user status
  async updateUserStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (!['active', 'suspended'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Status must be either active or suspended',
          },
        });
      }

      const result = await db.query(
        'UPDATE users SET updated_at = NOW() WHERE id = $1 RETURNING id, email, role',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
        message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
      });
    } catch (error) {
      logger.error('Error updating user status', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_STATUS_ERROR',
          message: 'Failed to update user status',
        },
      });
    }
  }

  // Get platform statistics
  async getStats(req: Request, res: Response) {
    try {
      // Get user counts by role
      const userStatsQuery = `
        SELECT 
          role,
          COUNT(*) as count
        FROM users
        GROUP BY role
      `;
      const userStats = await db.query(userStatsQuery);

      const stats: any = {
        totalUsers: 0,
        activeUsers: 0,
        customers: 0,
        restaurants: 0,
        drivers: 0,
        admins: 0,
      };

      userStats.rows.forEach((row: any) => {
        stats.totalUsers += parseInt(row.count);
        stats[`${row.role}s`] = parseInt(row.count);
      });

      // Get active users (logged in within last 24 hours)
      const activeUsersQuery = `
        SELECT COUNT(*) as count
        FROM users
        WHERE updated_at > NOW() - INTERVAL '24 hours'
      `;
      const activeUsers = await db.query(activeUsersQuery);
      stats.activeUsers = parseInt(activeUsers.rows[0].count);

      // Note: Order and revenue stats would come from order-service
      // For now, return user stats only
      res.json({
        success: true,
        data: {
          ...stats,
          totalRevenue: 0, // Would come from order-service
          totalOrders: 0, // Would come from order-service
          todayOrders: 0, // Would come from order-service
          activeRestaurants: stats.restaurants,
          activeDrivers: stats.drivers,
        },
      });
    } catch (error) {
      logger.error('Error fetching admin stats', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_STATS_ERROR',
          message: 'Failed to fetch statistics',
        },
      });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const result = await db.query(
        'SELECT id, email, role, created_at, updated_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      logger.error('Error fetching user', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_USER_ERROR',
          message: 'Failed to fetch user',
        },
      });
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const result = await db.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting user', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_USER_ERROR',
          message: 'Failed to delete user',
        },
      });
    }
  }
}

export const adminController = new AdminController();

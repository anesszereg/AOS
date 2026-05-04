import { Request, Response } from 'express';
import { db } from '../config/database';
import { logger } from '../utils/logger';

export class DriverController {
  // Update driver online/offline status
  async updateStatus(req: Request, res: Response) {
    try {
      const driverId = (req as any).user.id;
      const { status } = req.body;

      if (!['online', 'offline'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Status must be either online or offline',
          },
        });
      }

      // Update or create driver status
      const result = await db.query(
        `INSERT INTO driver_status (driver_id, status, last_location_update)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (driver_id) 
         DO UPDATE SET status = $2, last_location_update = CURRENT_TIMESTAMP
         RETURNING *`,
        [driverId, status]
      );

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      logger.error('Error updating driver status', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update driver status',
        },
      });
    }
  }

  // Get driver earnings
  async getEarnings(req: Request, res: Response) {
    try {
      const driverId = (req as any).user.id;
      const { period, startDate, endDate } = req.query;

      let dateFilter = '';
      const params: any[] = [driverId];
      let paramCount = 2;

      if (period === 'today') {
        dateFilter = `AND d.completed_at >= CURRENT_DATE`;
      } else if (period === 'week') {
        dateFilter = `AND d.completed_at >= CURRENT_DATE - INTERVAL '7 days'`;
      } else if (period === 'month') {
        dateFilter = `AND d.completed_at >= CURRENT_DATE - INTERVAL '30 days'`;
      } else if (startDate && endDate) {
        dateFilter = `AND d.completed_at BETWEEN $${paramCount} AND $${paramCount + 1}`;
        params.push(startDate, endDate);
        paramCount += 2;
      }

      const earningsQuery = `
        SELECT 
          COUNT(*) as total_deliveries,
          COALESCE(SUM(d.delivery_fee), 0) as total_earnings,
          COALESCE(AVG(d.delivery_fee), 0) as average_earning,
          COALESCE(SUM(d.tip), 0) as total_tips
        FROM deliveries d
        WHERE d.driver_id = $1 
        AND d.status = 'delivered'
        ${dateFilter}
      `;

      const result = await db.query(earningsQuery, params);

      // Get weekly breakdown
      const weeklyQuery = `
        SELECT 
          DATE_TRUNC('day', d.completed_at) as date,
          COUNT(*) as deliveries,
          COALESCE(SUM(d.delivery_fee), 0) as earnings
        FROM deliveries d
        WHERE d.driver_id = $1 
        AND d.status = 'delivered'
        AND d.completed_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE_TRUNC('day', d.completed_at)
        ORDER BY date DESC
      `;

      const weeklyResult = await db.query(weeklyQuery, [driverId]);

      res.json({
        success: true,
        data: {
          ...result.rows[0],
          weekly: weeklyResult.rows,
        },
      });
    } catch (error) {
      logger.error('Error getting driver earnings', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get driver earnings',
        },
      });
    }
  }

  // Get available orders for driver to accept
  async getAvailableOrders(req: Request, res: Response) {
    try {
      const driverId = (req as any).user.id;

      // Get orders that are ready for pickup and don't have a driver assigned
      const query = `
        SELECT 
          o.id,
          o.restaurant_id,
          o.delivery_address,
          o.total_amount,
          o.status,
          o.created_at,
          r.name as restaurant_name,
          r.address as pickup_address
        FROM orders o
        LEFT JOIN deliveries d ON o.id = d.order_id
        LEFT JOIN restaurants r ON o.restaurant_id = r.id
        WHERE o.status IN ('ready', 'confirmed')
        AND d.id IS NULL
        ORDER BY o.created_at ASC
        LIMIT 20
      `;

      const result = await db.query(query);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error) {
      logger.error('Error getting available orders', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get available orders',
        },
      });
    }
  }

  // Get driver statistics
  async getStats(req: Request, res: Response) {
    try {
      const driverId = (req as any).user.id;

      // Get overall stats
      const statsQuery = `
        SELECT 
          COUNT(*) FILTER (WHERE status = 'delivered') as total_deliveries,
          COUNT(*) FILTER (WHERE status IN ('assigned', 'picked_up', 'in_transit')) as active_deliveries,
          COALESCE(AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/60), 0) as avg_delivery_time,
          COALESCE(SUM(delivery_fee), 0) FILTER (WHERE status = 'delivered') as total_earnings
        FROM deliveries
        WHERE driver_id = $1
      `;

      const statsResult = await db.query(statsQuery, [driverId]);

      // Get today's stats
      const todayQuery = `
        SELECT 
          COUNT(*) as deliveries_today,
          COALESCE(SUM(delivery_fee), 0) as earnings_today
        FROM deliveries
        WHERE driver_id = $1 
        AND status = 'delivered'
        AND completed_at >= CURRENT_DATE
      `;

      const todayResult = await db.query(todayQuery, [driverId]);

      // Get driver rating
      const ratingQuery = `
        SELECT COALESCE(AVG(rating), 0) as average_rating
        FROM delivery_ratings
        WHERE driver_id = $1
      `;

      const ratingResult = await db.query(ratingQuery, [driverId]);

      res.json({
        success: true,
        data: {
          ...statsResult.rows[0],
          ...todayResult.rows[0],
          average_rating: parseFloat(ratingResult.rows[0].average_rating).toFixed(1),
        },
      });
    } catch (error) {
      logger.error('Error getting driver stats', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get driver statistics',
        },
      });
    }
  }

  // Get active delivery for driver
  async getActiveDelivery(req: Request, res: Response) {
    try {
      const driverId = (req as any).user.id;

      const query = `
        SELECT 
          d.*,
          o.total_amount,
          o.delivery_address,
          r.name as restaurant_name,
          r.address as pickup_address,
          r.phone as restaurant_phone
        FROM deliveries d
        JOIN orders o ON d.order_id = o.id
        JOIN restaurants r ON o.restaurant_id = r.id
        WHERE d.driver_id = $1 
        AND d.status IN ('assigned', 'picked_up', 'in_transit')
        ORDER BY d.created_at DESC
        LIMIT 1
      `;

      const result = await db.query(query, [driverId]);

      if (result.rows.length === 0) {
        return res.json({
          success: true,
          data: null,
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      logger.error('Error getting active delivery', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get active delivery',
        },
      });
    }
  }

  // Update driver location
  async updateLocation(req: Request, res: Response) {
    try {
      const driverId = (req as any).user.id;
      const { lat, lng } = req.body;

      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_LOCATION',
            message: 'Latitude and longitude are required',
          },
        });
      }

      // Update driver location
      const result = await db.query(
        `INSERT INTO driver_status (driver_id, latitude, longitude, last_location_update)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (driver_id) 
         DO UPDATE SET latitude = $2, longitude = $3, last_location_update = CURRENT_TIMESTAMP
         RETURNING *`,
        [driverId, lat, lng]
      );

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      logger.error('Error updating driver location', { error });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update location',
        },
      });
    }
  }
}

export const driverController = new DriverController();

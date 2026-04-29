import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, role, name, phone } = req.body;

      const result = await authService.register({
        email,
        password,
        role: role || 'customer',
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Registration error', { error: error.message });
      res.status(400).json({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: error.message,
        },
      });
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Login error', { error: error.message });
      res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: error.message,
        },
      });
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_REFRESH_TOKEN',
            message: 'Refresh token is required',
          },
        });
        return;
      }

      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Token refresh error', { error: error.message });
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: error.message,
        },
      });
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      logger.error('Logout error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: error.message,
        },
      });
    }
  }

  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Authorization token is required',
          },
        });
        return;
      }

      const token = authHeader.substring(7);
      const payload = await authService.verifyToken(token);

      res.status(200).json({
        success: true,
        data: {
          valid: true,
          user: {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
          },
        },
      });
    } catch (error: any) {
      logger.error('Token verification error', { error: error.message });
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: error.message,
        },
      });
    }
  }
}

export const authController = new AuthController();

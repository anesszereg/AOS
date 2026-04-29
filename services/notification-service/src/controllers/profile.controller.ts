import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { profileModel } from '../models/profile.model';
import { logger } from '../utils/logger';

export class ProfileController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await profileModel.findByUserId(userId);

      if (!profile) {
        res.status(404).json({
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Profile not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      logger.error('Get profile error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get profile',
        },
      });
    }
  }

  async createProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { name, phone, avatar, dateOfBirth } = req.body;

      const existing = await profileModel.findByUserId(userId);
      if (existing) {
        res.status(400).json({
          success: false,
          error: {
            code: 'PROFILE_EXISTS',
            message: 'Profile already exists',
          },
        });
        return;
      }

      const profile = await profileModel.create({
        userId,
        name,
        phone,
        avatar,
        dateOfBirth,
      });

      res.status(201).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      logger.error('Create profile error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create profile',
        },
      });
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { name, phone, avatar, dateOfBirth } = req.body;

      const profile = await profileModel.update(userId, {
        name,
        phone,
        avatar,
        dateOfBirth,
      });

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      logger.error('Update profile error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update profile',
        },
      });
    }
  }
}

export const profileController = new ProfileController();

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { userModel, CreateUserDto, User } from '../models/user.model';
import { refreshTokenModel } from '../models/refresh-token.model';
import { logger } from '../utils/logger';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  tokens: AuthTokens;
}

export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'your-access-secret-key';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  async register(data: CreateUserDto): Promise<AuthResponse> {
    const existingUser = await userModel.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = await userModel.create(data);
    logger.info('User registered', { userId: user.id, email: user.email });

    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const isPasswordValid = await userModel.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    await userModel.updateLastLogin(user.id);
    logger.info('User logged in', { userId: user.id, email: user.email });

    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const storedToken = await refreshTokenModel.findByToken(refreshToken);
    if (!storedToken) {
      throw new Error('Invalid or expired refresh token');
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(refreshToken, this.refreshTokenSecret) as JwtPayload;
    } catch (error) {
      await refreshTokenModel.revoke(refreshToken);
      throw new Error('Invalid refresh token');
    }

    const user = await userModel.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    const accessToken = this.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    await refreshTokenModel.revoke(refreshToken);
    logger.info('User logged out');
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const payload = jwt.verify(token, this.accessTokenSecret) as JwtPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await refreshTokenModel.create(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
    };
  }

  private generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  private generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }
}

export const authService = new AuthService();

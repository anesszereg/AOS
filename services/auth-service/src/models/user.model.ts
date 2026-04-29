import { db } from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'restaurant' | 'driver' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: 'customer' | 'restaurant' | 'driver' | 'admin';
}

export class UserModel {
  async create(data: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    const result = await db.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, password_hash as "passwordHash", role, 
                 is_active as "isActive", email_verified as "emailVerified",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      [data.email, passwordHash, data.role]
    );

    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query(
      `SELECT id, email, password_hash as "passwordHash", role,
              is_active as "isActive", email_verified as "emailVerified",
              created_at as "createdAt", updated_at as "updatedAt",
              last_login as "lastLogin"
       FROM users
       WHERE email = $1`,
      [email]
    );

    return result.rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.query(
      `SELECT id, email, password_hash as "passwordHash", role,
              is_active as "isActive", email_verified as "emailVerified",
              created_at as "createdAt", updated_at as "updatedAt",
              last_login as "lastLogin"
       FROM users
       WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await db.query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [userId]
    );
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      [passwordHash, userId]
    );
  }

  async verifyEmail(userId: string): Promise<void> {
    await db.query(
      `UPDATE users SET email_verified = true WHERE id = $1`,
      [userId]
    );
  }

  async deactivate(userId: string): Promise<void> {
    await db.query(
      `UPDATE users SET is_active = false WHERE id = $1`,
      [userId]
    );
  }
}

export const userModel = new UserModel();

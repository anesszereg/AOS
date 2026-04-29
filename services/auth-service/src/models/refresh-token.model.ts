import { db } from '../config/database';

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
}

export class RefreshTokenModel {
  async create(userId: string, token: string, expiresAt: Date): Promise<RefreshToken> {
    const result = await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)
       RETURNING id, user_id as "userId", token, expires_at as "expiresAt",
                 created_at as "createdAt", revoked`,
      [userId, token, expiresAt]
    );

    return result.rows[0];
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const result = await db.query(
      `SELECT id, user_id as "userId", token, expires_at as "expiresAt",
              created_at as "createdAt", revoked
       FROM refresh_tokens
       WHERE token = $1 AND revoked = false AND expires_at > CURRENT_TIMESTAMP`,
      [token]
    );

    return result.rows[0] || null;
  }

  async revoke(token: string): Promise<void> {
    await db.query(
      `UPDATE refresh_tokens SET revoked = true WHERE token = $1`,
      [token]
    );
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await db.query(
      `UPDATE refresh_tokens SET revoked = true WHERE user_id = $1`,
      [userId]
    );
  }

  async deleteExpired(): Promise<void> {
    await db.query(
      `DELETE FROM refresh_tokens WHERE expires_at < CURRENT_TIMESTAMP`
    );
  }
}

export const refreshTokenModel = new RefreshTokenModel();

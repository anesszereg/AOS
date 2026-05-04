import { db } from '../config/database';

export interface Profile {
  id: string;
  userId: string;
  name: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProfileDto {
  userId: string;
  name: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
}

export class ProfileModel {
  async create(data: CreateProfileDto): Promise<Profile> {
    const result = await db.query(
      `INSERT INTO profiles (user_id, name, phone, avatar, date_of_birth)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id as "userId", name, phone, avatar,
                 date_of_birth as "dateOfBirth",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      [data.userId, data.name, data.phone, data.avatar, data.dateOfBirth]
    );
    return result.rows[0];
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const result = await db.query(
      `SELECT id, user_id as "userId", name, phone, avatar,
              date_of_birth as "dateOfBirth",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM profiles
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  async update(userId: string, data: Partial<CreateProfileDto>): Promise<Profile> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(data.phone);
    }
    if (data.avatar !== undefined) {
      fields.push(`avatar = $${paramCount++}`);
      values.push(data.avatar);
    }
    if (data.dateOfBirth !== undefined) {
      fields.push(`date_of_birth = $${paramCount++}`);
      values.push(data.dateOfBirth);
    }

    values.push(userId);

    const result = await db.query(
      `UPDATE profiles
       SET ${fields.join(', ')}
       WHERE user_id = $${paramCount}
       RETURNING id, user_id as "userId", name, phone, avatar,
                 date_of_birth as "dateOfBirth",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      values
    );
    return result.rows[0];
  }
}

export const profileModel = new ProfileModel();

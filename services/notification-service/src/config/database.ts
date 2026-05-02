import { Pool } from 'pg';
import { logger } from '../utils/logger';

export class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    const config = process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        }
      : {
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT || '5432'),
          database: process.env.DATABASE_NAME || 'notification_db',
          user: process.env.DATABASE_USER || 'postgres',
          password: process.env.DATABASE_PASSWORD || '',
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        };

    this.pool = new Pool(config);

    this.pool.on('error', (err: Error) => {
      logger.error('Unexpected database error', err);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      logger.error('Database query error', { text, error });
      throw error;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
    logger.info('Database connection pool closed');
  }

  public async initializeSchema(): Promise<void> {
    const client = await this.pool.connect();
    try {
      const lockId = 123456789;
      const lockResult = await client.query('SELECT pg_try_advisory_lock($1)', [lockId]);
      if (!lockResult.rows[0].pg_try_advisory_lock) {
        logger.info('Schema initialization already in progress, skipping...');
        return;
      }
      await client.query('BEGIN');

      await client.query(`
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          avatar VARCHAR(500),
          date_of_birth DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS addresses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          label VARCHAR(50),
          street VARCHAR(255) NOT NULL,
          city VARCHAR(100) NOT NULL,
          state VARCHAR(100) NOT NULL,
          zip_code VARCHAR(20) NOT NULL,
          country VARCHAR(100) DEFAULT 'USA',
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          is_default BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS preferences (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID UNIQUE NOT NULL,
          notifications_enabled BOOLEAN DEFAULT true,
          email_notifications BOOLEAN DEFAULT true,
          sms_notifications BOOLEAN DEFAULT true,
          push_notifications BOOLEAN DEFAULT true,
          language VARCHAR(10) DEFAULT 'en',
          currency VARCHAR(10) DEFAULT 'USD',
          dietary_restrictions JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);

      await client.query(`
        DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
        CREATE TRIGGER update_profiles_updated_at 
        BEFORE UPDATE ON profiles
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);

      await client.query(`
        DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
        CREATE TRIGGER update_addresses_updated_at 
        BEFORE UPDATE ON addresses
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);

      await client.query('COMMIT');
      await client.query('SELECT pg_advisory_unlock($1)', [123456789]);
      logger.info('Database schema initialized successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      try { await client.query('SELECT pg_advisory_unlock($1)', [123456789]); } catch (unlockError) {}
      logger.error('Failed to initialize database schema', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export const db = Database.getInstance();

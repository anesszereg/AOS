import { Pool } from 'pg';
import { logger } from '../utils/logger';

export class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    // Use DATABASE_URL if available, otherwise fall back to individual env vars
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
          database: process.env.DATABASE_NAME || 'restaurant_db',
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

      console.log('Creating restaurants table...');
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS restaurants (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner_id UUID NOT NULL,
          name VARCHAR(255) NOT NULL,
          cuisine VARCHAR(100),
          description TEXT,
          address_street VARCHAR(255),
          address_city VARCHAR(100),
          address_state VARCHAR(100),
          address_zip VARCHAR(20),
          phone VARCHAR(20),
          email VARCHAR(255),
          rating DECIMAL(3, 2) DEFAULT 0,
          estimated_delivery_time VARCHAR(50) DEFAULT '30-45 min',
          delivery_fee DECIMAL(10, 2) DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          image VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      console.log('Creating indexes...');

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON restaurants(owner_id);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_restaurants_is_active ON restaurants(is_active);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating);
      `);

      console.log('Creating updated_at trigger...');

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
        DROP TRIGGER IF EXISTS update_restaurants_updated_at ON restaurants;
        CREATE TRIGGER update_restaurants_updated_at 
        BEFORE UPDATE ON restaurants
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);

      console.log('Restaurant schema initialized successfully');

      await client.query('COMMIT');
      await client.query('SELECT pg_advisory_unlock($1)', [lockId]);
      logger.info('Restaurant database schema initialized successfully');
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Failed to initialize restaurant schema', { error });
      throw error;
    } finally {
      client.release();
    }
  }
}

export const db = Database.getInstance();

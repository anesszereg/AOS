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
          database: process.env.DATABASE_NAME || 'menu_db',
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
        CREATE TABLE IF NOT EXISTS menu_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          restaurant_id UUID NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          category VARCHAR(100),
          image VARCHAR(500),
          available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
      `);

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
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
        DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
        CREATE TRIGGER update_menu_items_updated_at 
        BEFORE UPDATE ON menu_items
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

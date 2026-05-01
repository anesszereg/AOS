import { Pool, PoolConfig } from 'pg';
import { parse } from 'pg-connection-string';

/**
 * Parse DATABASE_URL or use individual environment variables
 */
export function getDatabaseConfig(serviceName: string): PoolConfig {
  // If DATABASE_URL is provided, parse it
  if (process.env.DATABASE_URL) {
    const config = parse(process.env.DATABASE_URL);
    return {
      host: config.host || undefined,
      port: config.port ? parseInt(config.port) : undefined,
      database: config.database || undefined,
      user: config.user || undefined,
      password: config.password || undefined,
      ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
  }

  // Fallback to individual environment variables
  return {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    database: process.env.DATABASE_NAME || `${serviceName}_db`,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
}

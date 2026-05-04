import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { db } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    await db.initializeSchema();
    logger.info('Database initialized');

    const app = createApp();

    const server = app.listen(PORT, () => {
      logger.info(`User service listening on port ${PORT}`);
    });

    const gracefulShutdown = async () => {
      logger.info('Shutting down gracefully...');
      server.close(async () => {
        await db.close();
        logger.info('Server closed');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

startServer();

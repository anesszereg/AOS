import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { db } from './config/database';
import { logger } from './utils/logger';
import Consul from 'consul';
// const { infrastructure } = require('./utils/infrastructure-init.js');

const PORT = process.env.PORT || 3001;
const SERVICE_NAME = process.env.SERVICE_NAME || 'auth-service';
const SERVICE_HOST = process.env.SERVICE_HOST || 'localhost';

let consul: Consul.Consul | null = null;
let serviceId: string | null = null;

async function startServer() {
  try {
    await db.initializeSchema();
    logger.info('Database initialized');

    // Initialize infrastructure (RabbitMQ, Redis, Consul) - non-blocking
    // TODO: Re-enable after fixing module loading issue
    // infrastructure.initialize(SERVICE_NAME, Number(PORT)).catch((error) => {
    //   logger.warn('Infrastructure initialization failed, continuing without it', { error });
    // });

    if (process.env.CONSUL_HOST) {
      try {
        consul = new Consul({
          host: process.env.CONSUL_HOST,
          port: process.env.CONSUL_PORT || '8500',
          promisify: true,
        });

        serviceId = `${SERVICE_NAME}-${PORT}`;
        await consul.agent.service.register({
          name: SERVICE_NAME,
          id: serviceId,
          address: SERVICE_HOST,
          port: Number(PORT),
          tags: ['auth', 'api'],
          check: {
            http: `http://${SERVICE_HOST}:${PORT}/health`,
            interval: '10s',
            timeout: '5s',
          },
        });

        logger.info('Service registered with Consul', { serviceId });
      } catch (error) {
        logger.warn('Failed to register with Consul', { error });
      }
    }

    const app = createApp();

    const server = app.listen(PORT, () => {
      logger.info(`Auth service listening on port ${PORT}`);
    });

    const gracefulShutdown = async () => {
      logger.info('Shutting down gracefully...');

      server.close(async () => {
        if (consul && serviceId) {
          try {
            await consul.agent.service.deregister(serviceId);
            logger.info('Service deregistered from Consul');
          } catch (error) {
            logger.error('Failed to deregister from Consul', { error });
          }
        }

        // Shutdown infrastructure
        // TODO: Re-enable after fixing module loading issue
        // await infrastructure.shutdown();

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

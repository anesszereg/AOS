import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { db } from './config/database';
import { logger } from './utils/logger';
import Consul from 'consul';
const { infrastructure } = require('./utils/infrastructure-init.js');

const PORT = process.env.PORT || 3001;
const SERVICE_NAME = process.env.SERVICE_NAME || 'auth-service';
const SERVICE_HOST = process.env.SERVICE_HOST || 'localhost';

let consul: Consul.Consul | null = null;
let serviceId: string | null = null;

async function startServer() {
  try {
    await db.initializeSchema();
    logger.info('Database initialized');

    const app = createApp();

    const server = app.listen(PORT, () => {
      logger.info(`Auth service listening on port ${PORT}`);
      
      // Initialize infrastructure AFTER server starts (non-blocking)
      infrastructure.initialize(SERVICE_NAME, Number(PORT)).catch((error) => {
        logger.warn('Infrastructure initialization failed, continuing without it', { error });
      });

      // Register with Consul AFTER server starts (non-blocking)
      if (process.env.CONSUL_HOST) {
        setTimeout(async () => {
          try {
            const consulConfig: any = {
              promisify: true,
            };

            if (process.env.CONSUL_HOST.startsWith('https://')) {
              consulConfig.host = process.env.CONSUL_HOST.replace('https://', '');
              consulConfig.port = process.env.CONSUL_PORT || '443';
              consulConfig.secure = true;
              if (process.env.CONSUL_TOKEN) {
                consulConfig.defaults = {
                  token: process.env.CONSUL_TOKEN,
                };
              }
            } else {
              consulConfig.host = process.env.CONSUL_HOST;
              consulConfig.port = process.env.CONSUL_PORT || '8500';
            }

            consul = new Consul(consulConfig);
            serviceId = `${SERVICE_NAME}-${PORT}`;
            
            await consul.agent.service.register({
              name: SERVICE_NAME,
              id: serviceId,
              address: SERVICE_HOST,
              port: Number(PORT),
              tags: ['auth', 'api', 'microservice'],
              check: {
                http: `http://${SERVICE_HOST}:${PORT}/health`,
                interval: '10s',
              },
            });

            logger.info('Service registered with Consul', { 
              serviceId, 
              consulHost: consulConfig.host 
            });
          } catch (error) {
            logger.warn('Failed to register with Consul', { 
              error: error.message,
              consulHost: process.env.CONSUL_HOST 
            });
          }
        }, 1000); // Register after 1 second delay
      }
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
        await infrastructure.shutdown();

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

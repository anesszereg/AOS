import Consul from 'consul';

export interface ServiceConfig {
  name: string;
  id: string;
  address: string;
  port: number;
  tags?: string[];
  meta?: Record<string, string>;
}

export class ConsulClient {
  private consul: Consul.Consul;
  private serviceId: string | null = null;

  constructor(consulHost: string = process.env.CONSUL_HOST || 'localhost') {
    this.consul = new Consul({
      host: consulHost,
      port: '8500',
      promisify: true,
    });
  }

  async registerService(config: ServiceConfig): Promise<void> {
    try {
      const registration: Consul.Agent.Service.RegisterOptions = {
        name: config.name,
        id: config.id,
        address: config.address,
        port: config.port,
        tags: config.tags || [],
        meta: config.meta || {},
        check: {
          http: `http://${config.address}:${config.port}/health`,
          interval: '10s',
          timeout: '5s',
          deregistercriticalserviceafter: '1m',
        },
      };

      await this.consul.agent.service.register(registration);
      this.serviceId = config.id;
      console.log(`Service registered with Consul: ${config.id}`);
    } catch (error) {
      console.error('Failed to register service with Consul:', error);
      throw error;
    }
  }

  async deregisterService(): Promise<void> {
    if (!this.serviceId) {
      return;
    }

    try {
      await this.consul.agent.service.deregister(this.serviceId);
      console.log(`Service deregistered from Consul: ${this.serviceId}`);
    } catch (error) {
      console.error('Failed to deregister service from Consul:', error);
    }
  }

  async getService(serviceName: string): Promise<Consul.Agent.Service[]> {
    try {
      const result = await this.consul.health.service({
        service: serviceName,
        passing: true,
      });
      return result as any;
    } catch (error) {
      console.error(`Failed to get service ${serviceName} from Consul:`, error);
      return [];
    }
  }

  async getServiceAddress(serviceName: string): Promise<string | null> {
    const services = await this.getService(serviceName);
    if (services.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * services.length);
    const service = services[randomIndex] as any;
    return `http://${service.Service.Address}:${service.Service.Port}`;
  }

  async setKeyValue(key: string, value: string): Promise<void> {
    try {
      await this.consul.kv.set(key, value);
    } catch (error) {
      console.error(`Failed to set key ${key} in Consul:`, error);
      throw error;
    }
  }

  async getKeyValue(key: string): Promise<string | null> {
    try {
      const result = await this.consul.kv.get(key);
      return result ? (result as any).Value : null;
    } catch (error) {
      console.error(`Failed to get key ${key} from Consul:`, error);
      return null;
    }
  }
}

export const createConsulClient = (): ConsulClient => {
  return new ConsulClient();
};

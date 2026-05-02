import { Registry, Counter, Histogram, Gauge } from 'prom-client';

export class MetricsCollector {
  private static instance: MetricsCollector;
  public registry: Registry;

  // HTTP Metrics
  public httpRequestsTotal: Counter;
  public httpRequestDuration: Histogram;
  public httpRequestsInFlight: Gauge;

  // Database Metrics
  public dbQueriesTotal: Counter;
  public dbQueryDuration: Histogram;
  public dbConnectionsActive: Gauge;

  // Business Metrics
  public ordersCreated: Counter;
  public paymentsProcessed: Counter;
  public deliveriesCompleted: Counter;

  // Event Metrics
  public eventsPublished: Counter;
  public eventsConsumed: Counter;
  public eventProcessingDuration: Histogram;

  private constructor() {
    this.registry = new Registry();

    // HTTP Metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    });

    this.httpRequestsInFlight = new Gauge({
      name: 'http_requests_in_flight',
      help: 'Number of HTTP requests currently being processed',
      registers: [this.registry],
    });

    // Database Metrics
    this.dbQueriesTotal = new Counter({
      name: 'db_queries_total',
      help: 'Total number of database queries',
      labelNames: ['operation', 'table'],
      registers: [this.registry],
    });

    this.dbQueryDuration = new Histogram({
      name: 'db_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'table'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1],
      registers: [this.registry],
    });

    this.dbConnectionsActive = new Gauge({
      name: 'db_connections_active',
      help: 'Number of active database connections',
      registers: [this.registry],
    });

    // Business Metrics
    this.ordersCreated = new Counter({
      name: 'orders_created_total',
      help: 'Total number of orders created',
      labelNames: ['restaurant_id'],
      registers: [this.registry],
    });

    this.paymentsProcessed = new Counter({
      name: 'payments_processed_total',
      help: 'Total number of payments processed',
      labelNames: ['status', 'method'],
      registers: [this.registry],
    });

    this.deliveriesCompleted = new Counter({
      name: 'deliveries_completed_total',
      help: 'Total number of deliveries completed',
      labelNames: ['driver_id'],
      registers: [this.registry],
    });

    // Event Metrics
    this.eventsPublished = new Counter({
      name: 'events_published_total',
      help: 'Total number of events published',
      labelNames: ['event_type'],
      registers: [this.registry],
    });

    this.eventsConsumed = new Counter({
      name: 'events_consumed_total',
      help: 'Total number of events consumed',
      labelNames: ['event_type', 'status'],
      registers: [this.registry],
    });

    this.eventProcessingDuration = new Histogram({
      name: 'event_processing_duration_seconds',
      help: 'Duration of event processing in seconds',
      labelNames: ['event_type'],
      buckets: [0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    });

    console.log('[Metrics] Collector initialized');
  }

  public static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  public async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}

// Middleware for Express
export function metricsMiddleware() {
  const metrics = MetricsCollector.getInstance();

  return (req: any, res: any, next: any) => {
    const start = Date.now();
    metrics.httpRequestsInFlight.inc();

    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const labels = {
        method: req.method,
        route: req.route?.path || req.path,
        status_code: res.statusCode,
      };

      metrics.httpRequestsTotal.inc(labels);
      metrics.httpRequestDuration.observe(labels, duration);
      metrics.httpRequestsInFlight.dec();
    });

    next();
  };
}

export const metrics = MetricsCollector.getInstance();

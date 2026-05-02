import { EventBus } from '../events/event-bus';
import { DomainEvent } from '../events/event-types';

export interface SagaStep {
  execute: () => Promise<void>;
  compensate: () => Promise<void>;
}

export class Saga {
  private steps: SagaStep[] = [];
  private executedSteps: SagaStep[] = [];
  private eventBus: EventBus;

  constructor() {
    this.eventBus = EventBus.getInstance();
  }

  addStep(step: SagaStep): Saga {
    this.steps.push(step);
    return this;
  }

  async execute(): Promise<{ success: boolean; error?: Error }> {
    try {
      for (const step of this.steps) {
        console.log('[Saga] Executing step...');
        await step.execute();
        this.executedSteps.push(step);
      }
      console.log('[Saga] All steps completed successfully');
      return { success: true };
    } catch (error) {
      console.error('[Saga] Step failed, starting compensation:', error);
      await this.compensate();
      return { success: false, error: error as Error };
    }
  }

  private async compensate(): Promise<void> {
    console.log('[Saga] Starting compensation for', this.executedSteps.length, 'steps');
    
    // Compensate in reverse order
    for (let i = this.executedSteps.length - 1; i >= 0; i--) {
      try {
        console.log(`[Saga] Compensating step ${i + 1}/${this.executedSteps.length}`);
        await this.executedSteps[i].compensate();
      } catch (error) {
        console.error(`[Saga] Compensation failed for step ${i}:`, error);
        // Continue compensating other steps even if one fails
      }
    }
    
    console.log('[Saga] Compensation completed');
  }
}

// Example: Order Creation Saga
export class OrderCreationSaga extends Saga {
  constructor(
    private orderId: string,
    private userId: string,
    private amount: number
  ) {
    super();
    this.setupSteps();
  }

  private setupSteps() {
    // Step 1: Reserve inventory
    this.addStep({
      execute: async () => {
        console.log('[OrderSaga] Reserving inventory for order:', this.orderId);
        // Call inventory service
      },
      compensate: async () => {
        console.log('[OrderSaga] Releasing inventory for order:', this.orderId);
        // Release inventory
      },
    });

    // Step 2: Process payment
    this.addStep({
      execute: async () => {
        console.log('[OrderSaga] Processing payment for order:', this.orderId);
        // Call payment service
      },
      compensate: async () => {
        console.log('[OrderSaga] Refunding payment for order:', this.orderId);
        // Refund payment
      },
    });

    // Step 3: Assign delivery
    this.addStep({
      execute: async () => {
        console.log('[OrderSaga] Assigning delivery for order:', this.orderId);
        // Call delivery service
      },
      compensate: async () => {
        console.log('[OrderSaga] Cancelling delivery for order:', this.orderId);
        // Cancel delivery assignment
      },
    });
  }
}

// service layer (pause/resume/cancel)

import type { SubscriptionContract } from '../types.js';
import { contractStore } from './fixtures.js';

export class ShopifyServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = 'ShopifyServiceError';
  }
}

export class ShopifyService {
  // Returns ALL contracts (in real app, would filter by customerId)
  getContractsByCustomer(_customerId: string): SubscriptionContract[] {
    return Array.from(contractStore.values());
  }

  getContractById(id: string): SubscriptionContract | null {
    return contractStore.get(id) ?? null;
  }

  pauseContract(id: string, resumeDate?: string | null): SubscriptionContract {
    const contract = this.requireContract(id);

    // Validate the state transition
    // You can only pause an ACTIVE subscription
    if (contract.status !== 'ACTIVE') {
      throw new ShopifyServiceError(
        'Only active subscriptions can be paused.',
        'INVALID_STATUS_TRANSITION',
        'subscriptionId',
      );
    }

    //Create the updated contract object
    const updated: SubscriptionContract = {
      ...contract,
      status: 'PAUSED',
      nextBillingDate: resumeDate ?? null,
      updatedAt: new Date().toISOString(),
    };

    contractStore.set(id, updated);
    return updated;
  }

  resumeContract(id: string): SubscriptionContract {
    const contract = this.requireContract(id);

    // Can only resume a PAUSED subscription
    if (contract.status !== 'PAUSED') {
      throw new ShopifyServiceError(
        'Only paused subscriptions can be resumed.',
        'INVALID_STATUS_TRANSITION',
        'subscriptionId',
      );
    }

    // Calculate next billing date = 30 days from today
    const nextBilling = new Date();
    nextBilling.setDate(nextBilling.getDate() + 30);

    const updated: SubscriptionContract = {
      ...contract,
      status: 'ACTIVE',
      nextBillingDate: nextBilling.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    contractStore.set(id, updated);
    return updated;
  }

  skipNextDelivery(id: string): SubscriptionContract {
    const contract = this.requireContract(id);

    if (contract.status !== 'ACTIVE') {
      throw new ShopifyServiceError(
        'Can only skip deliveries on active subscriptions.',
        'INVALID_STATUS_TRANSITION',
        'subscriptionId',
      );
    }

    if (contract.nextBillingDate == null) {
      throw new ShopifyServiceError(
        'No next billing date set.',
        'NO_BILLING_DATE',
        'subscriptionId',
      );
    }

    // Advance the nextBillingDate by exactly one billing cycle
    const current = new Date(contract.nextBillingDate);
    const { intervalCount, interval } = contract.billingFrequency;

    switch (interval) {
      case 'DAY':
        current.setDate(current.getDate() + intervalCount);
        break;
      case 'WEEK':
        // 1 week = 7 days, so 2 weeks = 14 days
        current.setDate(current.getDate() + intervalCount * 7);
        break;
      case 'MONTH':
        current.setMonth(current.getMonth() + intervalCount);
        break;
      case 'YEAR':
        current.setFullYear(current.getFullYear() + intervalCount);
        break;
    }

    const updated: SubscriptionContract = {
      ...contract,
      nextBillingDate: current.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    contractStore.set(id, updated);
    return updated;
  }

  cancelContract(id: string, _reason?: string | null): SubscriptionContract {
    const contract = this.requireContract(id);

    // Can't cancel what's already cancelled
    if (contract.status === 'CANCELLED') {
      throw new ShopifyServiceError(
        'Subscription is already cancelled.',
        'ALREADY_CANCELLED',
        'subscriptionId',
      );
    }

    // In a real app: _reason would be logged to Shopify or analytics
    const updated: SubscriptionContract = {
      ...contract,
      status: 'CANCELLED',
      nextBillingDate: null, // no future billing after cancel
      updatedAt: new Date().toISOString(),
    };

    contractStore.set(id, updated);
    return updated;
  }

  //every mutation calls this instead of duplicating
  private requireContract(id: string): SubscriptionContract {
    const contract = contractStore.get(id);
    if (contract == null) {
      throw new ShopifyServiceError(
        `Subscription "${id}" not found.`,
        'NOT_FOUND',
        'subscriptionId',
      );
    }
    return contract;
  }
}

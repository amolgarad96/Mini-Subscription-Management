// packages/shared/src/types.ts
export type SubscriptionStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'FAILED' | 'EXPIRED';

export type BillingFrequencyInterval = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export interface BillingFrequency {
  intervalCount: number;
  interval: BillingFrequencyInterval;
}

export interface MoneyAmount {
  amount: string;
  currencyCode: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  zip: string;
  country: string;
}

export interface SubscriptionLineItem {
  id: string;
  title: string;
  variantTitle: string | null;
  quantity: number;
  unitPrice: MoneyAmount;
  totalPrice: MoneyAmount;
  sku: string | null;
  imageUrl: string | null;
}

export interface SubscriptionContract {
  id: string;
  status: SubscriptionStatus;
  nextBillingDate: string | null;
  billingFrequency: BillingFrequency;
  lineItems: SubscriptionLineItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}
// apps/api/src/shopify/fixtures.ts
import type { SubscriptionContract } from '../types';

export const mockContracts: SubscriptionContract[] = [
  {
    id: 'sub_001',
    status: 'ACTIVE',
    nextBillingDate: '2026-06-01T00:00:00Z',
    billingFrequency: { intervalCount: 1, interval: 'MONTH' },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-05-01T08:00:00Z',
    shippingAddress: {
      firstName: 'Arjun',
      lastName: 'Sharma',
      address1: '42 Koregaon Park',
      address2: null,
      city: 'Pune',
      province: 'Maharashtra',
      zip: '411001',
      country: 'IN',
    },
    lineItems: [
      {
        id: 'line_001',
        title: 'Organic Coffee Blend',
        variantTitle: '500g / Dark Roast',
        quantity: 2,
        unitPrice: { amount: '18.99', currencyCode: 'USD' },
        totalPrice: { amount: '37.98', currencyCode: 'USD' },
        sku: 'COFFEE-500-DR',
        imageUrl: null,
      },
    ],
  },
  {
    id: 'sub_002',
    status: 'PAUSED',
    nextBillingDate: null,
    billingFrequency: { intervalCount: 2, interval: 'WEEK' },
    createdAt: '2025-02-20T12:00:00Z',
    updatedAt: '2025-04-10T14:00:00Z',
    shippingAddress: {
      firstName: 'Arjun',
      lastName: 'Sharma',
      address1: '42 Koregaon Park',
      address2: 'Apt 3B',
      city: 'Pune',
      province: 'Maharashtra',
      zip: '411001',
      country: 'IN',
    },
    lineItems: [
      {
        id: 'line_002',
        title: 'Vitamin D3 + K2',
        variantTitle: '90 capsules',
        quantity: 1,
        unitPrice: { amount: '29.99', currencyCode: 'USD' },
        totalPrice: { amount: '29.99', currencyCode: 'USD' },
        sku: 'VIT-D3K2-90',
        imageUrl: null,
      },
      {
        id: 'line_003',
        title: 'Omega-3 Fish Oil',
        variantTitle: '120 softgels',
        quantity: 1,
        unitPrice: { amount: '24.99', currencyCode: 'USD' },
        totalPrice: { amount: '24.99', currencyCode: 'USD' },
        sku: 'OMEGA3-120',
        imageUrl: null,
      },
    ],
  },
  {
    id: 'sub_003',
    status: 'ACTIVE',
    nextBillingDate: '2026-05-20T00:00:00Z',
    billingFrequency: { intervalCount: 3, interval: 'MONTH' },
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2025-05-03T07:30:00Z',
    shippingAddress: {
      firstName: 'Arjun',
      lastName: 'Sharma',
      address1: '42 Koregaon Park',
      address2: null,
      city: 'Pune',
      province: 'Maharashtra',
      zip: '411001',
      country: 'IN',
    },
    lineItems: [
      {
        id: 'line_004',
        title: 'Premium Skincare Kit',
        variantTitle: 'Normal / Oily',
        quantity: 1,
        unitPrice: { amount: '89.00', currencyCode: 'USD' },
        totalPrice: { amount: '89.00', currencyCode: 'USD' },
        sku: 'SKIN-KIT-NO',
        imageUrl: null,
      },
    ],
  },
];

// Mutable in-memory store for mutations
export const contractStore = new Map<string, SubscriptionContract>(
  mockContracts.map((c) => [c.id, { ...c }]),
);
import { z } from 'zod';
import { ShopifyService, ShopifyServiceError } from '../Shopify/ShopifyService.js';

// Validates the input for pauseSubscription mutation
const PauseInputSchema = z.object({
  subscriptionId: z.string().min(1, 'subscriptionId is required'),
  resumeDate: z
    .string()
    .datetime({ message: 'resumeDate must be a valid ISO datetime (e.g. 2026-09-01T00:00:00Z)' })
    .nullable() // can be null
    .optional(), // can be omitted entirely
});

// Validates the input for cancelSubscription mutation
const CancelInputSchema = z.object({
  subscriptionId: z.string().min(1, 'subscriptionId is required'),
  reason: z.string().max(500, 'Reason must be under 500 characters').nullable().optional(),
});

type UserError = {
  field: string | null;
  message: string;
  code: string;
};

// Converts any caught error into the UserError array format
// So the frontend always gets a consistent error shape
function toUserErrors(err: unknown): UserError[] {
  if (err instanceof ShopifyServiceError) {
    return [
      {
        field: err.field ?? null,
        message: err.message,
        code: err.code,
      },
    ];
  }
  return [
    {
      field: null,
      message: 'An unexpected error occurred. Please try again.',
      code: 'INTERNAL_ERROR',
    },
  ];
}

// We pass shopify as a parameter (Dependency Injection pattern).
// This makes it easy to swap in a mock service during tests.
export function buildResolvers(shopify: ShopifyService) {
  return {
    Query: {
      // Called when frontend runs: query { subscriptions(customerId: "x") }
      subscriptions: (_: unknown, args: { customerId: string }) => {
        return shopify.getContractsByCustomer(args.customerId);
      },

      // Called when frontend runs: query { subscription(id: "sub_001") }
      subscription: (_: unknown, args: { id: string }) => {
        return shopify.getContractById(args.id);
      },
    },

    // Mutation is used if we want to do something
    Mutation: {
      pauseSubscription: (
        _: unknown,
        args: { input: { subscriptionId: string; resumeDate?: string | null } },
      ) => {
        //Validate input with Zod
        const parsed = PauseInputSchema.safeParse(args.input);

        if (!parsed.success) {
          // Zod found validation errors — return them as userErrors
          return {
            contract: null,
            userErrors: parsed.error.issues.map((issue: any) => ({
              field: issue.path.join('.') || null,
              message: issue.message,
              code: 'VALIDATION_ERROR',
            })),
          };
        }

        // Call the service (which can also throw)
        try {
          const contract = shopify.pauseContract(
            parsed.data.subscriptionId,
            parsed.data.resumeDate,
          );
          // Success — return the updated contract with empty errors
          return { contract, userErrors: [] };
        } catch (err) {
          return { contract: null, userErrors: toUserErrors(err) };
        }
      },

      resumeSubscription: (_: unknown, args: { subscriptionId: string }) => {
        // Resume has no complex input, so no Zod needed
        try {
          const contract = shopify.resumeContract(args.subscriptionId);
          return { contract, userErrors: [] };
        } catch (err) {
          return { contract: null, userErrors: toUserErrors(err) };
        }
      },

      skipNextDelivery: (_: unknown, args: { subscriptionId: string }) => {
        try {
          const contract = shopify.skipNextDelivery(args.subscriptionId);
          return { contract, userErrors: [] };
        } catch (err) {
          return { contract: null, userErrors: toUserErrors(err) };
        }
      },

      cancelSubscription: (
        _: unknown,
        args: { input: { subscriptionId: string; reason?: string | null } },
      ) => {
        const parsed = CancelInputSchema.safeParse(args.input);

        if (!parsed.success) {
          return {
            contract: null,
            userErrors: parsed.error.issues.map((issue: any) => ({
              field: issue.path.join('.') || null,
              message: issue.message,
              code: 'VALIDATION_ERROR',
            })),
          };
        }

        try {
          const contract = shopify.cancelContract(parsed.data.subscriptionId, parsed.data.reason);
          return { contract, userErrors: [] };
        } catch (err) {
          return { contract: null, userErrors: toUserErrors(err) };
        }
      },
    },
  };
}

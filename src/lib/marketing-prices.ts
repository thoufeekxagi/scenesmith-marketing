// Public pricing snapshot extracted from the application release at 8d414c2.
// Update this file only after verifying the live checkout prices.
export const plans = {
  starter: {prices: {monthly: {amountCents: 999}}},
  pro: {prices: {monthly: {amountCents: 1499}}}
} as const;

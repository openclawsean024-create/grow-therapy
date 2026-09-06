import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  // Pinned to the version the installed SDK (22.0.1) actually supports.
  // Bump alongside @types/stripe upgrades.
  apiVersion: '2026-03-25.dahlia',
});

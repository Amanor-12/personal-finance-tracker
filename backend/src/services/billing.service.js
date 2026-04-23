const AppError = require('../utils/AppError');

const plans = [
  {
    id: 'free',
    name: 'Free',
    interval: 'none',
    price: 0,
    priceLabel: '$0',
    description: 'Manual tracking for a personal workspace.',
    features: ['Manual accounts', 'Transactions', 'Budgets and goals'],
  },
  {
    id: 'premium_monthly',
    name: 'Premium',
    interval: 'monthly',
    price: 8,
    priceLabel: '$8 / month',
    description: 'Advanced money workflows for active users.',
    features: ['Recurring payments', 'Reports', 'Priority support'],
  },
  {
    id: 'premium_annual',
    name: 'Premium Annual',
    interval: 'annual',
    price: 72,
    priceLabel: '$72 / year',
    description: 'Premium access billed annually.',
    features: ['Everything in Premium', 'Annual savings', 'Billing portal access'],
  },
];

const getStripeConfig = () => {
  const hasSecret = Boolean(process.env.STRIPE_SECRET_KEY);
  const hasMonthlyPrice = Boolean(process.env.LEDGR_STRIPE_PRICE_PREMIUM_MONTHLY);
  const hasAnnualPrice = Boolean(process.env.LEDGR_STRIPE_PRICE_PREMIUM_ANNUAL);

  return {
    configured: hasSecret && hasMonthlyPrice && hasAnnualPrice,
    mode: process.env.STRIPE_MODE || 'test',
    missing: [
      !hasSecret ? 'STRIPE_SECRET_KEY' : null,
      !hasMonthlyPrice ? 'LEDGR_STRIPE_PRICE_PREMIUM_MONTHLY' : null,
      !hasAnnualPrice ? 'LEDGR_STRIPE_PRICE_PREMIUM_ANNUAL' : null,
    ].filter(Boolean),
  };
};

const getSubscriptionOverview = async () => {
  const stripe = getStripeConfig();

  return {
    provider: {
      name: 'stripe',
      configured: stripe.configured,
      mode: stripe.mode,
      missing: stripe.missing,
    },
    currentPlan: {
      id: 'free',
      name: 'Free',
      interval: 'none',
      status: 'active',
      price: 0,
      priceLabel: '$0',
    },
    subscription: {
      id: null,
      status: stripe.configured ? 'none' : 'not_configured',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      trialEndsAt: null,
    },
    invoices: [],
    plans,
  };
};

const createCheckoutSession = async (payload) => {
  const stripe = getStripeConfig();
  const plan = plans.find((item) => item.id === payload.plan_id);

  if (!plan || plan.id === 'free') {
    throw new AppError('Choose a paid plan before starting checkout.', 400);
  }

  if (!stripe.configured) {
    throw new AppError('Stripe Checkout is not configured yet.', 501, {
      missing: stripe.missing,
    });
  }

  throw new AppError('Stripe SDK checkout creation is ready to wire in the backend service.', 501);
};

const createPortalSession = async () => {
  const stripe = getStripeConfig();

  if (!stripe.configured) {
    throw new AppError('Stripe Billing Portal is not configured yet.', 501, {
      missing: stripe.missing,
    });
  }

  throw new AppError('Stripe Billing Portal session creation is ready to wire in the backend service.', 501);
};

module.exports = {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionOverview,
};

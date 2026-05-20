export type StripeMode = 'test' | 'live';

const truthy = (value: string | undefined) => ['1', 'true', 'yes', 'on'].includes((value || '').trim().toLowerCase());

export function getStripeMode(env: NodeJS.ProcessEnv): StripeMode {
  return truthy(env.STRIPE_TEST_MODE) ? 'test' : 'live';
}

export function getStripeSecretKey(env: NodeJS.ProcessEnv) {
  const mode = getStripeMode(env);
  const key =
    mode === 'test'
      ? env.STRIPE_TEST_SECRET_KEY || env.STRIPE_SECRET_KEY
      : env.STRIPE_LIVE_SECRET_KEY || env.STRIPE_SECRET_KEY;

  if (!key?.trim()) {
    throw new Error(`Missing Stripe ${mode} secret key.`);
  }

  return key.trim();
}

export function getStripeWebhookSecret(env: NodeJS.ProcessEnv) {
  const mode = getStripeMode(env);
  const secret =
    mode === 'test'
      ? env.STRIPE_TEST_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET
      : env.STRIPE_LIVE_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET;

  if (!secret?.trim()) {
    throw new Error(`Missing Stripe ${mode} webhook secret.`);
  }

  return secret.trim();
}


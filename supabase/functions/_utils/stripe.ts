import Stripe from "npm:stripe@^11.16";
// @ts-ignore
export const stripe = Stripe(Deno.env.get("STRIPE_API_KEY"), {
  httpClient: Stripe.createFetchHttpClient(),
});

export const stripe_pk = Deno.env.get("STRIPE_PUBLISHABLE_KEY")

export const stripe_webhook = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")
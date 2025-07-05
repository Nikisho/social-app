import Stripe from "npm:stripe@^11.16";
// @ts-ignore
export const stripe = Stripe(Deno.env.get("STRIPE_API_KEY"), {
  httpClient: Stripe.createFetchHttpClient(),
});
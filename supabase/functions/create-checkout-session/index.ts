// deno-lint-ignore-file
// import { serveListener } from "https://deno.land/std@0.116.0/http/server.ts";
import Stripe from "npm:stripe@^11.16";
import { createOrRetrieveCustomer } from '../_utils/createOrRetrieveCustomer.ts'
import { serve } from "https://deno.land/std@0.132.0/http/server.ts";

// @ts-ignore
const stripe = Stripe(Deno.env.get("STRIPE_API_KEY"), {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  httpClient: Stripe.createFetchHttpClient(),
});

const server = Deno.listen({ port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

// This handler will be called for every incoming request.
serve(async( req: Request) => {
  try {
    // Get the authorization header from the request.
    // When you invoke the function via the client library it will automatically pass the authenticated user's JWT.
    const authHeader = req.headers.get("Authorization")!;
    const { amount } = await req.json();
    // Retrieve the logged in user's Stripe customer ID or create a new customer object for them.
    // See ../_utils/supabase.ts for the implementation.
    const customer = await createOrRetrieveCustomer(authHeader);
    console.log('🏋🏽‍♀️ Customer Received: ', customer)
    // Create an ephermeralKey so that the Stripe SDK can fetch the customer's stored payment methods.
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: "2020-08-27" }
    );

    console.log('✅ ephemeralKey created: ', ephemeralKey)
    // Create a PaymentIntent so that the SDK can charge the logged in customer.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "gbp",
      customer: customer,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('✅ Payment intent created: ', paymentIntent)
    // Return the customer details as well as teh Stripe publishable key which we have set in our secrets.
    const res = {
      stripe_pk: Deno.env.get("STRIPE_PUBLISHABLE_KEY"),
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer,
    };

    console.log('🆗 Return fulfilled: ', res)
    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
})
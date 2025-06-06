import Stripe from "npm:stripe@^11.16";
import { createOrRetrieveCustomer } from "../_utils/createOrRetrieveCustomer.ts";
import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";

// @ts-ignore
const stripe = Stripe(Deno.env.get("STRIPE_API_KEY"), {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  httpClient: Stripe.createFetchHttpClient(),
});

const server = Deno.listen({ port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

// This handler will be called for every incoming request.
serve(async (req: Request) => {
  try {
    // Get the authorization header from the request.
    // When you invoke the function via the client library it will automatically pass the authenticated user's JWT.
    const authHeader = req.headers.get("Authorization")!;
    const {
      amount,
      user_id,
      featured_event_id,
      organizer_id,
      date
    } = await req.json();
    // Retrieve the logged in user's Stripe customer ID or create a new customer object for them.
    // See ../_utils/supabase.ts for the implementation.
    const customer = await createOrRetrieveCustomer(authHeader);
    console.log("🏋🏽‍♀️ Customer Received: ", customer);
    // Create an ephermeralKey so that the Stripe SDK can fetch the customer's stored payment methods.
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: "2020-08-27" }
    );

    console.log("✅ ephemeralKey created: ", ephemeralKey);

    const fetchStripeAccountId = async () => {
      const { data, error } = await supabaseAdmin
        .from("organizers")
        .select("stripe_account_id")
        .eq("organizer_id", organizer_id)
        .single();
      if (data) {
        return data.stripe_account_id;
      }
      if (error) {
        throw error.message;
      }
    };
    const stripe_account_id = await fetchStripeAccountId();

    console.log('🎉stripe account ID :', stripe_account_id);

    const platformFee = Math.round(amount * 0.03);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "gbp",
      customer: customer,
      automatic_payment_methods: {
        enabled: true,
      },
      transfer_data: {
        destination: stripe_account_id,
      },
      application_fee_amount: platformFee,
      metadata: {
        user_id: String(user_id),
        featured_event_id: String(featured_event_id),
        organizer_id: String(organizer_id),
        date: String(date),
      },
    });

    console.log("✅ Payment intent created: ", paymentIntent);
    // Return the customer details as well as teh Stripe publishable key which we have set in our secrets.
    const res = {
      stripe_pk: Deno.env.get("STRIPE_PUBLISHABLE_KEY"),
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer,
    };

    console.log("🆗 Return fulfilled: ", res);
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
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-checkout-session' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

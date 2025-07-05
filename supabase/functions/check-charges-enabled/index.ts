// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import { stripe } from "../_utils/stripe.ts";
// @ts-ignore
Deno.serve(async (req) => {
  try {
    const { stripe_account_id } = await req.json();
    console.log('this is it ', stripe_account_id)
    if (!stripe_account_id) {
      return new Response(JSON.stringify({ success: false, error: "Missing Stripe account ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const account = await stripe.accounts.retrieve(stripe_account_id);

    return new Response(
      JSON.stringify({ success: account.charges_enabled }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Stripe verification error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/check-charges-enabled' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

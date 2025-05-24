// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@^11.16";
import { saveOrganizerAccount } from "../_utils/saveOrganizerAccount.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";

// @ts-ignore
const stripe = Stripe(Deno.env.get("STRIPE_API_KEY"), {
  httpClient: Stripe.createFetchHttpClient(),
});

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization")!;
    console.log("setting up account");
    const jwt = authHeader.replace("Bearer ", "");
    console.log("jwt created ✅: ", jwt);
    const { data: { user } } = await supabaseAdmin.auth.getUser(jwt);
    if (!user) throw new Error("No user found for JWT!");

    const account = await stripe.accounts.create({
      type: "express",
      country: "GB",
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    await saveOrganizerAccount(user.id, account.id);

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://com.linkzy",
      return_url: "https://www.linkzyapp.com",
      type: "account_onboarding",
    });

    const { error } = await supabaseAdmin
      .from("users")
      .update({
        is_organizer: true,
      })
      .eq("uid", user.id);

    if (error) {
      console.error(error.message);
    }

    console.log("account set up ✅ ", account);
    return new Response(
      JSON.stringify({ url: accountLink.url, accountId: account.id }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error(error);
    return new Response("Failed to create Stripe account", { status: 500 });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/onboard-organizer-stripe' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

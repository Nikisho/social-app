// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";
import { stripe } from "../_utils/stripe.ts";

// @ts-ignore

Deno.serve(async (req) => {
  const { accountId } = await req.json();

  console.log('account Retrieved :', accountId)
  const account = await stripe.accounts.retrieve(accountId);

  const authHeader = req.headers.get("Authorization")!;
  console.log("setting up account");

  const jwt = authHeader.replace("Bearer ", "");
  console.log("jwt created ✅: ", jwt);

  const { data: { user } } = await supabaseAdmin.auth.getUser(jwt);
  if (!user) throw new Error("No user found for JWT!");


  if (!account.details_submitted) {
    // await stripe.accounts.del(accountId);
    // const {error} = await supabaseAdmin
    //   .from("organizers")
    //   .delete()
    //   .eq("stripe_account_id", accountId);
    // if (error) {
    //   throw error.message;
    // }

    // console.log('The user interupted the onboarding, therefore this account was deleted')
    console.log('User has not finished onboarding yet');
    return Response.json({ success: false }, { status: 400}); 
  }

  const { error:userError } = await supabaseAdmin
    .from('users')
    .update({ is_organizer: true})
    .eq('uid', user.id);
  if (userError) {
    throw userError.message;
  }

  const { error:organizerError } = await supabaseAdmin
    .from("organizers")
    .update({ status: "complete" })
    .eq("stripe_account_id", accountId);
  if (organizerError) {
    throw organizerError.message;
  }

  console.log('Onboarding successful!')
  return Response.json({ success: true });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/verify-onboarding' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

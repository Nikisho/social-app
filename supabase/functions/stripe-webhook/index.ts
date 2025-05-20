// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serveListener } from "https://deno.land/std@0.116.0/http/server.ts";
import Stripe from "npm:stripe@^11.16";
import { supabaseAdmin } from '../_utils/supabase.ts'
import { generateTicket } from '../_utils/generateTicket.ts'
// @ts-ignore
const stripe = Stripe(Deno.env.get("STRIPE_API_KEY"));
const server = Deno.listen({ port: 8080 });

async function handler(request: Request) {
  const signature = request.headers.get("Stripe-Signature");
  console.log('Signature Received: ', signature)
  if (!signature) {
    console.error("❌ Missing Stripe signature header");
    return new Response("Missing Stripe signature", { status: 400 });
}
  // First step is to verify the event. The .text() method must be used as the
  // verification relies on the raw request body rather than the parsed JSON.
  const body = await request.text();
  let receivedEvent;
  try {
    receivedEvent = await stripe?.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET"),
      undefined,
    );

    if (receivedEvent.type === "payment_intent.succeeded") {
      const session = receivedEvent.data.object;
      
      const ticket_id = await generateTicket(
        session.metadata.user_id,
        session.metadata.featured_event_id,
        session.metadata.date,
      )

      console.log(' ✅ Session received: ', session)
      const { error } = await supabaseAdmin
        .from("ticket_transactions")
        .insert({
          stripe_payment_id: session.id,
          status: session.status, 
          stripe_customer_id: session.customer,
          amount: session.amount,
          currency: session.currency,
          ticket_id: ticket_id,
          user_id: session.metadata.user_id,
          organizer_id: session.metadata.organizer_id
        });

      if (error) throw error;

      return new Response(JSON.stringify({ status: "success" }), {
        status: 200,
      });
    }
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook Error:", err.message);
    return new Response(err.message, { status: 400 });
  }
}

await serveListener(server, handler);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/stripe-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

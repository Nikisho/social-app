// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serveListener } from "https://deno.land/std@0.116.0/http/server.ts";
import Stripe from "npm:stripe@^11.16";
import { supabaseAdmin } from '../_utils/supabase.ts'
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
      console.log(' ✅ Session received: ', session)
      const { error } = await supabaseAdmin
        .from("transactions")
        .insert({
          stripe_payment_id: session.id,
          status: session.status, 
          stripe_customer_id: session.customer,
          amount: session.amount,
          currency: session.currency
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
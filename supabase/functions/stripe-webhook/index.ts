// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serveListener } from "https://deno.land/std@0.116.0/http/server.ts";
import Stripe from "npm:stripe@^11.16";

// @ts-ignore
const stripe = Stripe(Deno.env.get("STRIPE_API_KEY"));
const server = Deno.listen({ port: 8080 });

const SUPABASE_URL = Deno.env.get("SECRET_SUPABASE_URL")!;
const SUPABASE_KEY = Deno.env.get("SECRET_SUPABASE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

    if (receivedEvent.type === "checkout.session.completed") {
      const session = receivedEvent.data.object;
      const { email, id } = session.customer_details;

      const { error } = await supabase
        .from("transactions")
        // .insert([{ email:'test', stripe_session_id: '3' }]);
        .insert({
          email: email,
          stripe_payment_id: id,
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
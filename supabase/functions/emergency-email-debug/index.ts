// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";
import { emailUserUponPurchase } from "../_utils/emailUserUponPurchase.ts";
import { qrcode } from "https://deno.land/x/qrcode/mod.ts";

async function generateQRCodeBase64(value: string) {
  return (await qrcode(value)).toString();
};
console.log("Hello from Functions!");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    try {
        const { featured_event_id, user_id } = await req.json();

        const { data: tickets } = await supabaseAdmin
            .from("tickets")
            .select("ticket_id, qr_code_link")
            .eq("user_id", user_id)
            .eq("featured_event_id", featured_event_id);

        const ticketsWithQrBase64 = await Promise.all(
            (tickets || []).map(async (ticket: any) => {
                const qrDataUrl = await generateQRCodeBase64(ticket.qr_code_link);

                return {
                    ticket_id: ticket.ticket_id,
                    qr_code_link: qrDataUrl.split(",")[1],
                };
            }),
        );

        await emailUserUponPurchase(
            user_id,
            featured_event_id,
            ticketsWithQrBase64,
        );

        return new Response(
            JSON.stringify({ success: true }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            },
        );
    } catch (err) {
        console.error(err);

        return new Response(
            JSON.stringify({ success: false }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            },
        );
    }
});
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/emergency-email-debug' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

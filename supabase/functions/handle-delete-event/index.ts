// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import { initiateRefundForDeleteEvent } from "../_utils/initiateRefundForDeleteEvent.ts";
import { emailAttendeesForDeleteEvent } from "../_utils/emailAttendeesForDeleteEvent.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";

Deno.serve(async (req) => {
  const { featured_event_id } = await req.json()
  try {
    //Initiate refund for each customer
    const _refund = await initiateRefundForDeleteEvent(featured_event_id);

    //Send out an email to each customer notifying them of the cancellation and refund
    const _email = await emailAttendeesForDeleteEvent(featured_event_id);
    
    //Cancel the event in the database
    const _cancel = await supabaseAdmin
        .from("featured_events")
        .update({ cancelled: true })
        .eq("featured_event_id", featured_event_id);

    return new Response(
      JSON.stringify({ success: true, message: "Event cancelled, refunds initiated, attendees emailed." }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (err) {
    
    return new Response(
      JSON.stringify(err),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/handle-delete-event' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

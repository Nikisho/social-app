// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { Resend } from "npm:resend";
import { supabaseAdmin } from "../_utils/supabase.ts";
import { buildWaitlistOrganizerEmail } from "./buildWaitListOrganizerEmail.ts";
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const fromEmail = Deno.env.get("ZOHO_FROM_EMAIL");
const resend = new Resend(resendApiKey ?? "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const {
    name,
    email,
    featured_event_id,
  } = await req.json();
  console.log(
    `Received waitlist signup for event ${featured_event_id} from ${name} (${email})`,
  );
  try {
    const { data: event, error: eventError } = await supabaseAdmin
      .from("featured_events")
      .select("*")
      .eq("featured_event_id", featured_event_id)
      .single();
    if (eventError) {
      throw eventError;
    }

    const { data: organizer, error: organizerError } = await supabaseAdmin
      .from("organizers")
      .select(`*, users(email, name)`)
      .eq("organizer_id", event.organizer_id)
      .single();
    if (organizerError) {
      throw organizerError;
    }

    const organizerEmail = organizer.users.email;
    const organizerName = organizer.users.name;
    const eventTitle = event.title;

    const emailSubject = `New Waitlist Signup for ${eventTitle}`;
    const emailBody = buildWaitlistOrganizerEmail({
      organizerName,
      eventTitle,
      name,
      email,
    });

    const emailResponse = await resend.emails.send({
      from: fromEmail ?? "",
      to: organizerEmail,
      subject: emailSubject,
      html: emailBody,
    });

    console.log("Email sent response:", emailResponse);
    return new Response(
      JSON.stringify(emailResponse),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify(error),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/notify-organizer-waitlist-signup' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

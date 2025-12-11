// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

Deno.serve(async (req) => {
  const { email, featured_event_id, user } = await req.json();

  const { data: attendees, error: attendeeError } = await supabaseAdmin
    .from(`featured_event_bookings`)
    .select(`*, users(email)`)
    .eq("featured_event_id", featured_event_id);

  const zohoEmail = Deno.env.get("ZOHO_LOGIN_EMAIL")!;
  const password = Deno.env.get("ZOHO_PASSWORD")!;
  const fromEmail = Deno.env.get("ZOHO_FROM_EMAIL")!;

  const handleEmail = async (recipient: { users: {email: string}}) => {
    if (recipient.users.email.includes("linkzy")) {
      console.log('Test email with Linkzy, skipping')
      return 
    }
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.zoho.eu",
        port: 465,
        tls: true,
        auth: { username: zohoEmail, password },
      },
    });

    const subject = `Message from ${user.name}: ${email.subject}`;

    const body = `
${email.body}

Questions about the event?
Message the organiser:
Email: ${user.email}
`.split('\n')
.map(line => line.replace(/\s+$/g, ''))
.join('\n');;
   
    await client.send({
      from: `${user.name} <support@linkzyapp.com>`,
      to: recipient.users.email,
      subject,
      content: body
    });

    await client.close();
  };
  if (attendees) {
    for (const attendee of attendees) {
      console.log("The attendee email is :", attendee.users.email);
      handleEmail(attendee);
    }
  }
  if (attendeeError) console.error(attendeeError.message);

  return new Response(
    JSON.stringify(email),
    { headers: { "Content-Type": "application/json" } },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/email-attendees' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

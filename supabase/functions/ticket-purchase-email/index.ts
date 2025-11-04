// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

Deno.serve(async (req) => {
  const zohoEmail = Deno.env.get("ZOHO_LOGIN_EMAIL")!;
  const password = Deno.env.get("ZOHO_PASSWORD")!;
  const fromEmail = Deno.env.get("ZOHO_FROM_EMAIL")!;

  const {
    email,
    name,
    title,
    location,
    date,
  } = await req.json();

  try {

    if (email.indexOf('linkzy') > -1) {
      console.log('The email function was stopped as this is a test email with "linkzy" ')
     return new Response(
      JSON.stringify({ message: `Email function execustion  stopped as email is ${email}` }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    )
    }

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.zoho.eu",
        port: 465,
        tls: true,
        auth: {
          username: zohoEmail,
          password: password,
        },
      },
    });

    const confirmationSubject =
      `✅ Ticket confirmed for ${title} – See You There!`;
    const confirmationMessage = `
        Hi ${name},

        Thanks for booking your ticket with Linkzy. Your purchase has been successfully confirmed! 🎉

        You're now on the guest list for the upcoming event.
        Keep an eye on your inbox for any updates or details from the organizer.

        Here’s a quick summary:
        - 📅 Event: ${title}
        - 📍 Location: ${location}
        - 🗓️ Date & Time: ${date}
        - 🎟️ Ticket: Confirmed

        If you have any questions or need to make changes, just reply to this email, we're happy to help.

        Thanks again for being part of Linkzy. See you soon!

        Best,
        The LINKZY Team
        `;
    await client.send({
      from: fromEmail,
      to: email,
      subject: confirmationSubject,
      content: confirmationMessage,
    });

    await client.close();

    return new Response(
      JSON.stringify({ message: `Email sent to ${email}` }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    console.error("Email error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/ticket-purchase-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

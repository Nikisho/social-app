import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const zohoEmail = Deno.env.get("ZOHO_LOGIN_EMAIL")!;
  const password = Deno.env.get("ZOHO_PASSWORD")!;
  const fromEmail = Deno.env.get("ZOHO_FROM_EMAIL")!;

  const { email, name, title, location, date, qrValue } = await req.json();

  try {
    if (email.includes("linkzy")) {
      return new Response(
        JSON.stringify({ message: `Email skipped for ${email}` }),
        { headers: { "Content-Type": "application/json" }, status: 200 },
      );
    }

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.zoho.eu",
        port: 465,
        tls: true,
        auth: { username: zohoEmail, password },
      },
    });

    const subject = `Your Ticket for ${title} is Confirmed!`;

const body = `
Hello ${name}, 🎉

Your ticket is all set! You're officially booked in for the event.

Event Details
• 🗓️ Event: ${title}
• 📍 Location: ${location}
• ⏰ Date & Time: ${date}

Your QR code ticket is attached to this email — just show it at the entrance for quick check-in.

If you have any questions, feel free to reply directly to this email.

See you there!
— The Linkzy Team ✨
`.trim();
   
    await client.send({
      from: fromEmail,
      to: email,
      subject,
      content: body,
      attachments: [
        {
          filename: "ticket-qr.png",
          content: qrValue,
          contentType: "image/png",
          encoding: "base64", // this is required
        },
      ],
    });

    await client.close();

    return new Response(
      JSON.stringify({ message: `Email sent to ${email}` }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err) {
    console.error("Email error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

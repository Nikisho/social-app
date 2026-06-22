// import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// // deno-lint-ignore-file
import { supabaseAdmin } from "../_utils/supabase.ts";
// import { serveListener } from "https://deno.land/std@0.116.0/http/server.ts";
// import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";
import { Resend } from "npm:resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // const zohoEmail = Deno.env.get("ZOHO_LOGIN_EMAIL")!;
    // const password = Deno.env.get("ZOHO_PASSWORD")!;
    const fromEmail = Deno.env.get("ZOHO_FROM_EMAIL")!;
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

    const {
      email,
      name,
      title,
      location,
      date,
      tickets,
      country_code,
    } = await req.json();

    const isFrench = country_code === "FR";

    const subject = isFrench
      ? `Billet confirmé : ${title}`
      : `Ticket confirmed: ${title}`;

    // --- Build tickets HTML ---

    const ticketUrls = await Promise.all(
      tickets.map(async (t: any, index: number) => {
        const base64 = t.qr_code_link.replace(
          /^data:image\/[a-z]+;base64,/,
          "",
        );
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

        const path = `qr-codes/${t.ticket_id}.png`;

        await supabaseAdmin.storage
          .from("tickets") // ← your bucket name
          .upload(path, bytes, {
            contentType: "image/png",
            upsert: true,
          });

        const { data } = supabaseAdmin.storage.from("tickets").getPublicUrl(path);
        return data.publicUrl;
      }),
    );


    const ticketsHtml = tickets
      .map(
        (t: {ticket_id: number}, index: number) =>`<div style="padding:15px; border:1px solid #eee; border-radius:10px;">
  <p style="margin:0 0 10px 0; font-weight:bold;">
    ${isFrench ? `Billet ${index + 1}` : `Ticket ${index + 1}`}
  </p>
  <img src="${ticketUrls[index]}" width="200" height="200" />
  <p style="font-size:12px; color:#666;">
    ID: ${t.ticket_id}
  </p></div>`,).join("");
    // --- Full HTML ---
    const html = isFrench
      ? `
      <div style="font-family:sans-serif; max-width:600px; margin:auto;">
        <h2>🎉 Votre billet est confirmé</h2>

        <p>Bonjour ${name},</p>
        <p>Vous êtes inscrit à l'événement.</p>

        <div style="background:#f9f9f9; padding:15px; border-radius:10px;">
          <p><strong>🗓️ Événement :</strong> ${title}</p>
          <p><strong>📍 Lieu :</strong> ${location}</p>
          <p><strong>⏰ Date :</strong> ${date}</p>
        </div>

        <p style="margin-top:15px;">
          Vous avez acheté <strong>${tickets.length}</strong> billet(s).
        </p>

        <h3 style="margin-top:20px;">Vos billets</h3>
        ${ticketsHtml}

        <p>Présentez simplement votre QR code à l'entrée.</p>

        <p style="margin-top:30px;">— L'équipe Linkzy</p>
      </div>
      `
      : `
     <html>
      <body style="font-family:sans-serif;">
      <div style="font-family:sans-serif; max-width:600px; margin:auto;">
        <h2>🎉 Your ticket is confirmed</h2>

        <p>Hello ${name.trim()},</p>
        <p>You’re all set for the event.</p>

        <div style="background:#f9f9f9; padding:15px; border-radius:10px;">
          <p><strong>🗓️ Event:</strong> ${title}</p>
          <p><strong>📍 Location:</strong> ${location}</p>
          <p><strong>⏰ Date:</strong> ${date}</p>
        </div>

        <p style="margin-top:15px;">
          You purchased <strong>${tickets.length}</strong> ticket(s).
        </p>

<h3 style="margin-top:20px;">Your tickets</h3>
${ticketsHtml}
<p>Show your QR code at the entrance.</p>
<p style="margin-top:30px;">— The Linkzy Team</p>
      </div>
      </body>
    </html>
      `.trim();

    // --- Attachments (QR codes) ---
    const attachments = tickets.map((t: {qr_code_link: string}, index: number) => ({
      filename: `ticket-${index + 1}.png`,
      content: t.qr_code_link.replace(/^data:image\/png;base64,/, ""),
      mimeType: "image/png",
      encoding: "base64",
      headers: {
        "Content-ID": `<qr_${index}>`,
        "Content-Disposition": "inline",
      },
    }));

    // const client = new SMTPClient({
    //   connection: {
    //     hostname: "smtp.zoho.eu",
    //     port: 465,
    //     tls: true,
    //     auth: {
    //       username: zohoEmail,
    //       password,
    //     },
    //   },
    // });

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject,
      html, // IMPORTANT: use html, not content
      attachments,
    });

    // await client.close();

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

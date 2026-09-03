// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

Deno.serve(async (req) => {
  const { email, featured_event_id, user, attachments } = await req.json();

  console.log("Attachments here: ", attachments);
  const { data: attendees, error: attendeeError } = await supabaseAdmin
    .from(`featured_event_bookings`)
    .select(`*, users(email)`)
    .eq("featured_event_id", featured_event_id);

  const zohoEmail = Deno.env.get("ZOHO_LOGIN_EMAIL")!;
  const password = Deno.env.get("ZOHO_PASSWORD")!;

    function encodeEmailHtml(text:string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/ {2,}/g, match => "&nbsp;".repeat(match.length))
    .replace(/\n/g, "<br>");
}
const cleanedBody = encodeEmailHtml(email.body);
  const body = `
<div style="
  font-family: Arial, sans-serif;
  line-height: 1.5;
  color: #111;
  max-width: 600px;
  margin: 0 auto;
">
  <div style="
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 12px;
  ">
<div style="white-space: pre-wrap; font-size: 15px;">
${cleanedBody}
    </div>
    ${attachments?.length ? `<hr style="margin:24px 0; border: none; border-top: 1px solid #eee;" />
        <div>
            ${attachments
          .map(
            (url: string) => `<div style="display:inline-block; margin:6px;">
  <img
    src="${url}"
    style="
      width:120px;
      height:120px;
      object-fit:cover;
      border-radius:10px;
      display:block;
    "
  />
</div>`,
          )
          .join("")
      }
      </div>`:`<div></div>`
  }
    <hr style="margin:24px 0; border: none; border-top: 1px solid #eee;" />
    <div style="font-size:13px; color:#555;">
      <strong>Questions about the event?</strong><br/>
      Message the organiser:<br/>
      <a href="mailto:${user.email}" style="color:#000;">
        ${user.email}
      </a>
    </div>

  </div>

</div>
`;

  const showOrganiserEmail = async () => {
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.zoho.eu",
        port: 465,
        tls: true,
        auth: { username: zohoEmail, password },
      },
    });

    const subject =
      `Email sent to attendees — Message from ${user.name}: ${email.subject}`;

    await client.send({
      from: `LINKZY <support@linkzyapp.com>`,
      to: user.email,
      subject: subject.replace(/[\u0080-\uFFFF]/g, ""), // removes non-ascii (optional),
      html: body,
    });

    await client.close();
  };

  // const handleEmail = async (recipient: { users: { email: string } }) => {
  //   if (recipient.users.email.includes("linkzy")) {
  //     console.log("Test email with Linkzy, skipping");
  //     return;
  //   }
  //   const client = new SMTPClient({
  //     connection: {
  //       hostname: "smtp.zoho.eu",
  //       port: 465,
  //       tls: true,
  //       auth: { username: zohoEmail, password },
  //     },
  //   });

  //   const subject = `Message from ${user.name}: ${email.subject}`;

  //   await client.send({
  //     from: `${user.name} <support@linkzyapp.com>`,
  //     to: recipient.users.email,
  //     subject: subject.replace(/[\u0080-\uFFFF]/g, ""),
  //     html: body,
  //   });

  //   await client.close();
  // };

  // if (attendees) {
  //   showOrganiserEmail();
  //   for (const attendee of attendees) {
  //     console.log("The attendee email is :", attendee.users.email);
  //     handleEmail(attendee);
  //   }
  // }

  const handleCreateEmailJobs = async (attendees: any[]) => {
    const uniqueEmails = new Set<string>();
    const uniqueAttendees = attendees.filter((attendee) => {
      if (uniqueEmails.has(attendee.users.email)) {
        return false;
      } else {
        uniqueEmails.add(attendee.users.email);
        return true;
      }
    });
    
    const jobs = uniqueAttendees
      .filter((r) => !r.users.email.includes("linkzy"))
      .map((r) => ({
        featured_event_id,
        recipient_email: r.users.email,
        subject: `Message from ${user.name}: ${email.subject}`
          .replace(/[\u0080-\uFFFF]/g, ""),
        body,
      }));

    const { error } = await supabaseAdmin
      .from("email_jobs")
      .insert(jobs);

    if (error) {
      throw error;
    }
  };

  handleCreateEmailJobs(attendees || []).catch((error) => {
    console.error("Error creating email jobs: ", error);
  });

  showOrganiserEmail();

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

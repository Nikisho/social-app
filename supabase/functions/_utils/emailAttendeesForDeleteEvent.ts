import { supabaseAdmin } from "./supabase.ts";
// import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";
import { Resend } from "npm:resend";

export async function emailAttendeesForDeleteEvent(featured_event_id: number) {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

    const { data: emails, error } = await supabaseAdmin
        .from("featured_event_bookings")
        .select(`*, users(*)`)
        .eq("featured_event_id", featured_event_id);

    let uniqueAttendeeEmails: string[] = [];
    if (emails) {
        const attendeeEmails = emails.map((
            booking: { users: { email: string } },
        ) => booking.users.email) as string[];
        uniqueAttendeeEmails = [...new Set(attendeeEmails)];
    }
    if (error) {
        console.error("Error fetching attendee emails: ", error.message);
        return;
    }

    const fromEmail = Deno.env.get("ZOHO_FROM_EMAIL")!;
    const { data: event, error: eventError } = await supabaseAdmin
        .from("featured_events")
        .select("title, date")
        .eq("featured_event_id", featured_event_id)
        .single();

    if (eventError) {
        console.error("Error fetching event details: ", eventError.message);
    }

    const emailHtmlContent = `
<h2 style="margin: 0 0 16px; color: #111;">
  Event Cancellation Notice
</h2>

<p style="font-size: 14px; color: #333; line-height: 1.6;">
  We regret to inform you that the following event has been cancelled:
</p>

<div style="margin: 16px 0; padding: 12px; background: #f5f5f5; border-radius: 6px;">
  <p style="margin: 0; font-weight: bold; color: #111;">
    ${event.title}
  </p>
  <p style="margin: 4px 0 0; color: #555;">
    ${new Date(event.date).toLocaleDateString()}
  </p>
</div>

<p style="font-size: 14px; color: #333; line-height: 1.6;">
  A full refund will be processed automatically to your original payment method.
  No action is required from your side.
</p>

<p style="font-size: 14px; color: #333; line-height: 1.6;">
  We apologise for any inconvenience caused. If you have any questions, please contact our support team.
</p>

<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

<p style="font-size: 12px; color: #888;">
  Thank you,<br/>
  The Team
</p>`.trim();

    const getOrganiserEmail = async () => {
        const { data, error } = await supabaseAdmin
            .from("featured_events")
            .select(`organizer_id, organizers(users(email))`)
            .eq("featured_event_id", featured_event_id)
            .single();

        if (error || !data) {
            console.error("Error fetching organiser email: ", error?.message);
            return null;
        }

        console.log("Organiser data: ", data);
        return data.organizers.users.email;
    };

    try {
        for (const email of uniqueAttendeeEmails) {
            await resend.emails.send({
                from: fromEmail,
                to: email,
                subject: "Event Cancellation Notice",
                html: emailHtmlContent,
            });
        }
        const organiserEmail = await getOrganiserEmail();
        console.log("Organiser email: ", organiserEmail);

        await resend.emails.send({
            from: fromEmail,
            to: organiserEmail || fromEmail,
            subject: `Your email sent to attendees: Event Cancelled: ${event.title}`,
            html: emailHtmlContent,
        });
        console.log("Sent to organiser email: ", organiserEmail);

    } catch (err) {
        console.error("Error sending cancellation emails: ", err);  
        
    } finally {
        console.log("Email sent to attendees: ", uniqueAttendeeEmails);
    }
}

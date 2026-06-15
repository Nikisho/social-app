import { supabaseAdmin } from "./supabase.ts";
import { Resend } from "npm:resend";

export const emailOrganizerUponPurchase = async (
    user_id: number,
    organizer_id: number,
    featured_event_id: number,
) => {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
    const fromEmail = Deno.env.get("ZOHO_FROM_EMAIL")!;
    const { data: organizer, error: organizerError } = await supabaseAdmin
        .from("organizers")
        .select(`organizer_id, users(email)`)
        .eq("organizer_id", organizer_id)
        .single();

    if (organizerError || !organizer) {
        console.error(
            "Error fetching organiser email: ",
            organizerError?.message,
        );
        return null;
    }

    const { data: user, error: user_error } = await supabaseAdmin
        .from("users")
        .select("name, email, id")
        .eq("id", user_id)
        .single();

    if (user_error) {
        console.error("Error fetching user details: ", user_error);
    }

    const { data: event, error: event_error } = await supabaseAdmin
        .from("featured_events")
        .select(
            "title, location, date, time, featured_event_id, email_on_ticket_purchase",
        )
        .eq("featured_event_id", featured_event_id)
        .single();

    if (event_error) {
        console.error("Error fetching event details: ", event_error);
    }

    const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px;">

    <h2 style="margin-bottom: 20px;">
        🎟️ New ticket booked
    </h2>

    <p>
        <strong>${user?.name}</strong> (${user?.email})
        has purchased a ticket for your event.
    </p>

    <div style="
        background:#f7f7f7;
        border-radius:12px;
        padding:16px;
        margin-top:20px;
    ">
        <p style="margin:0 0 10px;">
            <strong>${event?.title}</strong>
        </p>

        <p style="margin:6px 0;">
            📍 ${event?.location}
        </p>

        <p style="margin:6px 0;">
            🗓️ ${event?.date}
        </p>

        <p style="margin:6px 0;">
            🕒 ${event?.time?.slice(0, -3)}
        </p>
    </div>

    <p style="margin-top:24px;color:#666;">
        You can view attendees and manage your event in Linkzy.
    </p>

</div>
`;
    if (!event.email_on_ticket_purchase) {
        console.log("Email on purchase disabled. Skipping email send");
        return;
    }

    const toEmail = organizer?.users?.email;

    if (!toEmail) {
        console.log("No organizer email found. Skipping");
        return;
    }

    try {
        await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: `New ticket booked for ${event?.title}!`,
            html,
        });
    } catch (error) {
        console.error("Failed to send organizer email:", error);
    }
};

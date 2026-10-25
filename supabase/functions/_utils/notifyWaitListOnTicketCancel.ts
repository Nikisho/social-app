import { supabaseAdmin } from "./supabase.ts";
import { Resend } from "npm:resend";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const fromEmail = Deno.env.get("ZOHO_FROM_EMAIL");

const resend = new Resend(resendApiKey ?? "");

export const notifyWaitListOnTicketCancel = async (
    ticket_type_id: number,
) => {
    const logPrefix = `[Waitlist][TicketType ${ticket_type_id}]`;

    try {
        console.log(`${logPrefix} Starting notification process`);

        if (!resendApiKey || !fromEmail) {
            throw new Error(
                "Missing RESEND_API_KEY or ZOHO_FROM_EMAIL",
            );
        }

        // Find the oldest person still waiting.
        const { data: waitlistEntries, error } = await supabaseAdmin
            .from("event_waitlist")
            .select(
                "event_waitlist_id, featured_event_id, email, name, created_at",
            )
            .eq("ticket_type_id", ticket_type_id)
            .eq("status", "waiting")
            .order("created_at", { ascending: true })
            .limit(1);

        if (error) throw error;

        const entry = waitlistEntries?.[0];

        if (!entry) {
            console.log(`${logPrefix} No waiting users found.`);
            return;
        }

        console.log(
            `${logPrefix} Selected entry ${entry.event_waitlist_id}`,
        );

        // Fetch event details.
        const { data: event, error: eventError } = await supabaseAdmin
            .from("featured_events")
            .select("title, date")
            .eq("featured_event_id", entry.featured_event_id)
            .single();

        if (eventError) {
            throw eventError;
        }

        const now = new Date();
        const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);

        // Claim the entry before sending the email.
        const { data: updatedEntry, error: updateError } =
            await supabaseAdmin
                .from("event_waitlist")
                .update({
                    status: "notified",
                    notified_at: now.toISOString(),
                    expires_at: expiresAt.toISOString(),
                })
                .eq("event_waitlist_id", entry.event_waitlist_id)
                .eq("status", "waiting")
                .select("event_waitlist_id")
                .maybeSingle();

        if (updateError) throw updateError;

        if (!updatedEntry) {
            console.log(
                `${logPrefix} Entry already processed; skipping email.`,
            );
            return;
        }

        const eventUrl =
            `https://www.linkzyapp.com/events/${entry.featured_event_id}`;

        // Escape user- and database-provided values before inserting into HTML.
        const escapeHtml = (value: string) =>
            value.replace(/[&<>"']/g, (char) => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[char]!);

        const eventTitle = escapeHtml(event.title);
        const recipientName = escapeHtml(entry.name);

        const eventDate = event.date
            ? new Date(event.date).toLocaleString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                timeZone: "Europe/London",
            })
            : null;

        const dateSection = eventDate
            ? `<p style="margin:8px 0;color:#4b5563;font-size:14px;">${escapeHtml(eventDate)}</p>`
            : "";

        const emailHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tickets available</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
        A ticket has become available for ${eventTitle}. Check the event before it sells out.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;">
                    <tr>
                        <td style="padding:24px 32px;border-bottom:1px solid #e4e4e7;">
                            <p style="margin:0;font-size:23px;font-weight:700;letter-spacing:-0.5px;color:#18181b;">
                                Linkzy
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#71717a;">
                                Waitlist update
                            </p>

                            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.25;color:#18181b;">
                                A ticket is available
                            </h1>

                            <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#52525b;">
                                Hi ${recipientName}, a ticket has become available for an event on your waitlist.
                            </p>

                            <div style="padding:20px;background-color:#f4f4f5;border-radius:12px;margin-bottom:24px;">
                                <h2 style="margin:0 0 8px;font-size:20px;line-height:1.4;color:#18181b;">
                                    ${eventTitle}
                                </h2>
                                ${dateSection}
                                <p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#52525b;">
                                    You are next on the waitlist. Visit the event page to check availability and attempt to purchase your ticket.
                                </p>
                            </div>

                            <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#18181b;">
                                <strong>Act within 15 minutes.</strong> After that, your notification window expires and the next person on the waitlist may be contacted.
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                                <tr>
                                    <td align="center" style="border-radius:8px;background-color:#18181b;">
                                        <a href="${eventUrl}" style="display:inline-block;padding:15px 24px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">
                                            View event and tickets
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0;font-size:13px;line-height:1.7;color:#71717a;">
                                <strong>Please note:</strong> your ticket is not reserved. Tickets remain available on a first-come, first-served basis, so availability may change before you complete your purchase.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:20px 32px;background-color:#fafafa;border-top:1px solid #e4e4e7;">
                            <p style="margin:0;font-size:12px;line-height:1.6;color:#a1a1aa;">
                                You're receiving this email because you joined the waitlist for this event on Linkzy.
                            </p>
                            <p style="margin:8px 0 0;font-size:12px;color:#a1a1aa;">
                                Linkzy · Discover events and experiences
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`.trim();

        const emailTextContent = `
Hi ${entry.name},

A ticket has become available for ${event.title}.
${eventDate ? `Event date: ${eventDate}` : ""}

You are next on the waitlist. Visit the event page within 15 minutes to check availability and attempt to purchase your ticket.

View event and tickets:
${eventUrl}

Please note: your ticket is not reserved. Tickets remain available on a first-come, first-served basis, so availability may change before you complete your purchase.

You're receiving this email because you joined this event's waitlist on Linkzy.
        `.trim();

        console.log(
            `${logPrefix} Sending email to ${entry.email}`,
        );

        const { data: emailResponse, error: emailError } =
            await resend.emails.send({
                from: fromEmail,
                to: [entry.email],
                subject: `A ticket is available: ${event.title}`,
                html: emailHtmlContent,
                text: emailTextContent,
            });

        if (emailError) {
            console.error(`${logPrefix} Resend error`, emailError);
            throw new Error(`Resend failed: ${emailError.message}`);
        }

        if (!emailResponse?.id) {
            throw new Error("Resend did not return an email ID");
        }

        console.log(
            `${logPrefix} Email accepted by Resend. ID: ${emailResponse.id}`,
        );
    } catch (error) {
        console.error(`${logPrefix} Notification process failed`, error);
    }
};
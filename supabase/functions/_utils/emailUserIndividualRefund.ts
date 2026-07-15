import { supabaseAdmin } from "./supabase.ts";
import { Resend } from "npm:resend";

export async function emailUserIndividualRefund(
    featured_event_id: number,
    user_id: number
) {
    const fromEmail = Deno.env.get("ZOHO_FROM_EMAIL")!;
    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

    const { data: user, error: userError } = await supabaseAdmin
        .from("users")
        .select("email, name")
        .eq("id", user_id)
        .single();

    if (userError || !user) {
        console.error(
            "emailUserIndividualRefund — Error fetching user:",
            userError?.message
        );
        return;
    }

    const { data: event, error: eventError } = await supabaseAdmin
        .from("featured_events")
        .select("title, date, location")
        .eq("featured_event_id", featured_event_id)
        .single();

    if (eventError || !event) {
        console.error(
            "emailUserIndividualRefund — Error fetching event:",
            eventError?.message
        );
        return;
    }

    const emailHtmlContent = `
    <div style="
        font-family: Arial, sans-serif;
        background:#f8f8f8;
        padding:30px;
    ">
        <div style="
            max-width:600px;
            margin:auto;
            background:white;
            border-radius:16px;
            padding:30px;
            border:1px solid #e5e5e5;
        ">

            <h2 style="
                margin:0 0 20px;
                font-size:24px;
                color:#111;
            ">
                Refund confirmed
            </h2>


            <p style="
                font-size:16px;
                color:#444;
                line-height:1.6;
            ">
                Hi ${user.name},
            </p>


            <p style="
                font-size:16px;
                color:#444;
                line-height:1.6;
            ">
                Your refund request for 
                <strong>${event.title}</strong>
                has been successfully processed.
            </p>


            <div style="
                background:#f4f4f5;
                border-radius:12px;
                padding:20px;
                margin:25px 0;
            ">

                <h3 style="
                    margin-top:0;
                    color:#111;
                    font-size:16px;
                ">
                    Event details
                </h3>

                <p style="
                    margin:8px 0;
                    color:#555;
                ">
                    🎟️ ${event.title}
                </p>

                <p style="
                    margin:8px 0;
                    color:#555;
                ">
                    📅 ${event.date ?? ""}
                </p>

                <p style="
                    margin:8px 0;
                    color:#555;
                ">
                    📍 ${event.location ?? ""}
                </p>

            </div>
            <p style="
                font-size:16px;
                color:#444;
                line-height:1.6;
            ">
                The payment will be returned to your original payment method.
                Depending on your bank, it may take a few business days to appear.
            </p>

            <p style="
                font-size:16px;
                color:#444;
                line-height:1.6;
            ">
                Your ticket has been cancelled and you will no longer have access
                to this booking.
            </p>

            <hr style="
                border:none;
                border-top:1px solid #eee;
                margin:30px 0;
            " />
            <p style="
                font-size:14px;
                color:#777;
                line-height:1.5;
            ">
                Thank you for using Linkzy. We hope to see you at another event soon.
            </p>

            <p style="
                font-size:14px;
                color:#777;
            ">
                The Linkzy Team
            </p>
        </div>
    </div>
    `.trim();;

    await resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: `Refund confirmed - ${event.title}`,
        html: emailHtmlContent,
    });
}
import { supabaseAdmin } from "./supabase.ts";
import formatDateShortWeekday from "./formatDateShortWeekday.ts";

export const emailUserUponPurchase = async (
    user_id: number,
    featured_event_id: number,
    tickets: {ticket_id:number, qr_code_link:string}[]
) => {

    const { data: user, error: user_error } = await supabaseAdmin
        .from("users")
        .select("name, email, id")
        .eq("id", user_id)
        .single();
    
    if (user_error) {   
        console.error("Error fetching user details: ", user_error);
    };

    const { data: event, error: event_error } = await supabaseAdmin
        .from("featured_events")
        .select("title, location, date, time, featured_event_id")
        .eq("featured_event_id", featured_event_id)
        .single();

    if (event_error) {
        console.error("Error fetching event details: ", event_error);
    }

    const {
        error: confirmation_email_sent_error,
        data: confirmation_email_sent,
    } = await supabaseAdmin
        .from("featured_event_bookings")
        .select("confirmation_email_sent")
        .eq("user_id", user_id)
        .eq("featured_event_id", featured_event_id)
        .single();
    if (confirmation_email_sent?.confirmation_email_sent === true) {
        console.log(
            "Confirmation email already sent.",
            confirmation_email_sent.confirmation_email_sent,
        );
        return;
    }
    if (confirmation_email_sent_error) {
        console.error(
            "Something went wrong checking the confirmation email was sent: ",
            confirmation_email_sent_error,
        );
    }

    const edge_function_base_url =
        "https://wffeinvprpdyobervinr.supabase.co/functions/v1/ticket-purchase-email-prod";

    const response = await fetch(edge_function_base_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
            }`,
        },
        body: JSON.stringify({
            name: user.name,
            email: user.email,
            title: event.title,
            location: event.location,
            date: event.date && event.time &&
                (formatDateShortWeekday(event.date) + ", " +
                    event.time.slice(0, -3)),
            // qrValue: base64Qr.split(",")[1],
            tickets: tickets,
            country_code: "GB",
        }),
    });

    const { error: update_confirmation_email_sent_error } = await supabaseAdmin
        .from("featured_event_bookings")
        .update({
            confirmation_email_sent: true,
        })
        .eq("user_id", user_id)
        .eq("featured_event_id", featured_event_id);

    if (update_confirmation_email_sent_error) {
        console.error(update_confirmation_email_sent_error.message);
    }
    console.log('Email sent successfully')
};

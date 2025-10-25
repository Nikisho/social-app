import { supabaseAdmin } from "./supabase.ts";

export const generateTicket = async (
    user_id:number,
    featured_event_id:number,
    date: Date,
    ticket_type_id: number
) => {
    const qrValue = `com.linkzy://event/${featured_event_id}/user/${user_id}`;
    const eventDate = new Date(date)
    const { error, data } = await supabaseAdmin
        .from('tickets')
        .insert({
            user_id: user_id,
            featured_event_id: featured_event_id,
            qr_code_link: qrValue,
            ticket_type_id: ticket_type_id,
            expiry_date: new Date(eventDate.setDate(eventDate.getDate() + 1))
        })
        .select('ticket_id')
        .single();

        if (data) {
            return data.ticket_id;
        }

        if (error) {
            throw error.message;
        }
}
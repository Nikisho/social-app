import { supabaseAdmin } from "./supabase.ts";

export const bookFeaturedEvent = async (
    user_id: number,
    featured_event_id: number,
    tickets_sold: number,
    ticket_transaction_id: number,
    chat_room_id:number
) => {
    try {
        // const ticketSoldNumber = new Number(tickets_sold)
        const { error } = await supabaseAdmin
            .from('featured_event_bookings')
            .insert({
                user_id: user_id,
                featured_event_id: featured_event_id,
                ticket_transaction_id: ticket_transaction_id

            })
        if (error) {
            console.error(error.message);
        } else {
            const { error } = await supabaseAdmin
                .from('featured_events')
                .update({
                    tickets_sold: Number(tickets_sold) + 1
                })
                .eq('featured_event_id', featured_event_id)

            if (error)
                console.error(error.message);
        }


        const { error: participantsError } = await supabaseAdmin
            .from('participants')
            .insert({
                user_id: user_id,
                chat_room_id: chat_room_id
            })
        if (participantsError) {
            console.error(participantsError.message);
        }
    } catch (error) {
        throw error
    }
}
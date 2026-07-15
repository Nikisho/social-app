import { supabaseAdmin } from "./supabase.ts";

export async function cancelTicketsIndividualRefund(
    featured_event_id: number,
    user_id: number,
) {
    try {
        // Cancel tickets and return their ticket types
        const { data: cancelledTickets, error } = await supabaseAdmin
            .from("tickets")
            .update({ cancelled: true })
            .eq("featured_event_id", featured_event_id)
            .eq("user_id", user_id)
            .eq("cancelled", false)
            .select("ticket_type_id");

        if (error) {
            throw error;
        }

        if (!cancelledTickets || cancelledTickets.length === 0) {
            return {
                success: true,
                message: "No tickets found to cancel",
            };
        }

        // Count cancelled tickets per ticket type
        const ticketTypeCounts: Record<number, number> = {};

        cancelledTickets.forEach((ticket:{ticket_type_id:number}) => {
            ticketTypeCounts[ticket.ticket_type_id] =
                (ticketTypeCounts[ticket.ticket_type_id] || 0) + 1;
        });


        // Re-increment availability
        for (const [ticketTypeId, count] of Object.entries(ticketTypeCounts)) {

            const { data: ticketType, error: fetchError } =
                await supabaseAdmin
                    .from("ticket_types")
                    .select("tickets_sold")
                    .eq("ticket_type_id", Number(ticketTypeId))
                    .single();

            if (fetchError) {
                throw fetchError;
            }

            const { error: updateError } =
                await supabaseAdmin
                    .from("ticket_types")
                    .update({
                        tickets_sold: Math.max(
                            0,
                            ticketType.tickets_sold - count
                        ),
                    })
                    .eq("ticket_type_id", Number(ticketTypeId));

            if (updateError) {
                throw updateError;
            }
        }

        return {
            success: true,
            refundedTickets: cancelledTickets.length,
        };

    } catch (err) {
        console.error("Error cancelling tickets:", err);
        throw err;
    }
}
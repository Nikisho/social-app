import { supabaseAdmin } from "./supabase.ts";
import { stripe } from "./stripe.ts";

export async function initiateRefundForDeleteEvent(featured_event_id: number) {

    try {
        const { data, error } = await supabaseAdmin
            .from("tickets")
            .select("*, ticket_transactions(*)")
            .eq("featured_event_id", featured_event_id);

        if (error || !data) {
            console.error(error?.message || "No event found");
            return;
        }

        if (data.length === 0) {
            console.log(
                "No tickets found for this event, no refunds to process.",
            );
            return;
        }
        if (data && data.length > 0) {
            const paymentIntentIds = [
                ...new Set(
                    data.flatMap(
                        (
                            ticket: {
                                ticket_transactions: {
                                    stripe_payment_id: string;
                                }[];
                            },
                        ) => ticket.ticket_transactions?.map(
                            (tx) => tx.stripe_payment_id,
                        ) ?? [],
                    ),
                ),
            ];
            console.log("Payment Intents to refund: ", paymentIntentIds);

            for (const paymentIntentId of paymentIntentIds) {
                try {
                    const refund = await stripe.refunds.create({
                        payment_intent: paymentIntentId,
                        refund_application_fee: true,
                        reverse_transfer: true,
                    });

                    if (refund.status === "succeeded") {
                        console.log(
                            `Refund successful for Payment Intent ${paymentIntentId}`,
                        );

                     const { error } = await supabaseAdmin
                        .from('ticket_transactions')
                        .update({
                            status: 'refunded'
                        })
                        .eq('stripe_payment_id',paymentIntentId )
                        if (error) console.error('Error updating the payment status');

                    } else {
                        console.error(
                            `Refund failed for Payment Intent ${paymentIntentId}: ${refund.status}`,
                        );
                    }
                } catch (err) {
                    console.error(
                        `Error refunding Payment Intent ${paymentIntentId}:`,
                        err,
                    );
                }
            }
        }
    } catch (err) {
        console.error("Error initiating refunds: ", err);
        throw err;
    }
}

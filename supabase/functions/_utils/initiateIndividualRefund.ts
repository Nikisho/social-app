import { supabaseAdmin } from "./supabase.ts";
import { stripe } from "./stripe.ts";

export async function initiateIndividualRefund(
    featured_event_id: number,
    user_id: number,
) {
    try {
        const { data: tickets, error } = await supabaseAdmin
            .from("tickets")
            .select(`
                ticket_id,
                ticket_transactions (
                    stripe_payment_id,
                    status
                )
            `)
            .eq("featured_event_id", featured_event_id)
            .eq("user_id", user_id);

        if (error) {
            throw error;
        }

        if (!tickets || tickets.length === 0) {
            console.log("No tickets found.");
            return;
        }

        // Get unique payment intents
        const paymentIntentIds = [
            ...new Set(
                tickets
                    .flatMap((ticket:any) => ticket.ticket_transactions)
                    .map((transaction :any)=> transaction.stripe_payment_id)
                    .filter(Boolean)
            ),
        ];


        if (paymentIntentIds.length === 0) {
            console.log("No payments found.");
            return;
        }


        for (const paymentIntentId of paymentIntentIds) {

            const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
                refund_application_fee: true,
                reverse_transfer: true,
            });


            if (refund.status === "succeeded") {

                console.log(
                    `Refund successful: ${paymentIntentId}`
                );

                const { error: updateError } =
                    await supabaseAdmin
                        .from("ticket_transactions")
                        .update({
                            status: "refunded",
                        })
                        .eq(
                            "stripe_payment_id",
                            paymentIntentId
                        );

                if (updateError) {
                    console.error(
                        "Failed updating transaction:",
                        updateError.message
                    );
                }

            } else {
                console.error(
                    `Refund failed: ${paymentIntentId}`,
                    refund.status
                );
            }
        }

    } catch (err) {
        console.error(
            "Error initiating refunds:",
            err
        );
        throw err;
    }
}
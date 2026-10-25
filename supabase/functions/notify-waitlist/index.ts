import { supabaseAdmin } from "../_utils/supabase.ts";
import { notifyWaitListOnTicketCancel } from "../_utils/notifyWaitListOnTicketCancel.ts";

Deno.serve(async (_req) => {
  try {
    const now = new Date().toISOString();

    // 1. Find notifications whose 15-minute window has expired
    const { data: expiredEntries, error: fetchError } =
      await supabaseAdmin
        .from("event_waitlist")
        .select("event_waitlist_id, ticket_type_id, expires_at")
        .eq("status", "notified")
        .lte("expires_at", now);

    if (fetchError) throw fetchError;

    if (!expiredEntries || expiredEntries.length === 0) {
      return new Response(
        JSON.stringify({ message: "No expired notifications." }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    console.log(
      `[Waitlist Cron] Found ${expiredEntries.length} expired notifications`,
    );

    // Process each ticket type only once per invocation
    const processedTicketTypes = new Set<number>();

    for (const entry of expiredEntries) {
      // 2. Mark the notification as expired
      const { data: updatedEntry, error: updateError } =
        await supabaseAdmin
          .from("event_waitlist")
          .update({ status: "expired" })
          .eq("event_waitlist_id", entry.event_waitlist_id)
          .eq("status", "notified")
          .lte("expires_at", now)
          .select("event_waitlist_id")
          .maybeSingle();

      if (updateError) {
        console.error(
          `[Waitlist Cron] Failed to expire entry ${entry.event_waitlist_id}`,
          updateError,
        );
        continue;
      }

      // Another invocation may already have processed this entry
      if (!updatedEntry) continue;

      const ticketTypeId = Number(entry.ticket_type_id);

      if (processedTicketTypes.has(ticketTypeId)) continue;
      processedTicketTypes.add(ticketTypeId);

      // 3. Check current ticket availability
      const { data: ticketType, error: ticketError } =
        await supabaseAdmin
          .from("ticket_types")
          .select("quantity, tickets_sold")
          .eq("ticket_type_id", ticketTypeId)
          .maybeSingle();

      if (ticketError) {
        console.error(
          `[Waitlist Cron] Failed to check ticket type ${ticketTypeId}`,
          ticketError,
        );
        continue;
      }

      if (!ticketType) {
        console.error(
          `[Waitlist Cron] Ticket type ${ticketTypeId} not found`,
        );
        continue;
      }

      const available =
        Number(ticketType.quantity) - Number(ticketType.tickets_sold);

      console.log(
        `[Waitlist Cron] Ticket type ${ticketTypeId}: ${available} available`,
      );

      // 4. Notify the next person only if tickets are available
      if (available > 0) {
        console.log(
          `[Waitlist Cron] Notifying next person for ticket type ${ticketTypeId}`,
        );

        await notifyWaitListOnTicketCancel(ticketTypeId);
      } else {
        console.log(
          `[Waitlist Cron] Ticket type ${ticketTypeId} is sold out. No email sent.`,
        );
      }
    }

    return new Response(
      JSON.stringify({ message: "Waitlist processing completed." }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("[Waitlist Cron] Unexpected error:", error);

    return new Response(
      JSON.stringify({ error: "Waitlist processing failed." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
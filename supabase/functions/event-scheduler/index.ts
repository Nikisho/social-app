// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";

Deno.serve(async (req: Request) => {
  const { __DEV__ } = await req.json();
  function getWeekAfterNextWeekday(
    runDate: Date,
    dayOfWeek: number,
    eventExistsNextWeek: boolean | undefined,
  ): Date {
    // dayOfWeek: 1 = Monday, 7 = Sunday
    const result = new Date(runDate);
    // Step 1: move to next Monday
    const daysUntilNextMonday = ((8 - result.getDay()) % 7) || 7;
    result.setDate(result.getDate() + daysUntilNextMonday);
    // step 2 : add 1 week.
    if (eventExistsNextWeek) {
      result.setDate(result.getDate() + 1 * 7);
    }
    // Step 3: add (dayOfWeek - 1) days
    result.setDate(result.getDate() + (dayOfWeek - 1));
    return result;
  }

  const getNextMonday = () => {
    const d = new Date();
    d.setDate(d.getDate() + (((1 + 7 - d.getDay()) % 7) || 7));
    d.setHours(0, 0, 0, 0); // normalize to midnight
    return d;
  };

  function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const checkEventExistsNextWeek = async (series_id: number) => {
    const nextMonday = getNextMonday();
    const nextSunday = addDays(nextMonday, 6);

    const { data, error } = await supabaseAdmin
      .from("featured_events")
      .select("featured_event_id, date")
      .eq("series_id", series_id)
      .gte("date", nextMonday.toISOString())
      .lte("date", nextSunday.toISOString())
      .limit(1);

    if (error) {
      console.error(error.message);
      return false;
    }
    return data && data.length > 0;
  };

  const checkAlreadyScheduled = async (series_id: number, targetDate: Date) => {
    const { data, error } = await supabaseAdmin
      .from("featured_events")
      .select("featured_event_id")
      .eq("series_id", series_id)
      .eq("date", targetDate.toISOString().split("T")[0]);

    if (error) {
      console.error("Error checking scheduled event:", error.message);
      return false;
    }
    return data && data.length > 0;
  };
  function getSalesWindow(
    eventDate: string | Date,
  ) {
    const date = new Date(eventDate);

    // sales start: 7 days before event
    const sales_start = new Date(date);
    sales_start.setDate(date.getDate() - 7);

    // sales end: 1 day before event
    const sales_end = new Date(date);
    sales_end.setDate(date.getDate() - 1);

    return {
      sales_start: sales_start.toISOString(),
      sales_end: sales_end.toISOString(),
    };
  }
  try {
    const { data, error } = await supabaseAdmin
      .from("recurring_series")
      .select(`*, featured_events(*, ticket_types(*))`)
      .eq("paused", false);

    if (data) {
      const seriesList = data;
      for (const series of seriesList) {
        const eventExistsNextWeek = checkEventExistsNextWeek(series.series_id);
        const today = new Date();
        const nextEventDate = getWeekAfterNextWeekday(
          today,
          series.day_of_week,
          await eventExistsNextWeek,
        );

        const exists = await checkAlreadyScheduled(
          series.series_id,
          nextEventDate,
        );
        if (exists) {
          console.log(
            `Skipping, event ${series.featured_events.title} already exists for ${nextEventDate} :`,
          );
          continue;
        }
        console.log("See ticket types :", series.featured_events.ticket_types);
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from("featured_events")
          .insert({
            title: series.featured_events.title,
            description: series.featured_events.description,
            image_url: series.featured_events.image_url,
            organizer_id: series.featured_events.organizer_id,
            price: series.featured_events.price,
            location: series.featured_events.location,
            date: nextEventDate,
            time: series.featured_events.time,
            is_free: series.featured_events.is_free,
            max_tickets: series.featured_events.max_tickets,
            chat_room_id: series.featured_events.chat_room_id,
            series_id: series.series_id,
            test: __DEV__ ? true : false,
          })
          .select("featured_event_id")
          .single();

        if (insertError) {
          console.error(
            "Error inserting intor featured_events: ",
            insertError.message,
          );
        }

        for (const ticket of series.featured_events.ticket_types) {
          console.log("look here :", ticket.sales_start);

          const { sales_start, sales_end } = getSalesWindow(nextEventDate);

          const clonedTicket = {
            name: ticket.name,
            price: ticket.price,
            is_free: ticket.is_free,
            description: ticket.description,
            quantity: ticket.quantity,
            is_active: ticket.is_active,
            organizer_id: ticket.organizer_id,
            tickets_sold: 0, // reset
            sales_start: sales_start,
            sales_end: sales_end,
            featured_event_id: insertData.featured_event_id,
          };

          const { error } = await supabaseAdmin.from("ticket_types").insert(
            clonedTicket,
          );
          if (error) {
            console.error("Could not add ticket type :", error.message);
          }
        }
      }
    }
    if (error) {
      console.error("Error querying from recurring_series :", error.message);
    }

    return new Response(JSON.stringify(req), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify(error),
      { headers: { "Content-Type": "application/json" } },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/event-scheduler' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

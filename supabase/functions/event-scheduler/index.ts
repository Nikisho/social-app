// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";

Deno.serve(async (req: Request) => {
  const { __DEV__ } = await req.json();
  function getWeekAfterNextWeekday(runDate: Date, dayOfWeek: number): Date {
    // dayOfWeek: 1 = Monday, 7 = Sunday
    const result = new Date(runDate);
    // Step 1: move to next Monday
    const daysUntilNextMonday = ((8 - result.getDay()) % 7) || 7;
    result.setDate(result.getDate() + daysUntilNextMonday);
    // step 2 : add 1 week.
    result.setDate(result.getDate() + 1 * 7)
    // Step 3: add (dayOfWeek - 1) days
    result.setDate(result.getDate() + (dayOfWeek - 1));
    return result;
  }

  try {

    const { data, error } = await supabaseAdmin
      .from("recurring_series")
      .select(`*, featured_events(*)`)
      .eq('paused', false)

    if (data) {
      const seriesList = data;
      for (const series of seriesList) {

        const today = new Date();
        const nextEventDate =  getWeekAfterNextWeekday(today, series.day_of_week);
        const { error: insertError } = await supabaseAdmin
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
            test: __DEV__? true : false
          });

        if (insertError) {
          console.error(
            "Error inserting intor featured_events: ",
            insertError.message,
          );
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

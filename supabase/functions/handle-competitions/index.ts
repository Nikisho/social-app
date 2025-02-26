// deno-lint-ignore-file no-explicit-any
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { Database } from "../_utils/db_types.ts";
import { sendWinnerNotification } from '../_utils/sendWinnerNotification.ts'
// Define types for the data structures
type Prize = {
  rank: number;
  trophy_id: number;
  congratulation_title: string;
  congratulation_message: string;
};

type Winner = {
  rank: number;
  name: string;
  poster_id: number;
  expo_push_token: string;
};

type Notification = {
  title: string;
  message: string;
  user_id: number;
  token: string;
};

type PrizeMap = {
  [rank: number]: {
    trophyId: number;
    title: string;
    message: string;
  };
};

// Initialize Supabase client
const supabaseAdmin = createClient<Database>(
  Deno.env.get("SECRET_SUPABASE_URL") ?? "",
  Deno.env.get("SECRET_SUPABASE_KEY") ?? "",
);

Deno.serve(async () => {
  try {
    // Fetch winners from the leaderboard
    const { data: winners, error: leaderboardError } = await supabaseAdmin.rpc("get_leaderboard", {
      filter: "week",
      lmt: 3,
    });

    if (leaderboardError) {
      console.error("Leaderboard error:", leaderboardError.message);
      throw leaderboardError;
    }

    // Fetch prizes from the database
    const { data: prizes, error: prizeError } = await supabaseAdmin
      .from("dim_competition_prizes")
      .select("rank, trophy_id, congratulation_message, congratulation_title");

    if (prizeError) {
      console.error("Prize error:", prizeError.message);
      throw prizeError;
    }

    // Create a map of prizes by rank
    const prizeMap: PrizeMap = prizes.reduce((acc: PrizeMap, prize: Prize) => {
      acc[prize.rank] = {
        trophyId: prize.trophy_id,
        title: prize.congratulation_title,
        message: prize.congratulation_message,
      };
      return acc;
    }, {});

    // Generate notifications for winners
    const notifications: Notification[] = winners.map((winner: Winner) => ({
      //token: winner.expo_push_token,
      token: 'ExponentPushToken[1kcfbtMG-arjymKHbnzwzN]',
      title: prizeMap[winner.rank].title,
      message: prizeMap[winner.rank].message.replace("{name}", winner.name),
      user_id: winner.poster_id,
    }));

    console.log("Notifications:", notifications);
    // await sendWinnerNotification(notifications)
    const delay = (ms:number) => new Promise(res => setTimeout(res, ms));
    for (const notif of notifications) {
        await sendWinnerNotification(notif.token, notif.title, notif.message);
        await delay(5000);
    }

    // Prepare data for insertion into the database
    const inserts = winners.map((winner: Winner) => ({
      rank: winner.rank,
      trophy_id: prizeMap[winner.rank].trophyId,
      user_id: winner.poster_id,
    }));

    // Uncomment to insert data into the database
    // const { error: insertError } = await supabaseAdmin
    //   .from("fact_user_competition_prizes")
    //   .insert(inserts);

    // if (insertError) {
    //   console.error("Insert error:", insertError.message);
    //   throw insertError;
    // }

    // Return the number of winners as a response
    return new Response(JSON.stringify(winners.length), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error:any) {
    // Handle errors and return a 400 status code
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
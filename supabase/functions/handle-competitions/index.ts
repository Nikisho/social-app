// deno-lint-ignore-file no-explicit-any
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
// import { Database } from "../_utils/db_types.ts";
import { sendWinnerNotification } from '../_utils/sendWinnerNotification.ts'
import { supabaseAdmin } from '../_utils/supabase.ts'

type Prize = {
  rank: number;
  trophy_id: number;
  congratulation_title: string;
  congratulation_message: string;
  gem_reward: number;
};

type Winner = {
  rank: number;
  name: string;
  poster_id: number;
  expo_push_token: string;
  gem_count: number;
};

type PrizeMap = {
  [rank: number]: {
    trophyId: number;
    title: string;
    message: string;
    gem_reward: number;
  };
};

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
      .select(`
        rank
        , trophy_id
        , congratulation_message
        , congratulation_title
        , gem_reward
        `
    );
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
        gem_reward: prize.gem_reward
      };
      return acc;
    }, {});

    //Send the notifications.
    for (const {rank, expo_push_token } of winners) {
        await sendWinnerNotification(
            'ExponentPushToken[1kcfbtMG-arjymKHbnzwzN]',
            prizeMap[rank].title,
            prizeMap[rank].message
        );
    }

    // Prepare data for insertion into the database
    const inserts = winners.map((winner: Winner) => ({
      rank: winner.rank,
      trophy_id: prizeMap[winner.rank].trophyId,
      user_id: winner.poster_id,
    }));
    
    const { error: insertError } = await supabaseAdmin
      .from("fact_user_competition_prizes")
    // .insert(inserts);

    if (insertError) {
      console.error("Insert error:", insertError.message);
      throw insertError;
    }

    //Give gem rewards
    for (const { rank, poster_id, gem_count } of winners) {
        const newGemCount = gem_count + (prizeMap[rank]?.gem_reward || 0);
        // const { error } = await supabaseAdmin
        //   .from("users")
        //   .update({ gem_count: newGemCount })
        //   .eq("id", poster_id);
      
        // if (error) console.error(`Failed to update gems for user ${poster_id}:`, error.message);
      }

    return new Response(JSON.stringify(winners), {
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
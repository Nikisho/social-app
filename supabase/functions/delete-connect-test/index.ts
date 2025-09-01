import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { stripe } from "../_utils/stripe.ts";

Deno.serve(async (_req) => {
  try {
    // List all accounts (paginate if you’ve got more than 100)
    const accounts = await stripe.accounts.list({ limit: 100 });

    for (const account of accounts.data) {
      // ⚠️ Only do this in test mode
      await stripe.accounts.del(account.id);
      console.log(`Deleted account: ${account.id} (${account.email})`);
    }

    return new Response("All test accounts deleted ✅", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to delete test accounts", { status: 500 });
  }
});

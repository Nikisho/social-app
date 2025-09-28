import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { Database } from "./db_types.ts";

export const supabaseAdmin = createClient<Database>(
  Deno.env.get("SECRET_SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  // Deno.env.get("SERVICE_ROLE_KEY") ?? ""
);
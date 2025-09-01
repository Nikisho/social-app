import { supabaseAdmin } from "./supabase.ts";

export const getOrganizerAccount = async (uid: string) => {
    const { data: user, error:userError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('uid', uid) 
        .single()
    if (userError) {
        console.error('getOrganizerAccount select user.id failed: ', userError.message);
        return null;
    }

    if (user) {
        console.log('getOrganizerAccount Running ', user.id)
    }

    const { data:organizer, error:stripeError } = await supabaseAdmin
        .from('organizers')
        .select('stripe_account_id')
        .eq('user_id', user.id)
        .single()

    if (stripeError) {
        console.error("getOrganizerAccount select organizers.stripe_account_id failed: ", stripeError.message);
        return null;
    }
    return organizer?.stripe_account_id ?? null;
};
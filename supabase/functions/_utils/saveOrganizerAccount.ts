import { supabaseAdmin } from "./supabase.ts";

export const saveOrganizerAccount = async (uid: string, stripe_account_id: string) => {
    //STEP 1: Get users.id from the users table
    const { data:user, error:user_id_error } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("uid", uid)
        .single()
    if (user_id_error) {
        console.error('Could not retrieve user_id: ', user_id_error.message )
    }
    if (user) {
        console.log('saveFunction Running ', user.id)
    }
    //STEP 2: Add the user id to the organizers table as well as the stripe account id
    const { error } = await supabaseAdmin
        .from('organizers')
        .insert({
            user_id: user.id,
            stripe_account_id: stripe_account_id,
            status: 'pending'
        })
    if (error) {
        console.error('Something went wrong: ', error.message)
    }
    
};



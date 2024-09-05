import { supabase } from "../../../supabase";

const hasUserLikedEvent = async (user_id: number, event_id: number) => {

    // Query the PostLikes table
    const { data, error } = await supabase
        .from('event_likes')
        .select('id')
        .eq('user_id', user_id)
        .eq('event_id', event_id)
        .single();
    // Return true if a record was found
    if (data) {
        return data !== null;
    };

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows return, the user has not liked the post.
            return;
        }
        console.error(error.message);
    }
};

export default hasUserLikedEvent;
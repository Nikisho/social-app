import { supabase } from "../../../supabase";

const hasUserLikedEvent = async (user_id:number, event_id:number) => {

    try {
        // Query the PostLikes table
        const { data, error } = await supabase
            .from('event_likes')
            .select('id')
            .eq('user_id', user_id)
            .eq('event_id', event_id)
            .single();

        if (error) {
            throw error;
        }
        // Return true if a record was found
        return data !== null;
    } catch (error) {
        console.error('Error checking like status:', error);
        return false;
    }
}

export default hasUserLikedEvent;
import { supabase } from "../../../supabase";

export default async function getLikeCount(event_id: number) {
    const { count, error } = await supabase
        .from('event_likes')
        .select('*', { count: 'exact' })  // Request exact count of rows
        .eq('event_id', event_id);
    if (error) {
        console.error('Error fetching like count:', error);
        return null;
    }

    return count;
}
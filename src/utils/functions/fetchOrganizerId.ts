import { supabase } from "../../../supabase";

const fetchOrganizerId = async (user_id: number) => {
    const { data, error } = await supabase
        .from("organizers")
        .select("organizer_id")
        .eq("user_id", user_id)
        .single();
    if (data) {
        return data.organizer_id;
    }
    if (error) {
        console.error(error.message);
    }
    return null;
};
export default fetchOrganizerId;
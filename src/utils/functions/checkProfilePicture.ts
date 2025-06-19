import { supabase } from "../../../supabase";

export default async function checkProfilePicture(
    user_id: number,
): Promise<boolean | null> {
    const { data, error } = await supabase
        .from("users")
        .select("photo")
        .eq("id", user_id)
        .maybeSingle();

    if (error) {
        console.error(error.message);
        return null;
    }

    if (!data || data.photo === null) {
        return false;
    }

    return true;
}

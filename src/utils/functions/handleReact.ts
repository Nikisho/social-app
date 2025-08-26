import { supabase } from "../../../supabase";

export const handleReact = async (
    message_id: number, 
    reaction_id: number,
    currentUserId: number,
    chat_room_id:number,
    setReactionBannerVisible: (bool: boolean) => void,
    fetchMessages: () => void
) => {
    const { error } = await supabase
        .from("message_reactions")
        .insert({
            message_id,
            reaction_id,
            user_id: currentUserId,
        });

    setReactionBannerVisible(false);

    if (error?.code === "23505") {
        // Fetch existing reaction for this message + user
        const { data: existing } = await supabase
            .from("message_reactions")
            .select("*")
            .eq("message_id", message_id)
            .eq("user_id", currentUserId)
            .single();
        if (existing?.reaction_id === reaction_id) {
            // Same emoji → remove it
            const { error: deleteError } = await supabase
                .from("message_reactions")
                .delete()
                .eq("message_id", message_id)
                .eq("user_id", currentUserId);
            if (deleteError) console.error(deleteError);
        } else {
            // Different emoji → swap it
            await supabase
                .from("message_reactions")
                .update({ reaction_id })
                .eq("message_id", message_id)
                .eq("user_id", currentUserId);
        }
    } else if (error) {
        console.error(error);
    }
    const { error: ChatRoomError } = await supabase
        .from("chat_rooms")
        .update({
            updated_at: new Date(),
        })
        .eq("chat_room_id", chat_room_id);
    if (ChatRoomError) console.error('Error updating chat room: ', ChatRoomError.message)
    fetchMessages();
};

import { supabaseAdmin } from "./supabase.ts";

export const createCommunityChat = async (organizerId: number) => {
    try {
        const { data:chatRoom, error: chatRoomError } = await supabaseAdmin
            .from('chat_rooms')
            .insert({
                type: 'group',
            })
            .select('chat_room_id')
            .single();
        if (chatRoomError) {
            console.error("CreateCommunityChat function Error creating chat room: ", chatRoomError);
            return;
        }

        if (chatRoom) {
            console.log("CreateCommunityChat function Chat room created with ID: ", chatRoom.chat_room_id);
        }

        console.log('Now updating the organizer with the chat room ID...');

        const { data: organizerData, error: updateOrganizerError } = await supabaseAdmin
            .from('organizers')
            .update({
                chat_room_id: chatRoom?.chat_room_id
            })
            .eq('organizer_id', organizerId)
            .select('user_id')
            .single()
        if (updateOrganizerError) {
            console.error("CreateCommunityChat function Error updating organizer: ", updateOrganizerError);
            return;
        }

        const { error: insertParticipantError } = await supabaseAdmin
            .from('participants')
            .insert({
                user_id: organizerData?.user_id,
                chat_room_id: chatRoom?.chat_room_id
            })
        if (insertParticipantError) {
            console.error("CreateCommunityChat function Error inserting participant: ", insertParticipantError);
            return;
        }
    }
    catch (error) {
        console.error("CreateCommunityChat function Error creating community chat: ", error);
    }
}
import { supabase } from "../../../supabase";

export default async function markMessagesRead(chatRoomId: number, userId: number, lastMessageId: number) {
  const { error } = await supabase
    .from('user_chat_reads')
    .upsert({
      chat_room_id: chatRoomId,
      user_id: userId,
      last_read_message_id: lastMessageId,
    }, { onConflict: ['chat_room_id', 'user_id'] } as never);

  if (error) {
    console.error('Failed to mark messages read:', error.message);
  }
}
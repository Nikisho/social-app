import { View, ListRenderItem, FlatList } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import ChatCard from './ChatCard';
import { useFocusEffect } from '@react-navigation/native';
import NoMessagesView from './NoMessageView';
import SecondaryHeader from '../../components/SecondaryHeader';

interface ChatDataProps {
	user_id: number;
	featured_event_id: number;
	photo: string;
	title: string;
	last_message_content: string;
	last_message_time: string;
	room_id: number;
	unique_key: string;
	chat_room_id: number;
	type: string;
};

const ChatListScreen = () => {
	const [chats, setChats] = useState<Array<ChatDataProps>>();
	const currentUser = useSelector(selectCurrentUser);
	const fetchChats = async () => {
		const [privateRes, groupRes] = await Promise.all([
			supabase.rpc('fetch_private_chats', { current_user_id: currentUser.id }),
			supabase.rpc('fetch_group_chats', { current_user_id: currentUser.id })
		]);
		if (privateRes.error) console.error('Private chat error:', privateRes.error.message);
		if (groupRes.error) console.error('Group chat error:', groupRes.error.message);

		if (privateRes.data || groupRes.data) {
			// Tag chats so your UI knows which is which
			const taggedPrivate = (privateRes.data || []).map((chat: ChatDataProps) => ({
				...chat,
				type: 'private'
			}));

			const taggedGroup = (groupRes.data || []).map((chat: ChatDataProps) => ({
				...chat,
				type: 'group'
			}));

			// Combine and sort by latest message
			const combined = [...taggedPrivate, ...taggedGroup].sort(
				(a, b) => Number(new Date(b.last_message_time)) - Number(new Date(a.last_message_time))
			);

			setChats(combined);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchChats();
		}, [])
	);
	const renderItem: ListRenderItem<ChatDataProps> = ({ item }) => (
		<ChatCard item={item}
			currentUser={currentUser}
		/>
	);
	return (
		<View className=''>
			<SecondaryHeader
				displayText='My chats'
			/>
			{
				chats && chats?.length !== 0 ?
					<FlatList
						className={`-mx-2 ${'h-[83%]'}`}
						data={chats}
						renderItem={renderItem}
						keyExtractor={(item: ChatDataProps) => item.chat_room_id.toString()}
					/> :
					<View className='h-full'>
						<NoMessagesView />
					</View>
			}

		</View>
	)

}
export default ChatListScreen
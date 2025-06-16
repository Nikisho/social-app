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
	receiver_id: number
	receiver_photo: string
	receiver_name: string
	content: string;
	last_message_time: string;
	room_id: number;
	unique_key: string;
	chat_room_id: number;
	type: string
};

const ChatListScreen = () => {
	const [receivers, setReceivers] = useState<Array<ChatDataProps>>();
	const currentUser = useSelector(selectCurrentUser);
	const fetchReceivers = async () => {
		const { error, data } = await supabase
			.rpc('fetch_receivers_test_v2', { current_user_id: currentUser.id });
		if (data) { setReceivers(data); }
		if (error) { console.error(error.message); }
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchReceivers();
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
				receivers?.length !==0 ?
					<FlatList
						className={`-mx-2 ${'h-[83%]'}`}
						data={receivers}
						renderItem={renderItem}
						keyExtractor={(item: ChatDataProps) => item.unique_key}
					/> :
					<View className='h-full'>
						<NoMessagesView/>
					</View>
			}

		</View>
	)

}
export default ChatListScreen
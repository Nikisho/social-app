import { View, ListRenderItem, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import ChatCard from './ChatCard';
import { useFocusEffect } from '@react-navigation/native';
import NoMessagesView from './NoMessageView';
import SecondaryHeader from '../../components/SecondaryHeader';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../loading/LoadingScreen';
import * as Notifications from 'expo-notifications';
interface ChatDataProps {
	user_id: number;
	unread_count: number
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
	const { t } = useTranslation();
	const [loading, setLoading] = useState<boolean>(false);

	const fetchChats = async (isInitialLoad?: boolean) => {
		isInitialLoad && setLoading(true);
		try {
			const [privateRes, groupRes] = await Promise.all([
				supabase.rpc('fetch_private_chats_v2', { current_user_id: currentUser.id }),
				supabase.rpc('fetch_group_chats_v2', { current_user_id: currentUser.id })
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
		} catch (error) {
			console.error(error)
		}
		finally {
			isInitialLoad && setLoading(false);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchChats(true);
		}, [])
	);
	useEffect(() => {
		// This will trigger when a notification is received while the app is in the foreground
		const subscription = Notifications.addNotificationReceivedListener(notification => {
			// You can inspect the notification to make sure it’s a chat update
			const data = notification.request.content.data
			if (data?.screen === 'ChatScreen' || data?.screen ==='GroupChatScreen') {
				fetchChats();
			}
		});
		return () => subscription.remove();
	}, []);

	const renderItem: ListRenderItem<ChatDataProps> = ({ item }) => {
		return (
			<ChatCard item={item}
			/>
		)
	};

	if (loading) {
		return <LoadingScreen displayText='Getting your chats...' />
	}
	return (
		<View className=''>
			<SecondaryHeader
				displayText={t('chat_list_screen.title')}
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
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colours from '../utils/styles/colours';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../context/navSlice';
import { RootStackNavigationProp } from '../utils/types/types';
import { supabase } from '../../supabase';
import Badge from './Badge';
import { usePushNotifications } from '../utils/functions/usePushNotifications';
import * as Notifications from 'expo-notifications';
const Navbar = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const currentUser = useSelector(selectCurrentUser);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number | null>(null);
  const menuItems = [
    {
      icon: <View>
        <Entypo name="message" size={26} color="white" />
        <Badge messageCount={unreadMessagesCount!} />
      </View>,
      navigation: 'chatlist',
      text: 'Messages'

    },
    {
      icon: <Entypo name="home" size={26} color="white" />,
      navigation: 'featuredEvents',
      text: 'Home'

    },
    {
      icon: <Entypo name="ticket" size={26} color="white" />,
      navigation: 'ticketfeed',
      text: 'Tickets'

    },
    {
      icon: <Ionicons name="person" size={30} color="white" />,
      navigation: 'profile',
      text: 'Profile'
    },
  ];

  if (currentUser.isOrganizer === true) {
    menuItems.splice(2, 0, {
      icon: <Entypo name="calendar" size={30} color="white" />,
      navigation: 'dashboard',
      text: 'Events'

    });
  }
  const { expoPushToken } = usePushNotifications();
  const updateExpoPushToken = async () => {
    if (currentUser.id === null) {
      return;
    }
    const { error } = await supabase
      .from('users')
      .update({
        expo_push_token: expoPushToken?.data
      })
      .eq('id', currentUser.id)
    if (error) { console.error(error.message); }
  };
  const fetchUnreadMessagesCount = async () => {
    const { data, error } = await supabase.rpc('fetch_unread_messages_count_v2', { current_user_id: currentUser.id })
    if (data) {
      setUnreadMessagesCount(data[0].count);
    }
    if (error) {
      throw error.message
    }
  }

  useEffect(() => {
    fetchUnreadMessagesCount();
    updateExpoPushToken();
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data
      if (data?.screen === 'ChatScreen' || data?.screen === 'GroupChatScreen') {
        fetchUnreadMessagesCount();
      }
    });
    return () => subscription.remove();
  }, [expoPushToken, currentUser.isOrganizer]);

  return (
    <View
      style={{ backgroundColor: colours.secondaryColour }}
      className={`absolute inset-x-0 bottom-0 flex items-center justify-between flex-row ${Platform.OS === 'ios' ? 'h-[10%]' : 'h-[8%]'}`}>
      {
        menuItems.map((item) => (
          <TouchableOpacity key={menuItems.indexOf(item)} className={` flex justify-center w-1/5 items-center space-y-1`}
            onPress={() => {
              if (item.navigation === 'chatlist' || item.navigation === 'featuredEvents' || item.navigation === 'ticketfeed' || item.navigation === 'dashboard') {
                navigation.navigate(item.navigation as never);
              } else if (item.navigation === 'profile') {
                navigation.navigate('profile', {
                  user_id: currentUser.id,
                })
              }
            }}>
            <Text className='text-lg'>{item.icon}</Text>
            <Text className='text-white text-xs'>
              {item.text}
            </Text>
          </TouchableOpacity>
        ))
      }
    </View>
  )
}

export default Navbar
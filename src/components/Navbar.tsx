import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colours from '../utils/styles/colours';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../context/navSlice';
import { RootStackNavigationProp } from '../utils/types/types';
import { supabase } from '../../supabase';
import Badge from './Badge';


const Navbar = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const currentUser = useSelector(selectCurrentUser);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number | null>(null);
  const menuItems = [
    {
      icon: <AntDesign name="search1" size={30} color="white" />,
      navigation: 'search'
    },
    {
      icon: <Entypo name="home" size={30} color="white" />,
      navigation: 'home'
    },
    {
      icon: <View>
        <Entypo name="message" size={30} color="white" />

        <Badge messageCount={unreadMessagesCount!} />
      </View>,
      navigation: 'chatlist'
    },
    {
      icon: <Ionicons name="person" size={30} color="white" />,
      navigation: 'profile'
    },
  ];


  const fetchUnreadMessagesCount = async () => {
    const { data, error } = await supabase.rpc('fetch_unread_messages_count', { current_user_id: currentUser.id })
    if (data) {
      setUnreadMessagesCount(data[0].count);
    }
    if (error) {
      throw error.message
    }
  }

  useEffect(() => {
    fetchUnreadMessagesCount();


    //THIS IS A TEMPORARY SOLUTION AS THIS FORCES DATA TO BE FETCHED EACH 
    //TIME THE MESSAGES TABLE IS UPDATED. NOT SUSTAINABLE IN LONG TERM!
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          // filter: ''
        },
        (payload) => {
          console.log('Change detected:', payload);
          fetchUnreadMessagesCount();  // Re-fetch unread messages count when data changes
        }
      )
      .subscribe();
  }, []);

  return (
    <View
      style={{ backgroundColor: colours.secondaryColour }}
      className=' absolute inset-x-0 bottom-0 h-[8%] flex justify-between flex-row'>

      {
        menuItems.map((item) => (
          <TouchableOpacity key={menuItems.indexOf(item)} className={` flex justify-center w-1/4 items-center`}
            onPress={() => {
              if (item.navigation === 'search' || item.navigation === 'home' || item.navigation === 'chatlist') {
                navigation.navigate(item.navigation);
              } else if (item.navigation === 'profile') {
                navigation.navigate('profile', {
                  user_id: currentUser.id,
                })
              }
            }}>
            <Text className='text-lg'>{item.icon}</Text>
          </TouchableOpacity>
        ))
      }
    </View>
  )
}

export default Navbar
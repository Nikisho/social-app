import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colours from '../utils/styles/colours';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../context/navSlice';
import { RootStackNavigationProp } from '../utils/types/types';


const Navbar = () => {
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
      icon: <Entypo name="message" size={30} color="white" />,
      navigation: 'chatlist'
    },
    {
      icon: <Ionicons name="person" size={30} color="white" />,
      navigation: 'profile'
    },
  ];
  const navigation = useNavigation<RootStackNavigationProp>();
  const currentUser = useSelector(selectCurrentUser);
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
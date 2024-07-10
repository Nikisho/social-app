import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';

const Navbar = () => {
  const menuItems = [
    {
      icon: <AntDesign name="search1" size={30} color="black" />
    },
    {
      icon: <Entypo name="home" size={30} color="black" />

    },
    {
      icon: <Entypo name="message" size={30} color="black" />
    },
    {
      icon: <Ionicons name="person" size={30} color="black" />
    }
  ];

  return (
    <View className=' absolute bg-amber-300 inset-x-0 bottom-0 h-16 flex justify-between flex-row'>

      {
        menuItems.map((item) => (
          <TouchableOpacity key={menuItems.indexOf(item)} className={` flex justify-center w-1/4 items-center`}>
            <Text className='text-lg'>{item.icon}</Text>
          </TouchableOpacity>
        ))
      }
    </View>
  )
}

export default Navbar
import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Navbar = () => {
  const menuItems = [
    {
      name: 'Home'
    },
    {
      name: 'Home'
    },
    {
      name: 'Home'
    },
  ];

  return (
    <View className=' absolute inset-x-0 bottom-0 h-16 flex justify-between flex-row'>

      {
        menuItems.map((item) => (
          <TouchableOpacity key={menuItems.indexOf(item)} className='flex justify-center w-1/3 items-center border-x border-y'>
            <Text className='text-xl'>{item.name}</Text>
          </TouchableOpacity>
        ))
      }
    </View>
  )
}

export default Navbar
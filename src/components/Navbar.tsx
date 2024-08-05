import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';


const Navbar = () => {
  const menuItems = [
    {
      icon: <AntDesign name="search1" size={30} color="black" />,
      navigation:'search'
    },
    {
      icon: <Entypo name="home" size={30} color="black" />,
      navigation:'home'
    },
    {
      icon: <Entypo name="message" size={30} color="black" />,
      navigation:'messages'
    },
    {
      icon: <Ionicons name="person" size={30} color="black" />,
      navigation:'profile'
    }
  ];
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
    <View 
      className=' absolute bg-orange-200 inset-x-0 bottom-0 h-16 flex justify-between flex-row'>

      {
        menuItems.map((item) => (
          <TouchableOpacity key={menuItems.indexOf(item)} className={` flex justify-center w-1/4 items-center`} 
              onPress={() => navigation.navigate(item.navigation)}>
            <Text className='text-lg'>{item.icon}</Text>
          </TouchableOpacity>
        ))
      }
    </View>
  )
}

export default Navbar
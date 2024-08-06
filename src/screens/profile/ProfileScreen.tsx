import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import UserEvents from './UserEvents';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../../supabase';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';


interface UserDataProps {
  name: string;
  photo: string;
  id: string;

}
const ProfileScreen = ({route}:any) => {
  const { user_id } = route.params;
  const [userData, setUserData] = useState<UserDataProps>();
  // const navigation = useNavigation<NativeStackNavigationProp<any>>();
  
  const fetchUserData = async () => {
    const { error, data } = await supabase
      .from('users')
      .select()
      .eq('id', user_id)
      if (data) {
        setUserData(data[0]);
      };
      if (error) {
        throw error;
      }
  };

  useEffect(()=>{
    fetchUserData();
  },[user_id]) 

  return (
    <View className='mx-2'>
      {
        userData && (

          <View className=' flex items-center space-y-3 h-1/3 justify-center border-b'>
        {
          userData.photo ?
          (
            <Image
            className='w-20 h-20 rounded-full'
            source={{
                  uri: `${userData.photo }`,
                }}
                />
              ) :
            <>
              <FontAwesome name="user-circle" size={70} color="black" />
            </>
        }
        <Text className='text-xl font-bold'>
          {userData.name}
        </Text>
      </View>
            )
          }
      <UserEvents 
        user_id={user_id}
      />
    </View>
  )
}

export default ProfileScreen
import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import UserEvents from './UserEvents';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../../supabase';
import Entypo from '@expo/vector-icons/Entypo';
import styles from '../../utils/styles/shadow';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';

interface UserDataProps {
  name: string;
  photo: string;
  id: string;

}
const ProfileScreen = ({ route }: any) => {
  const { user_id } = route.params;
  const [userData, setUserData] = useState<UserDataProps>();
  const currentUser = useSelector(selectCurrentUser);
  const navigation = useNavigation<RootStackNavigationProp>();

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

  useEffect(() => {
    fetchUserData();
  }, [user_id])

  return (
    <View className='mx-2'>
      {
        userData && (

          <View className=' flex items-center space-y-2 h-1/3 justify-center border-b'>
            {
              userData.photo ?
                (
                  <Image
                    className='w-20 h-20 rounded-full'
                    source={{
                      uri: `${userData.photo}`,
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
            {
              user_id !== currentUser.id && (
                <TouchableOpacity
                  onPress={() => { navigation.navigate('chat',
                    {user_id: user_id}
                  )}}
                  style={styles.shadowButtonStyle}
                  className=' p-2  rounded-xl'>
                  <Entypo name="chat" size={24} color="white" />
                </TouchableOpacity>
              )
            }

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
import { View, Text, Image, Alert, TouchableOpacity, ToastAndroid, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import UserEvents from './UserEvents';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../../supabase';
import Entypo from '@expo/vector-icons/Entypo';
import styles from '../../utils/styles/shadow';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, setCurrentUser } from '../../context/navSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProfileScreenRouteProp, RootStackNavigationProp } from '../../utils/types/types';
import colours from '../../utils/styles/colours';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import Fontisto from '@expo/vector-icons/Fontisto';
import AmendBioModal from './AmendBioModal';

interface UserDataProps {
  name: string;
  age: string;
  photo: string;
  id: number | null;
  bio: string

}
const ProfileScreen = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const { user_id } = route.params;
  const [userData, setUserData] = useState<UserDataProps>({
    age: '',
    bio: '',
    id: null,
    photo: '',
    name: ''
  });
  const currentUser = useSelector(selectCurrentUser);
  const navigation = useNavigation<RootStackNavigationProp>();
  const isCurrentUserProfile = user_id === currentUser.id;
  const [modalVisible, setModalVisible] = useState(false);
  const [originalBio, setOriginalBio] = useState('');
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    const { error, data } = await supabase
      .from('users')
      .select()
      .eq('id', user_id)
    if (data) {
      setUserData(data[0]);
      setOriginalBio(data[0].bio!);
    };
    if (error) {
      throw error;
    }
  };
  const handlePressChat = () => {
    navigation.navigate('chat',
      { user_id: user_id }
    );
  };

  const updateProfilePictureInStorageBucket = async (file: string) => {
    const arrayBuffer = decode(file)
    try {
      const { error } = await supabase
        .storage
        .from('users')
        .upload(`${currentUser.id}/profile_picture.jpg`, arrayBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (error) {
        console.error('Upload error:', error.message);
      }
    } catch (error) {
      console.error('Conversion or upload error:', error);
    }
  }


  const updateUserDescription = async () => {
    if (!userData?.bio || userData.bio === '') {
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({
        bio: userData.bio
      })
      .eq('id', currentUser.id);
    if (error) { console.error(error.message); }
    setModalVisible(!modalVisible);
    Platform.OS === 'android' ? ToastAndroid.show('Description changed successfully', ToastAndroid.SHORT) : Alert.alert('Description changed successfully')
  }

  const closeModal = () => {
    setUserData((prevData: UserDataProps) => ({
      ...prevData,
      bio: originalBio
    }));
    setModalVisible(!modalVisible);
  }

  const pickImage = async () => {
    if (!isCurrentUserProfile) {
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your gallery to let you select images.',
        [{ text: 'OK' }]
      );
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setUserData((prevData: UserDataProps) => ({
        ...prevData,
        photo: result.assets[0].uri
      }))
      updateProfilePictureInStorageBucket(result.assets[0].base64!);
      const photoUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/users/${currentUser.id}/profile_picture.jpg?v=${new Date().getTime()}`
      const { error } = await supabase
        .from('users')
        .update({
          photo: photoUrl,
        })
        .eq('id', currentUser.id);
      if (error) { console.error(error.message); }

      dispatch(setCurrentUser({
        name: currentUser.name,
        photo: photoUrl,
        id: currentUser.id

      }))
      Platform.OS === 'android' ? ToastAndroid.show('Profile picture saved successfully', ToastAndroid.SHORT) : Alert.alert('Profile picture changed successfully');

    }


  }
  useEffect(() => {
    fetchUserData();
  }, [user_id])

  return (
    <View className='mx-2 h-[92%]'>
      {
        userData && (
          <View className='h-[40%]'>
            <View className=' flex space-x-5 py-2 flex flex-row items-center'>
              <TouchableOpacity
                className='flex flex-row items-center space-x-3'
                onPress={pickImage}

              >
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
                {
                  isCurrentUserProfile && (
                    <View className='absolute right-5'>
                      <FontAwesome className='' name="edit" size={30} color="white" />
                    </View>
                  )
                }

              </TouchableOpacity>
              <View className='flex flex- items-start justify-between space-y-2 '>

                <View className='flex flex-row space-x-3'>

                  <Text className='text-xl font-bold'>
                    {userData.name}
                  </Text>
                  {
                    userData.age && (
                      <View
                        style={{ backgroundColor: colours.secondaryColour }}
                        className='rounded-full px-3'
                      >

                        <Text
                          className='text-lg font-bold text-white'>
                          {userData.age}
                        </Text>
                      </View>
                    )
                  }
                </View>
                {
                  !isCurrentUserProfile ? (
                    <TouchableOpacity
                      onPress={handlePressChat}
                      style={styles.shadowButtonStyle}
                      className=' p-2 rounded-xl flex flex-row place-self-end'>
                      <Entypo name="chat" size={24} color="white" />
                    </TouchableOpacity>
                  ) :
                  (
                    <TouchableOpacity 
                      onPress={() => navigation.navigate('settings')}
                      className='rounded-full p-1 bg-white'
                      style={styles.shadow}
                    >
                      <Fontisto name="player-settings" size={24} color="black" />
                    </TouchableOpacity>
                  )
                }
              </View>


            </View>
            <View className='flex flex-row items-center space-x-3'>
              <Text className='text-lg font-semibold my-1'>About</Text>
              {
                isCurrentUserProfile && (
                  <TouchableOpacity className=' flex flex-row ' onPress={() => setModalVisible(!modalVisible)}>
                    <FontAwesome name="edit" size={20} color="black" />
                  </TouchableOpacity>
                )
              }
            </View>

            <ScrollView>

              {
                userData.bio? 
                <Text className='text-sm'
                >
                  {userData.bio}
                </Text> :
                <View className='w-full flex items-center justify-center'>
                  {currentUser.id === user_id? 
                  <Text>
                    Add a description to help others know you better!
                  </Text> :
                  <Text>
                    This user has not added a description
                  </Text>
                  }
                </View>
              }

            </ScrollView>
            <AmendBioModal 
              setModalVisible={setModalVisible}
              closeModal={closeModal}
              userData={userData}
              setUserData={setUserData}
              modalVisible={modalVisible}
              updateUserDescription={updateUserDescription}
            />
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
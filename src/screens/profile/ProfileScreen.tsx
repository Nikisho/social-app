import { View, Text, Image, ImageBackground, Alert, Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import UserEvents from './UserEvents';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../../supabase';
import Entypo from '@expo/vector-icons/Entypo';
import styles from '../../utils/styles/shadow';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import colours from '../../utils/styles/colours';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
interface UserDataProps {
  name: string;
  age: string;
  photo: string;
  id: string;
  bio: string

}
const ProfileScreen = ({ route }: any) => {
  const { user_id } = route.params;
  const [userData, setUserData] = useState<UserDataProps>();
  const currentUser = useSelector(selectCurrentUser);
  const navigation = useNavigation<RootStackNavigationProp>();
  const isCurrentUserProfile = user_id === currentUser.id;
  const [modalVisible, setModalVisible] = useState(false);

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
    if (!userData?.bio || userData.bio ==='') {
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
  }



  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setUserData((prevData: any) => ({
        ...prevData,
        photo: result.assets[0].uri
      }))
      updateProfilePictureInStorageBucket(result.assets[0].base64!);
      const { error } = await supabase
        .from('users')
        .update({
          photo: `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/users/${currentUser.id}/profile_picture.jpg?v=${new Date().getTime()}`,
        })
        .eq('id', currentUser.id);
      if (error) { console.error(error.message); }
    }
  }
  useEffect(() => {
    fetchUserData();
  }, [user_id])

  return (
    <View className='mx-2 h-[90%]'>
      {
        userData && (
          <View className='h-[40%]'>
            <View className=' flex items-center space-y-2'>
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
                    <View className=''>
                      <FontAwesome className='' name="edit" size={20} color="black" />
                    </View>
                  )
                }

              </TouchableOpacity>
              <View className='flex flex-row space-x-3 items-center'>

                <Text className='text-xl font-'>
                  {userData.name}
                </Text>
                <Text className='text-xl font-'>
                  -
                </Text>
                <Text className='text-xl font-'>
                  {userData.age}
                </Text>
              </View>
              {
                !isCurrentUserProfile && (
                  <TouchableOpacity
                    onPress={handlePressChat}
                    style={styles.shadowButtonStyle}
                    className=' p-2  rounded-xl'>
                    <Entypo name="chat" size={24} color="white" />
                  </TouchableOpacity>
                )
              }

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
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
              <View className='flex-1 justify-center items-center mt-22' >
                <View className='bg-white rounded-xl m-20 h-1/2 w-4/5 p-5 space-y-5' style={styles.shadow} >
                  <TextInput className='mb-15 border rounded-lg p-2'
                    value={userData.bio}
                    multiline={true}
                    onChangeText={(value) => (setUserData((prevData: any) => ({
                      ...prevData,
                      bio: value
                    })))}

                  >

                  </TextInput>
                  <View className='flex flex-row space-x-1 justify-center'>
                    <TouchableOpacity
                      className='rounded-full p-2 bg-red-500 w-1/2'
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text className='text-white text-center font-bold'>close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{backgroundColor: colours.secondaryColour}}
                      className='rounded-full p-2 w-1/2'
                      onPress={updateUserDescription}>
                      <Text className='text-white text-center font-bold'>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <ScrollView>
              <Text className='text-sm'
              >
                {userData.bio}
              </Text>
            </ScrollView>

          </View>

        )
      }
      <UserEvents
        user_id={user_id}
      />
    </View>
  )
}
const modalStyles = StyleSheet.create({

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
});
export default ProfileScreen
import { View, Text, Image, Alert, Modal, TouchableOpacity, ToastAndroid, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import UserEvents from './UserEvents';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../../supabase';
import Entypo from '@expo/vector-icons/Entypo';
import styles from '../../utils/styles/shadow';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, setCurrentUser } from '../../context/navSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProfileScreenRouteProp, RootStackNavigationProp } from '../../utils/types/types';
import colours from '../../utils/styles/colours';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import DeleteProfileModal from './DeleteProfileModal';
interface UserDataProps {
  name: string;
  age: string;
  photo: string;
  id: string;
  bio: string

}
const ProfileScreen = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const { user_id } = route.params;
  const [userData, setUserData] = useState<UserDataProps>();
  const currentUser = useSelector(selectCurrentUser);
  const navigation = useNavigation<RootStackNavigationProp>();
  const isCurrentUserProfile = user_id === currentUser.id;
  const [modalVisible, setModalVisible] = useState(false);
  const [originalBio, setOriginalBio] = useState('');
  const dispatch = useDispatch();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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
    setUserData((prevData: any) => ({
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
      setUserData((prevData: any) => ({
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
                    <View className='absolute right-5'>
                      <FontAwesome className='' name="edit" size={30} color="white" />
                    </View>
                  )
                }

              </TouchableOpacity>
              <View className='flex flex-row items-center justify-between space-x-3 '>

                <Text className='text-xl font-bold'>
                  {userData.name}
                </Text>
                {
                  userData.age && (
                    <Text 
                        style={{backgroundColor: colours.secondaryColour}}
                        className='text-xl px-4 rounded-full font-bold text-white'>
                      {userData.age}
                    </Text>
                  )
                }

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
                    maxLength={300}
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
                      onPress={closeModal}>
                      <Text className='text-white text-center font-bold'>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ backgroundColor: colours.secondaryColour }}
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
      {
        isCurrentUserProfile &&
        <>
          <TouchableOpacity
            onPress={() => setDeleteModalVisible(!deleteModalVisible)}
            className='w-full mt-4 bg-gray-200 py-3  flex flex-row justify-center rounded-xl'>
            <Text className='font-semibold'>Delete your account</Text>
          </TouchableOpacity>
          <DeleteProfileModal
            modalVisible={deleteModalVisible}
            setModalVisible={setDeleteModalVisible}
            currentUserId={currentUser.id}
          />
        </>

      }

    </View>
  )
}
export default ProfileScreen
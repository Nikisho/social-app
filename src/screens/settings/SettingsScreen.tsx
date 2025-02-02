import { View, Text, TouchableOpacity, Linking } from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import DeleteProfileModal from './DeleteProfileModal';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import SecondaryHeader from '../../components/SecondaryHeader';

const SettingsScreen = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigation = useNavigation<RootStackNavigationProp>();

  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  const menuItems = [
    {
      title: 'Privacy Policy',
      icon: <MaterialIcons name="privacy-tip" size={24} color="black" />,
      onPress: () => openURL('https://www.linkzyapp.com/privacypolicy.html'),
    },
    {
      title: 'End-User License Agreement',
      icon: <AntDesign name="filetext1" size={24} color="black" />,
      onPress: () => navigation.navigate('eula'),
    },
    {
      title: 'Contact Support',
      icon: <MaterialIcons name="headphones" size={24} color="black" />,
      onPress: () => openURL('https://www.linkzyapp.com/contactus.html'),
    },
    {
      title: 'About Linkzy',
      icon: <AntDesign name="questioncircle" size={24} color="black" />,
      onPress: () => openURL('https://www.linkzyapp.com'),
    },
  ];

  return (
    <View className="h-full">
      <View className='px-2'>

      <SecondaryHeader
        displayText='Account settings'
        />
        </View>
      <View className="w-full flex flex-row justify-center pb-5">
      </View>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.onPress}
          className="py-5 px-4 border-t flex flex-row items-center space-x-4"
        >
          {item.icon}
          <Text>{item.title}</Text>
        </TouchableOpacity>
      ))}

      <>
        <TouchableOpacity
          onPress={() => setDeleteModalVisible(!deleteModalVisible)}
          className="w-full bg-red-500 py-5 flex flex-row justify-center"
        >
          <Text className="font-semibold text-white">Delete your account</Text>
        </TouchableOpacity>
        <DeleteProfileModal
          modalVisible={deleteModalVisible}
          setModalVisible={setDeleteModalVisible}
          currentUserId={currentUser.id}
        />
      </>
    </View>
  );
};

export default SettingsScreen;

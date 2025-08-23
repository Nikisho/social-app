import { View, Text, TouchableOpacity, Linking } from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import DeleteProfileModal from './DeleteProfileModal';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import SecondaryHeader from '../../components/SecondaryHeader';
import { useTranslation } from 'react-i18next';

const SettingsScreen = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigation = useNavigation<RootStackNavigationProp>();
  const { t } = useTranslation();
  const openURL = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  const menuItems = [
    {
      title: `${t('settings_screen.privacy_policy')}`,
      icon: <MaterialIcons name="privacy-tip" size={24} color="black" />,
      // onPress: () => openURL('https://www.linkzyapp.com/privacypolicy.html'),
      onPress: () => navigation.navigate('privacypolicy'),

    },
    {
      title: `${t('settings_screen.eula')}`,
      icon: <AntDesign name="filetext1" size={24} color="black" />,
      onPress: () => navigation.navigate('eula'),
    },
    {
      title: `${t('settings_screen.contact_us')}`,
      icon: <MaterialIcons name="headphones" size={24} color="black" />,
      onPress: () => openURL('https://www.linkzyapp.com/contactus.html'),
    },
    {
      title: `${t('settings_screen.about')}`,
      icon: <AntDesign name="questioncircle" size={24} color="black" />,
      onPress: () => navigation.navigate('about'),
    },
  ];

  return (
    <View className="h-full">
      <View className=''>

      <SecondaryHeader
        displayText={t('settings_screen.title')}
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
          <Text className="font-semibold text-white">{t('settings_screen.deleteaccount')}</Text>
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

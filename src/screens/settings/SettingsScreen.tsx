import { View, Text, TouchableOpacity } from 'react-native';
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
      // onPress: () => openURL('https://www.linkzyapp.com/contactus.html'),
      onPress: () => currentUser.id === 386 ? console.log('Nope') : navigation.navigate('chat', { user_id: 386 })
    },
    {
      title: `${t('settings_screen.about')}`,
      icon: <AntDesign name="questioncircle" size={24} color="black" />,
      onPress: () => navigation.navigate('about'),
    },
  ];

  return (
    <View className="h-full">
      <View className='mb-3'>

        <SecondaryHeader
          displayText={t('settings_screen.title')}
        />
      </View>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.onPress}
          style={{borderTopWidth: 0.2}}
          className="py-5 px-4 flex flex-row items-center space-x-4"
        >
          {item.icon}
          <Text>{item.title}</Text>
        </TouchableOpacity>
      ))}
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
    </View>
  );
};

export default SettingsScreen;

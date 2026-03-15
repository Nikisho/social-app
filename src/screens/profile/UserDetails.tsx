import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import { useTranslation } from 'react-i18next';
import UserDetailsRole from './UserDetailsRole';

interface UserDetailsProps {
    name: string;
    dateOfBirth: Date | null;
    photo: string;
    bio: string;
    sex: number | null;
    handlePressChat: () => void;
    setModalVisible: (modalVisible: boolean) => void;
    setProfilePictureModalVisible: (profilePictureModalVisible: boolean) => void;
    isCurrentUserProfile: boolean
    user_id: number;
    modalVisible: boolean;
    profilePictureModalVisible: boolean
    isOrganizer?: boolean | null;
}

const UserDetails: React.FC<UserDetailsProps> = ({
    name,
    photo,
    dateOfBirth,
    bio,
    sex,
    handlePressChat,
    setModalVisible,
    isCurrentUserProfile,
    user_id,
    modalVisible,
    profilePictureModalVisible,
    setProfilePictureModalVisible,
    isOrganizer
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    const genderColour = sex === 0 ? 'bg-green-400' : (sex === 1 ? 'bg-sky-600' : 'bg-red-300')
    const { t } = useTranslation();
    return (
        <View>
            <View className='flex py-1 items-center'>
                <TouchableOpacity
                    className='flex flex-items-center space-x-3 border  rounded-full'
                    onPress={() => setProfilePictureModalVisible(!profilePictureModalVisible)}
                >
                    {
                        photo ?
                            (
                                <Image
                                    className='w-36 h-36 rounded-full'
                                    source={{
                                        uri: `${photo}`,
                                    }}
                                />
                            ) :
                            <>
                                <FontAwesome name="user-circle" size={150} color="black" />
                            </>
                    }

                </TouchableOpacity>

                <UserDetailsRole
                    isOrganizer={isOrganizer!}
                    user_id={user_id}
                />
                <View className='absolute top-0 right-0 items-end grow px-5'>
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

            <View className='flex flex-row items-center space-x-3 mb-3'>
                <Text className='text-lg font-semibold '>
                    {t('profile_screen.about')}
                </Text>
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
                    bio ?
                        <Text className='text-sm'
                        >
                            {bio}
                        </Text> :
                        <View className='w-full flex items-center justify-center'>
                            {currentUser.id == user_id ?
                                <Text className='italic text-center text-lg'>
                                    {t('profile_screen.add_description_prompt')}
                                </Text> :
                                <Text className='italic text-lg text-center'>
                                    {t('profile_screen.no_description')}
                                </Text>
                            }
                        </View>
                }
            </ScrollView>
        </View>
    )
}

export default UserDetails
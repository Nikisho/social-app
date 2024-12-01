import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import { FontAwesome } from '@expo/vector-icons';
import colours from '../../utils/styles/colours';
import styles from '../../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import getAge from '../../utils/functions/getAge';

interface UserDetailsProps {
    name: string;
    dateOfBirth: Date | null;
    photo: string;
    bio: string
    handlePressChat: () => void;
    pickImage: () => void;
    setModalVisible: (modalVisible: boolean) => void;
    isCurrentUserProfile: boolean
    user_id: number;
    modalVisible: boolean;
}

const UserDetails: React.FC<UserDetailsProps> = ({
    name,
    photo,
    dateOfBirth,
    bio,
    handlePressChat,
    setModalVisible,
    pickImage,
    isCurrentUserProfile,
    user_id,
    modalVisible
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    return (
        <View className='h-[35%]'>
            <View className=' flex space-x-5 py-1 flex flex-row items-center'>
                <TouchableOpacity
                    className='flex flex-row items-center space-x-3'
                    onPress={pickImage}
                >
                    {
                        photo ?
                            (
                                <Image
                                    className='w-20 h-20 rounded-full'
                                    source={{
                                        uri: `${photo}`,
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
                            {name}
                        </Text>
                        {
                            dateOfBirth && (
                                <View
                                    style={{ backgroundColor: colours.secondaryColour }}
                                    className='rounded-full px-3'
                                >

                                    <Text
                                        className='text-lg font-bold text-white'>
                                        {getAge(dateOfBirth)}
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
                    bio ?
                        <Text className='text-sm'
                        >
                            {bio}
                        </Text> :
                        <View className='w-full flex items-center justify-center'>
                            {currentUser.id === user_id ?
                                <Text>
                                    Add a description to help others know you better!
                                </Text> :
                                <Text className='italic'>
                                    This user has not added a description
                                </Text>
                            }
                        </View>
                }
            </ScrollView>
        </View>
    )
}

export default UserDetails
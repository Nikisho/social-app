import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import { FontAwesome } from '@expo/vector-icons';
import colours from '../../utils/styles/colours';
import styles from '../../utils/styles/shadow';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import getAge from '../../utils/functions/getAge';
import Ionicons from '@expo/vector-icons/Ionicons';
import UserBadges from './UserBadges';
import { supabase } from '../../../supabase';
import ordinal_suffix_of from '../../utils/functions/ordinal_suffix_of';
import { useTranslation } from 'react-i18next';

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
}

interface trophyProps {
    rank: number;
    trophy_expiry_date: string;
    competition_period_type: string;
    trophy_id: string;
    dim_competition_prizes: {
        trophy_image: string;
        trophy_name: string;
    }
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
    setProfilePictureModalVisible
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    const genderColour = sex === 0 ? 'bg-green-400' : (sex === 1 ? 'bg-sky-600' : 'bg-red-300')
    const today = new Date('2025-04-05');
    const [trophies, setTrophies] = useState<trophyProps[] | null>(null);
    const { t } = useTranslation();
    const fetchUserTropHies = async () => {
        const { data, error } = await supabase
            .from('fact_user_competition_prizes')
            .select(
                `*, 
                    dim_competition_prizes(
                        trophy_id,
                        trophy_image,
                        trophy_name
                    )
                `)
            .eq('user_id', user_id)
            .limit(2)
            .filter('trophy_expiry_date', 'gte', new Date())

        if (error) {
            console.error(error)
        }

        if (data) {
            setTrophies(data)
        } else {
            console.log('No data');
            return;
        }

    };

    useFocusEffect(
        React.useCallback(() => {
            fetchUserTropHies();
        }, [user_id])
    );
    return (
        <View className=''>
            <View className='flex space-x-5 py-1 items-center'>
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
                                        uri: `${photo}t={${new Date()}}`,
                                    }}
                                />
                            ) :
                            <>
                                <FontAwesome name="user-circle" size={150} color="black" />
                            </>
                    }
                    {
                        false && (
                            <View className='absolute right-5'>
                                <FontAwesome className='' name="edit" size={30} color="white" />
                            </View>
                        )
                    }

                </TouchableOpacity>
                {/* <View className='flex justify-between space-y'> */}

                <View className='flex flex-row space-x-5 mt-5 '>

                    <Text className='text-xl font-bold'>
                        {name}
                    </Text>
                    {
                        dateOfBirth && (
                            <View
                                // style={{ backgroundColor: colours.secondaryColour }}
                                className={` flex flex-row rounded-lg px-2 h-7 space-x-2 ${genderColour}`}
                            >

                                {sex !== 0 && (
                                    <Text className="text-lg font-semibold  text-white">
                                        {sex === 1 ? "♂" : "♀"}
                                    </Text>
                                )}

                                <Text
                                    className='text-lg font-semibold text-white'>
                                    {getAge(dateOfBirth)}
                                </Text>
                            </View>
                        )
                    }
                </View>
                {/* <UserBadges
                        user_id={user_id}
                    /> */}
                {/* </View> */}
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
            {/* <View className=' w- flex flex-row space-x-2 pt-1' >
                {
                    trophy && (new Date(trophy?.trophy_expiry_date) > today)  && (
                    trophies?.map((trophy) => (
                        <View key={trophy.trophy_id} className='flex flex-row items-center space-x-1 rounded-full bg-amber-300 px-2 h-8'>
                            <Text
                                style={{ fontFamily: 'American Typewriter' }}
                                className='font-semi text-lg'>
                                {ordinal_suffix_of(trophy.rank).toString()}
                            </Text>
                            <Text> of the {trophy.competition_period_type}</Text>
                            <Text>{trophy.dim_competition_prizes.trophy_name}</Text>
                            <Image
                                className='h-10 w-9 rounded-full'
                                source={{
                                    uri: trophy.dim_competition_prizes.trophy_image
                                }}
                            />
                        </View>
                    )

                    )
                }
            </View> */}

            {/* Following banner */}
            {/* <View className='flex-row justify-center space-x-20'>
                <View className='p-3 b justify-center flex'>
                    <Text className='text-center font-bold text-lg'>20</Text>
                    <Text className='text-center text-sm'>
                        Following
                    </Text>
                </View>
                <View className='p-3 '>
                    <Text className='text-center font-bold text-lg '>34</Text>
                    <Text className='text-center'>
                        Followers
                    </Text>
                </View>
            </View> */}


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
                        <Text className='text-lg'
                        >
                            {bio}
                        </Text> :
                        <View className='w-full flex items-center justify-center'>
                            {currentUser.id === user_id ?
                                <Text className='italic text-center'>
                                    {t('profile_screen.add_description_prompt')}
                                </Text> :
                                <Text className='italic text-center'>
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
import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../../supabase';
import { selectCurrentUser } from '../../../context/navSlice';
import { useSelector } from 'react-redux';
import { getColorFromName } from '../../../utils/functions/getColorFromName';

interface PromoterDetailsProps {
    organizer_id: number;
    organizers: {
        users: {
            photo: string;
            name: string;
            id: number
        }
    }
}
const PromoterDetails: React.FC<PromoterDetailsProps> = ({
    organizer_id,
    organizers,
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    const { t } = useTranslation();
    const [userFollows, setUserFollows] = useState(false);
    const followDisplayText = userFollows ? 'Following' : 'Follow'

    const checkUserFollows = async () => {
        if (organizers.users.id === currentUser.id) return;
        const { data, error } = await supabase
            .from('organizer_followers')
            .select()
            .eq('follower_id', currentUser.id)
            .eq('organizer_id', organizer_id)
            .single()
        if (data) {
            setUserFollows(true);
        }
        if (error) {
            console.error(error.message)
        }
    }

    const handleFollow = async () => {

        try {
            if (!userFollows) {
                //If the user does not already follow, follow. 
                const { error } = await supabase
                    .from('organizer_followers')
                    .insert({
                        organizer_id: organizer_id,
                        follower_id: currentUser.id
                    })
                if (error) {
                    console.error(error.message);
                    return;
                }
                setUserFollows(true);
            } else if (userFollows) {
                //If the user already follows, unfollow.
                const { error } = await supabase
                    .from('organizer_followers')
                    .delete()
                    .eq('follower_id', currentUser.id)
                    .eq('organizer_id', organizer_id)
                if (error) { console.error(error.message); return; }
                setUserFollows(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        checkUserFollows();
    }, [userFollows, organizers]);
    return (
        <View className='p-2'>
            <Text className='text-xl font-bold'>
                {t('featured_event_screen.promoter')}
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('profile', {
                    user_id: organizers.users.id
                })}
                className='flex flex-row border items-center  space-x-5 rounded-xl p-2 my-3'
            >
                {
                    organizers?.users.photo ? (
                        <Image
                            className='w-10 h-10 rounded-full'
                            source={{
                                uri: organizers?.users.photo
                            }}
                        />
                    ) :
                        (
                            <View
                                style={{
                                    backgroundColor: getColorFromName(organizers?.users.name),
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 10,
                                }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                    {organizers?.users.name.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )
                }



                <Text className='text-xl'>
                    {organizers?.users.name}
                </Text>
                <View className='grow'>
                    {
                        currentUser.id !== organizers.users.id && (

                            <TouchableOpacity
                                onPress={() => handleFollow()}
                                className='self-end p-2 px-3 bg-black rounded-full'>
                                <Text className='text-white font-semibold'>
                                    {followDisplayText}
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default PromoterDetails
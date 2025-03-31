import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { supabase } from '../../../supabase';
import Feed from '../../components/Feed';
import { AntDesign } from '@expo/vector-icons';
import styles from '../../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import { usePagination } from '../../hooks/usePagination';


const UserEvents = ({ user_id }: { user_id: number }) => {
    const currentUser = useSelector(selectCurrentUser);
    const navigation = useNavigation<RootStackNavigationProp>();
    const fetchEvents = useCallback(
        async (page: number) => {
            const limit = 3;
            const offset = (page - 1) * limit;
            const { data, error } = await supabase.rpc('get_events_excluding_blocked_users_v2', {
                current_user_id: user_id,
                filter_user_id: user_id,
                sorting_option: 'event_date',
                hub_code: null,
                lmt: limit,
                ofst: offset,
            });

            if (error) throw error;
            return data || [];
        },
        [user_id]
    );
    useEffect(() => {
        onRefresh();
    }, [user_id]);

    const {
        data: eventList,
        page,
        hasMore,
        loading,
        refreshing,
        onRefresh,
        onEndReached,
    } = usePagination(fetchEvents);
    
    return (
        <View className='h-[51%] mt-5 flex space-y-2'>
            <View className=''>
                <Text className='text-lg font-semibold'>Events</Text>
            </View>
            {
                eventList?.length === 0 ?
                    (
                        currentUser.id === user_id ?
                            <View className='w-full h-1/2 justify-center flex items-center space-y-5'>
                                <Text className=''>
                                    Create your first event now!
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('submit')}
                                    className='p-4 bg-white rounded-full'
                                    style={styles.shadow}
                                >
                                    <AntDesign name="plus" size={30} color="black" />
                                </TouchableOpacity>
                            </View> :
                            <View className='w-full h-1/2 justify-center flex items-center space-y-5'>
                                <Text className='italic'>This user has not posted yet</Text>
                            </View>
                    )
                    :
                    <Feed
                        eventList={eventList}
                        loading={loading}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        onEndReached={onEndReached}
                    />
            }

        </View>
    )
}

export default UserEvents
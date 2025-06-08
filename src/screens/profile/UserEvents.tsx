import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../supabase';
import Feed from '../../components/Feed';
import { AntDesign } from '@expo/vector-icons';
import styles from '../../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import { usePagination } from '../../hooks/usePagination';
import { TabView, SceneMap } from 'react-native-tab-view';
import FeaturedEventsFeed from '../featuredEvents/featuredEvents/FeaturedEventsFeed';
import FeaturedEventsUser from './FeaturedEventsUser';

const routes = [
    { key: 'first', title: 'Feed' },
    { key: 'second', title: 'Second' },
];

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

    const FirstRoute = () => (
        <Feed
            eventList={eventList}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
        />
    );

    const SecondRoute = () => (
        // <FeaturedEventsUser
        //     user_id={user_id}
        // />
        <></>
    );

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute
    });

    return (
        <View className='h-[51%] mt-5 flex space-y-2'>
            <View className='flex flex-row w-full'>
                <View>
                    <Text className='text-lg font-bold'>
                        Events
                    </Text>
                </View>
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
                    // <Feed
                    //     eventList={eventList}
                    //     loading={loading}
                    //     refreshing={refreshing}
                    //     onRefresh={onRefresh}
                    //     onEndReached={onEndReached}
                    // />
                    // <TabView
                    //     navigationState={{ index, routes }}
                    //     renderScene={renderScene}
                    //     onIndexChange={setIndex}
                    //     initialLayout={{ width: layout.width }}
                    //     renderTabBar={() => null} 
                    // />

                    // <FeaturedEventsUser 
                    //     user_id={user_id}
                    // /> 
                    <></>

            }

        </View>
    )
}

export default UserEvents
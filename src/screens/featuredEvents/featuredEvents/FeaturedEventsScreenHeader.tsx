import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import styles from '../../../utils/styles/shadow'
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, setCurrentUser } from '../../../context/navSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { supabase } from '../../../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackNavigationProp } from '../../../utils/types/types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import DropdownMenu from '../../../components/DropdownMenu';
import { FontAwesome } from '@expo/vector-icons';

GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID });

const FeaturedEventsScreenHeader = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    const [openMenu, setOpenMenu] = useState(false);
    const navigateProfile = () => {
        navigation.navigate('profile',
            { user_id: currentUser.id }
        );
    }
    const signOut = async () => {
        try {

            //Sign out of Google.//
            await GoogleSignin.signOut();

            const { error } = await supabase.auth.signOut();
            if (error) throw error.message;

            //Remove access and refresh tokens from local storage.//
            await AsyncStorage.removeItem('userAccessToken');
            await AsyncStorage.removeItem('userRefreshToken');

            //Remove user info from redux.//
            dispatch(setCurrentUser({
                name: null,
                email: null,
                photo: null,
                id: null
            }))
        } catch (error) {
            console.error(error);
        }
    };
    useFocusEffect(
        React.useCallback(() => {
            setOpenMenu(false);
            return () => setOpenMenu(false);
        }, [])
    );
    return (
        <View className='p-3 flex flex-row items-center space-x-5 z-20'>
            <TouchableOpacity
                className='rounded-full p-3 w-12 h-12 bg-black flex flex-row items-center justify-center'
                style={styles.shadow}
                onPress={() => navigation.navigate('featuredEventsSubmit')}
            >
                <AntDesign name="plus" size={20} color="white" />
            </TouchableOpacity>

            <Text className='text-2xl font-semibold '>
                Featured
            </Text>

            <View className=' grow flex flex-row items-end justify-end'>

                <TouchableOpacity onPress={() => setOpenMenu(!openMenu)}>

                    {
                        currentUser?.photo ?
                            <Image
                                className='w-10 h-10 rounded-full'
                                source={{
                                    uri: currentUser?.photo,
                                }}
                            />
                            :
                            <>
                                <FontAwesome name="user-circle" size={42} color="black" />
                            </>
                    }
                </TouchableOpacity>
            </View>
            {
                openMenu && (
                    <DropdownMenu
                        signOut={signOut}
                        navigateProfile={navigateProfile}
                    />
                )
            }
        </View>
    )
}

export default FeaturedEventsScreenHeader
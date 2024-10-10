import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, setCurrentUser } from '../context/navSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../utils/styles/shadow';
import { supabase } from '../../supabase';
import { RootStackNavigationProp } from '../utils/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropdownMenu from './DropdownMenu';

GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID });
const Header = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    const [openMenu, setOpenMenu] = useState(false);

    const navigateProfile = () => {
        navigation.navigate('profile',
            {user_id: currentUser.id}
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
            })) // Remember to remove the user from your app's state as well
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
        <View className='w-full flex flex-row py-3 justify-between z-20'>
            <TouchableOpacity onPress={() => navigation.navigate('submit')} className='rounded-2xl px-3 py-1 border flex flex-row items-center space-x-1'>
                <AntDesign name="plus" size={20} color="black" />
                <Text >Create a post</Text>
            </TouchableOpacity>
            <View className='flex flex-row space-x-2'>
                <TouchableOpacity onPress={() => setOpenMenu(!openMenu)}>

                    {
                        currentUser?.photo ?
                            <Image
                                className='w-8 h-8 rounded-full'
                                source={{
                                    uri: currentUser?.photo,
                                }}
                            />
                            :
                            <>
                                <FontAwesome name="user-circle" size={30} color="black" />
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

export default Header
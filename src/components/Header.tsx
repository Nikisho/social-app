import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
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
import abbrNum from '../utils/functions/abbrNum';
import BuyGemsModal from './BuyGemsModal';

GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID });
const Header = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    const [openMenu, setOpenMenu] = useState(false);
    const [buyGemsModalVisible, setBuyGemsModalVisible] = useState<boolean>(false);

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
        <View className='w-full flex flex-row py-3 justify-between z-20'>
            <TouchableOpacity onPress={() => navigation.navigate('submit')}
                className='rounded-lg px-3 py-2 flex flex-row items-center space-x-1 bg-white'
                style={styles.shadow}
            >
                <AntDesign name="plus" size={20} color="black" />
                <Text className='text-whie font-bold' >New post</Text>
            </TouchableOpacity>
            <View className='flex flex-row space--2 items-center'>
                <View className='flex flex-row space-x-1 p-2 rounded-l-lg bg-amber-100'
                >
                    <Text className='font-bold '>

                        {currentUser?.gemCount ? abbrNum(currentUser?.gemCount, 1) : 0}
                    </Text>
                    <Text>
                        💎
                    </Text>

                </View>
                <TouchableOpacity className='bg-amber-200 p-2 mr-2 rounded-r-lg'
                    onPress={() => setBuyGemsModalVisible(!buyGemsModalVisible)}
                    >
                    <FontAwesome name="plus" size={17} color="black" />
                </TouchableOpacity>


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
                <BuyGemsModal 
                    modalVisible={buyGemsModalVisible}
                    setModalVisible={setBuyGemsModalVisible}
                    message='Get more gems'
                />
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
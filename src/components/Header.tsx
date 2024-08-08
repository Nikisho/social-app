import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, setCurrentUser } from '../context/navSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../utils/styles/shadow';

const Header = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const currentUser = useSelector(selectCurrentUser)
    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
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
    return (
        <View className='w-full flex flex-row py-3 justify-between'>
            <TouchableOpacity onPress={() => navigation.navigate('submit')} className='rounded-2xl px-3 py-1 border flex flex-row items-center space-x-1'>
                <AntDesign name="plus" size={20} color="black" />
                <Text >Create a post</Text>
            </TouchableOpacity>
            <View className='flex flex-row space-x-2'>
                {
                    currentUser?.photo ?

                        <Image
                            className='w-8 rounded-full'
                            source={{
                                uri: currentUser?.photo,
                            }}
                        />
                        :
                        <>
                            <FontAwesome name="user-circle" size={30} color="black" />
                        </>

                }

                <TouchableOpacity 
                    style={styles.shadowButtonStyle}
                    className='rounded-2xl px-3 py-1' onPress={signOut}>
                    <MaterialIcons name="logout" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Header
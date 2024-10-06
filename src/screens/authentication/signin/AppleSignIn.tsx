import * as AppleAuthentication from 'expo-apple-authentication';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../../context/navSlice';
import { useState } from 'react';

const AppleSignIn = () => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const handleSignIn = async () => {
        setLoading(true);
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            //Now authenticate with Supabase.
            if (credential.identityToken) {
                const { error: AuthUserError, data: { session } } = await supabase.auth.signInWithIdToken({
                    provider: 'apple',
                    token: credential.identityToken,
                });
                if (AuthUserError) { throw AuthUserError.message };

                if (session) {
                    await AsyncStorage.setItem('userAccessToken', session.access_token);
                    await AsyncStorage.setItem('userRefreshToken', session.refresh_token);

                    const { error, data } = await supabase
                        .from('users')
                        .select()
                        .eq('uid', session.user.id);

                    if (error) {throw error.message;}
                    if (data) {

                        //If no data, its a new sign up//
                        if (data.length === 0) {
                            Alert.alert('You do not have an account yet. Sign up instead')
                            setLoading(false);
                            return;
                        }
                        dispatch(setCurrentUser({
                            name: data[0].name,
                            email: data[0].email,
                            photo: data[0].photo,
                            id: data[0].id
                        }))
                    }
                }

            }
        } catch (e: any) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
                // handle that the user canceled the sign-in flow
            } else {
                // handle other errors
            }
        }
        setLoading(false);
    };

    return (
        <View className='flex w-5/6 items-center self-center mt-2'>
            <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading}
                className='w-full bg-black px-5 py-4 rounded-full flex flex-row 
                   items-center'>
                <AntDesign name="apple1" size={24} color="white" />
                <Text className='text-white font-bold text-lg ml-12'>Continue with apple</Text>
            </TouchableOpacity>
        </View>)
}

export default AppleSignIn
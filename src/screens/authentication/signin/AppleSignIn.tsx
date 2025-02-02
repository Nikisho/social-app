import * as AppleAuthentication from 'expo-apple-authentication';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../../context/navSlice';
import { useState } from 'react';
import platformAlert from '../../../utils/functions/platformAlert';

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

            if (!credential?.identityToken) {
                throw new Error('Apple sign-in failed: Missing identity token.');
            }

            //Now authenticate with Supabase.
            if (credential.identityToken) {
                const { error: AuthUserError, data: { session } } = await supabase.auth.signInWithIdToken({
                    provider: 'apple',
                    token: credential.identityToken,
                });
                if (AuthUserError) { 
                    console.error(AuthUserError.message);
                    if (AuthUserError.code === 'user_banned') {
                        platformAlert("Your account is suspended due to guideline violations. Contact support at support@linkzy.com for help")
                        return;
                    }
                };
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
                            return;
                        }
                        dispatch(setCurrentUser({
                            name: data[0].name,
                            email: data[0].email,
                            photo: data[0].photo,
                            id: data[0].id,
                            sex: data[0].sex,
				            gemCount: data[0].gem_count

                        }))
                    }
                }

            }
        } catch (e: any) {
            switch (e.code) {
                case 'ERR_REQUEST_CANCELED':
                    console.log('User canceled the Apple sign-in flow.');
                    Alert.alert('You canceled the sign-in process. Please try again if you wish to continue.');
                    break;
                case 'ERR_UNSUPPORTED_PLATFORM':
                    console.log('Apple sign-in is not supported on this platform.');
                    Alert.alert('Apple sign-in is not supported on this device.');
                    break;
                case 'ERR_NETWORK':
                    console.log('Network error occurred during Apple sign-in.');
                    Alert.alert('A network issue occurred. Please check your connection and try again.');
                    break;
                default:
                    console.error('Unknown Apple sign-in error:', e.message);
                    Alert.alert('An unknown error occurred. Please try again later.');
            }
        }
        finally {
            setLoading(false);
        }
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
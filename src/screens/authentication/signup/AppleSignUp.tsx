import * as AppleAuthentication from 'expo-apple-authentication';
import { View, StyleSheet, Text, TouchableOpacity, Platform, ToastAndroid, Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../../context/navSlice';
import { useState } from 'react';

interface AppleSignUpProps {
    name: string;
    age: string | null;
}

const AppleSignUp:React.FC<AppleSignUpProps> = ({
    name,
    age
}) => {

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

            //Authenticate with supabase//
            if (credential.identityToken) {
                const { error: AuthUserError, data: { session }} = await supabase.auth.signInWithIdToken({
                  provider: 'apple',
                  token: credential.identityToken,
                });

                console.log(JSON.stringify({ AuthUserError, session }, null, 2))
                if (session) {
                    await AsyncStorage.setItem('userAccessToken', session.access_token);
                    await AsyncStorage.setItem('userRefreshToken', session.refresh_token);

                    const { error, data } = await supabase
                    .from('users')
                    .insert({
                        name: name,
                        email: session.user.email,
                        uid: session.user.id,
                        age: age,
                        auth_provider: 'apple'
                    })
                    .select('id');
                    if (error) { console.error(error.message); }
                    if (error?.code === '23505') {
                        Platform.OS === 'android' ?
                        ToastAndroid.show('You already have an account, just sign in!', ToastAndroid.SHORT)
                        :
                        Alert.alert('You already have an account, just sign in!')
                        setLoading(false);
                        return;
                    }
    
                    if (data) {
                        dispatch(setCurrentUser({
                            name: name,
                            email: session.user.email,
                            id: data[0].id
                        }))
                    }
                }

              } else {
                throw new Error('No identityToken.');
              }
              ///////////////////////////////



            // signed in
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
        </View>
    )
}

export default AppleSignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 200,
        height: 44,
    },
});
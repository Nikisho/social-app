import { View, Text, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { supabase } from '../../../../supabase';
import styles from '../../../utils/styles/shadow';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import { useTranslation } from 'react-i18next';


const GoogleSignUp = ({
    isChecked
}: {isChecked: boolean}) => {
    const { t } = useTranslation();
    GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID });
    const navigation = useNavigation<RootStackNavigationProp>();
    const [loading, setLoading] = useState<boolean>(false);
    const handleSignIn = async () => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            if (userInfo) {
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', userInfo.user.email);

                if (existingUser && existingUser.length > 0  && existingUser[0].guest === false) {
                    alert("It looks like you already have an account. Please sign in instead.");
                    navigation.navigate('signin');
                    setLoading(false);
                    return;
                } else {
                    const { data: { session }, error: AuthUserError } = await supabase.auth.signInWithIdToken({
                        provider: 'google',
                        token: userInfo.idToken!,
                    });

                    if (session) {
                        navigation.navigate('userdetailsscreen');
                    }
                    if (AuthUserError) console.error(AuthUserError.message);
                }
            } else {
                throw new Error('no ID token present!')
            }

        } catch (error: any) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        console.log('User cancelled the Google sign-in process.');
                        Alert.alert('You cancelled the sign-in process. Please try again.');
                        break;
                    case statusCodes.IN_PROGRESS:
                        console.log('Google sign-in already in progress.');
                        Alert.alert('Sign-in is already in progress. Please wait.');
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        console.log('Google Play Services are not available or outdated.');
                        Alert.alert('Google Play Services are not available. Please update or try again later.');
                        break;
                    default:
                        console.error('Unknown error during Google sign-in:', error.message);
                        Alert.alert('An unknown error occurred. Please try again later.');
                }
            } else {
                // Non-Google related errors (like network issues)
                console.error('Non-Google Sign-in Error:', error.message);
                Alert.alert('An unexpected error occurred. Please check your connection and try again.');
            }
        }
        setLoading(false);
    };

    return (
        <View className=' flex w-5/6 items-center self-center mt-2' >

            <TouchableOpacity className={`w-full bg-white px-5 py-4 rounded-full flex flex-row 
                                items-center ${!isChecked && 'opacity-50'}`}
                style={styles.shadow}
                onPress={handleSignIn}
                disabled={loading || !isChecked}
            >
                <AntDesign name="google" size={24} color="red" />
                <Text className=' font-semibold text-lg ml-12'>
                    {t('google_sign_up_button')}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default GoogleSignUp
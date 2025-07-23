import * as AppleAuthentication from 'expo-apple-authentication';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';


const AppleSignUp = (
    {isChecked}: {isChecked: boolean}
) => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<RootStackNavigationProp>();
    const handleSignIn = async () => {
        setLoading(true);
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            if (credential.identityToken) {

                const { data: existingUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', credential.email);

                if ( existingUser && existingUser?.length > 0) {
                    alert("It looks like you already have an account. Please sign in instead.");
                    navigation.navigate('signin');
                    setLoading(false);
                    return;
                }

                const { error: AuthUserError, data: { session } } = await supabase.auth.signInWithIdToken({
                    provider: 'apple',
                    token: credential.identityToken,
                });

                if (AuthUserError) { throw AuthUserError.message };

                if (session) {
                    navigation.navigate('userdetailsscreen');
                }

            } else {
                throw new Error('No identityToken.');
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
        setLoading(false);
    };
    return (
        <View className='flex w-5/6 items-center self-center mt-2'>
            <TouchableOpacity
                onPress={handleSignIn}
                disabled={loading || !isChecked}
                className={`w-full bg-black px-5 py-4 rounded-full flex flex-row 
                           items-center ${!isChecked && 'opacity-50'}`}>
                <AntDesign name="apple1" size={24} color="white" />
                <Text className='text-white font-bold text-lg ml-12'>Continue with apple</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AppleSignUp;
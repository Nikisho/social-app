import { View, Text, Platform, TouchableOpacity, ToastAndroid, Alert, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import validateEmail from '../../../utils/functions/validateEmail';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { supabase } from '../../../../supabase';
import * as Linking from 'expo-linking';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import { handleUrl } from '../../../utils/functions/handleUrl';

const SendResetLinkScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [email, setEmail] = useState<string>('');
    const isEmailValid = validateEmail(email);

    const sendResetLink = async () => {
        if (!isEmailValid) {
            Platform.OS === 'android' ?
                ToastAndroid.show("Please enter a valid email address", ToastAndroid.SHORT)
                :
                Alert.alert("Please enter a valid email address")
            return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'com.linkzy://resetpassword', 
        });
        if (error) throw error.message;
        Platform.OS === 'android' ?
            ToastAndroid.show("We've send you a link to reset your password.", ToastAndroid.SHORT)
            :
            Alert.alert("We've send you a link to reset your password.")
    };
 
    useEffect(() => {
        const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url, navigation));
        Linking.getInitialURL().then((url) => {
            if (url) {handleUrl(url, navigation);}
        });
        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <View className='flex h-1/2 justify-center px-5'>
            <TouchableOpacity className="py-5 " onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-circle-outline" size={30} color="black" />
            </TouchableOpacity>
            <View className='w-full flex items-center space-y-5'>
                <FontAwesome name="lock" size={44} color="black" />
                <Text className='text-2xl font-semibold'>
                    Touble loggin in?
                </Text>
            </View>
            <View className='w-full flex flex-row justify-center my-5'>
                <Text className='text- '>
                    Enter your email address and we'll send you a link to
                    reset your password.
                </Text>
            </View>
            <TextInput
                placeholder='Enter email '
                className={`p-2 px-5 flex items-center border bg-gray-200 rounded-lg ${Platform.OS === 'ios' ? 'py-4' : 'py-2'} `}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TouchableOpacity
                onPress={sendResetLink}
                className='py-5 bg-black flex flex-row justify-center my-5 rounded-lg'>
                <Text className='text-white font-bold'>
                    Send link
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default SendResetLinkScreen



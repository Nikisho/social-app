import React, { useEffect, useState } from 'react';
import { View, TextInput, Alert, Text, Platform, TouchableOpacity } from 'react-native';
import { supabase } from '../../../../supabase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ResetPasswordScreenRouteProps, RootStackNavigationProp } from '../../../utils/types/types';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import validatePassword from '../../../utils/functions/validatePassword';

const ResetPasswordScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [newPassword, setNewPassword] = useState('');
    const route = useRoute<ResetPasswordScreenRouteProps>();
    const { access_token, refresh_token } = route.params;
    const isPasswordValid = validatePassword(newPassword);

    const setSession = async () => {

        if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
                access_token: access_token,
                refresh_token: refresh_token
            });
            if (error) {
                throw error.message
            }
            console.log('Authenticated')
        } else {
            console.log('This did not work')
        }
    };

    useEffect(() => {
        setSession();
    }, []);

    const handlePasswordReset = async () => {
        const { error } = await supabase
            .auth
            .updateUser(
                { password: newPassword },
            );
        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("Success", "Your password has been reset successfully!");
            navigation.navigate('signin');
        }
    };
    return (
        <View className='h-1/ px-2 flex justify-center'>
            <TouchableOpacity className="py-5 " onPress={() => navigation.navigate('signin')}>
                <Ionicons name="chevron-back-circle-outline" size={30} color="black" />
            </TouchableOpacity>
            <View className='w-full flex items-center my-5'>
                <FontAwesome5 name="key" size={44} color="black" />
            </View>
            <View className='w-full flex items-center space-y-5 mb-10'>
                <Text className='text-xl font-semibold'>
                    Reset your password
                </Text>
            </View>
            
            <TextInput
                placeholder="Enter your new password"
                value={newPassword}
                className={`p-2 px-5 flex items-center border bg-gray-200 rounded-lg ${Platform.OS === 'ios' ? 'py-4' : 'py-2'} `}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            {(!isPasswordValid && newPassword !== '') && (
                <Text className='text-red-500 w-ful mt-1'>
                    Password must be 6-16 characters long, contain at least one number and one special character.
                </Text>
            )}
            <TouchableOpacity
                onPress={handlePasswordReset}
                disabled={!isPasswordValid}
                className={`py-5 bg-blue-500 flex flex-row justify-center my-5 rounded-lg ${!isPasswordValid && 'opacity-40'}`}>
                <Text className='text-white font-bold'>
                    Confirm
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ResetPasswordScreen;

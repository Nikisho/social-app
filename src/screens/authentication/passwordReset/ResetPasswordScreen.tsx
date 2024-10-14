// ResetPasswordScreen.js

import React, { useState } from 'react';
import { View, TextInput, Alert, Text, Platform, TouchableOpacity } from 'react-native';
import { supabase } from '../../../../supabase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';

const ResetPasswordScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const route = useRoute();
    // const { token } = route.params; 
    const [newPassword, setNewPassword] = useState('');

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
            <View className='w-full flex flex items-center space-y-5 mb-10'>
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
            <TouchableOpacity
                onPress={handlePasswordReset}
                className='py-5 bg-blue-500 flex flex-row justify-center my-5 rounded-lg'>
                <Text className='text-white font-bold'>
                    Confirm
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ResetPasswordScreen;

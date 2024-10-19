import { View, Text, TouchableOpacity, Alert, Platform, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../../../utils/styles/shadow';
import { supabase } from '../../../../supabase';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../../context/navSlice';
import validateEmail from '../../../utils/functions/validateEmail';
import { EmailSignUpScreenRouteProp, RootStackNavigationProp } from '../../../utils/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import validatePassword from '../../../utils/functions/validatePassword';

const EmailSignUp = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation<RootStackNavigationProp>();
	const isPasswordMismatch = confirmPassword !== password;
	const isEmailEmpty = email === '';
	const isPasswordValid = validatePassword(password);

	const isDisabled = isPasswordMismatch || isEmailEmpty || !isPasswordValid || loading;

	async function signUpWithEmail() {
		setLoading(true);
		if (validateEmail(email) === false) {
			Alert.alert('Please enter a valid email address');
			setLoading(false);
			return;
		}
		//Check if user already has an account
		const { data: existingUser } = await supabase
			.from('users')
			.select('*')
			.eq('email', email);

		if (existingUser && existingUser.length > 0) {
			alert("It looks like you already have an account. Please sign in instead.");
			navigation.navigate('signin');
			setLoading(false);
		} else {
			const {
				data: { session },
				error: AuthUserError,
			} = await supabase.auth.signUp({
				email: email,
				password: password,
			})
			if ( AuthUserError) {
				setLoading(false);
				if (AuthUserError.code === 'user_already_exists') {
					Alert.alert("Please sign in to finish setting up your profile");
					navigation.navigate('signin');
				}
			}
			if (session) {
				await AsyncStorage.setItem('userAccessToken', session.access_token);
				await AsyncStorage.setItem('userRefreshToken', session.refresh_token);

				navigation.navigate('userdetailsscreen');
				if (!session) Alert.alert('Sorry, we could not sign you up');
				setLoading(false);
			}

		}
	}

	return (
		<View className='flex flex-col w-full h-auto items-center justify-end space-y-3 '>
			<View className=' h-1/4 w-5/6 space-y-3'>
				<Text className='text-2xl font-bold'>
					Let's get started!
				</Text>
				<Text>
					Please enter your email and create a secure password to get started
				</Text>
			</View>

			<View className='w-5/6 space-y-1'>
				<Text className='ml-2 text-lg font-bold'>
					Email
				</Text>
				<TextInput
					placeholder='Enter email '
					className={`p-2 px-5 flex items-center rounded-full border bg-gray-200 ${Platform.OS === 'ios' ? 'py-4' : 'py-2'}`}
					value={email}
					onChangeText={(value) => { setEmail(value) }}
				/>
			</View>
			<View className='w-5/6 space-y-1'>
				<Text className='ml-2 text-lg font-bold'>
					Password
				</Text>
				<TextInput
					placeholder='Enter password '
					value={password}
					secureTextEntry={true}
					className={`p-2 px-5 flex items-center border  rounded-full bg-gray-200 ${Platform.OS === 'ios' ? 'py-4' : 'py-2'}`}
					onChangeText={(value) => { setPassword(value) }}
				/>
			</View>
			<View className='w-5/6 space-y-1'>
				<Text className='ml-2 text-lg font-bold'>
					Confirm password
				</Text>
				<TextInput
					placeholder='Confirm password '
					value={confirmPassword}
					secureTextEntry={true}
					className={`p-2 px-5 flex items-center border  rounded-full bg-gray-200 ${Platform.OS === 'ios' ? 'py-4' : 'py-2'}`}
					onChangeText={(value) => { setConfirmPassword(value) }}
				/>

			</View>
			{(!isPasswordValid && password !== '') && (
				<Text className='text-red-500 w-5/6 text-center'>
					Password must be 6-16 characters long, contain at least one number and one special character.
				</Text>
			)}

			<View className='w-full flex items-center h-1/4 justify-center'>

				<TouchableOpacity
					onPress={signUpWithEmail}
					style={styles.shadowButtonStyle}
					disabled={isDisabled}
					className={`w-5/6 space-y-1 p-2 px-5 flex items-center rounded-full ${isDisabled && 'opacity-60'}`}>
					<Text className='ml-2 text-lg font-semibold text-white'>
						Create an account
					</Text>
				</TouchableOpacity>
			</View>

		</View>
	)
}

export default EmailSignUp
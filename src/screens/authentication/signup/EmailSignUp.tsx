import { View, Text, TouchableOpacity, Alert, ToastAndroid, Platform } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native';
import styles from '../../../utils/styles/shadow';
import { supabase } from '../../../../supabase';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../../context/navSlice';
import validateEmail from '../../../utils/functions/validateEmail';
import { EmailSignUpScreenRouteProp } from '../../../utils/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import validatePassword from '../../../utils/functions/validatePassword';

const EmailSignUp = () => {
	const route = useRoute<EmailSignUpScreenRouteProp>();
	const { age, name } = route.params;
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
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
		//Sign up the user to supabase
		const {
			data: { session },
			error: AuthUserError,
		} = await supabase.auth.signUp({
			email: email,
			password: password,
		})

		//If the sign up is successful, insert a row to public.users
		if (session) {
			await AsyncStorage.setItem('userAccessToken', session.access_token);
			await AsyncStorage.setItem('userRefreshToken', session.refresh_token);
			const { error, data } = await supabase
				.from('users')
				.insert({
					name: name,
					email: email,
					uid: session?.user?.id,
					age: age,
					auth_provider: 'email'
				})
				.select('id')
			if (error) { console.error(error.message); }
			if (error?.code === '23505') {
				Platform.OS === 'android' ?
					ToastAndroid.show('You already have an account, just sign in!', ToastAndroid.SHORT)
					:
					Alert.alert('You already have an account, just sign in!')
				return;
			}

			//Once the new user has been added to public.users, add user properties to the context
			if (data) {
				dispatch(setCurrentUser({
					name: name,
					email: email,
					// photo: userInfo.user.photo,
					id: data[0].id
				}))
			}
		}


		if (AuthUserError) Alert.alert(AuthUserError.message);
		if (!session) Alert.alert('Sorry, we could not sign you up');
		setLoading(false);
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
			{(!isPasswordValid && password !== '')&&  (
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
import { View, Text, TouchableOpacity, Alert, ToastAndroid, Platform, TextInput } from 'react-native'
import React, { useState } from 'react'
import styles from '../../../utils/styles/shadow';
import { supabase } from '../../../../supabase';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../../context/navSlice';
import validateEmail from '../../../utils/functions/validateEmail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import platformAlert from '../../../utils/functions/platformAlert';

const EmailSignIn = () => {

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const isEmailEmpty = email === '';
	const isPasswordEmpty = password === '';
	const navigation = useNavigation<RootStackNavigationProp>();
	const isDisabled = isEmailEmpty || isPasswordEmpty || loading;

	async function signInWithEmail() {
		setLoading(true);

		if (validateEmail(email) === false) {
			Alert.alert('Please enter a valid email address');
			setLoading(false);
			return;
		}
		//Sign up the user to supabase
		const { data: { session }, error: AuthUserError } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		})

		//If the sign up is successful, insert a row to public.users
		if (session) {
			await AsyncStorage.setItem('userAccessToken', session.access_token);
			await AsyncStorage.setItem('userRefreshToken', session.refresh_token);
			const { error, data } = await supabase
				.from('users')
				.select()
				.eq('uid', session.user.id)
			if (data?.length === 0) {
				platformAlert("Let's finalise your signup.")
				setLoading(false);
				navigation.navigate('userdetailsscreen');
				return;
			}
			//Fetch data once user is retrieved, and add to context
			if (data) {
				dispatch(setCurrentUser({
					name: data[0].name,
					email: email,
					photo: data[0].photo,
					id: data[0].id,
					sex: data[0].sex
				}))
			}
		}

		if (AuthUserError) Alert.alert(AuthUserError.message)
		if (!session) {

			Platform.OS === 'android' ?
				ToastAndroid.show('We could not authenticate you.', ToastAndroid.SHORT)
				:
				Alert.alert('We could not authenticate you')
		}
		setLoading(false)
	}

	return (
		<View className='flex flex-col w-full h-auto items-center justify-end space-y-3 '>
			<View className=' h-1/4 w-5/6 space-y-3'>
				<Text className='text-2xl font-bold'>
					Welcome back!
				</Text>
				<Text>
					Please enter your email and password.
				</Text>
			</View>

			<View className='w-5/6 space-y-1'>
				<Text className='ml-2 text-lg font-bold'>
					Email
				</Text>
				<TextInput
					placeholder='Enter email '
					className={`p-2 px-5 flex items-center rounded-full border bg-gray-200 ${Platform.OS === 'ios'? 'py-4' : 'py-2'} `}
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
					className={`p-2 px-5 flex items-center rounded-full border bg-gray-200 ${Platform.OS === 'ios'? 'py-4' : 'py-2'} `}
					onChangeText={(value) => { setPassword(value) }}
				/>

			</View>
			<View className='w-full flex items-center h-1/4 justify-center'>

				<TouchableOpacity
					onPress={signInWithEmail}
					style={styles.shadowButtonStyle}
					disabled={isDisabled}
					className={`w-5/6 space-y-1 p-2 px-5 flex items-center rounded-full ${isDisabled && 'opacity-60'}`}>
					<Text className='ml-2 text-lg font-semibold text-white'>
						Sign in
					</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity 
				onPress={() => navigation.navigate('sendresetlink')}
			>
				<Text>
					Forgotten your password?
				</Text>
			</TouchableOpacity>

		</View>
	)
}

export default EmailSignIn
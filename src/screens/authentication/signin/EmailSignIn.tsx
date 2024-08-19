import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native';
import colours from '../../../utils/styles/colours';
import styles from '../../../utils/styles/shadow';
import { supabase } from '../../../../supabase';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../../context/navSlice';

const EmailSignIn = () => {

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const isEmailEmpty = email === '';
	const isPasswordEmpty = password === '';

	const isDisabled = isEmailEmpty || isPasswordEmpty || loading;


	async function signUpWithEmail() {
		setLoading(true);

		//Sign up the user to supabase
        const { data:{session}, error: AuthUserError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          })

		//If the sign up is successful, insert a row to public.users
		if (session) {

            const { error, data} = await supabase
                .from('users')
                .select()
                .eq('uid', session.user.id)
            
			//Fetch data once user is retrieved, and add to context
			if (data) {
				dispatch(setCurrentUser({
					name: data[0].name,
					email: email,
					// photo: userInfo.user.photo,
					id: data[0].id
				}))
			}
		}


		if (AuthUserError) Alert.alert(AuthUserError.message)
		if (!session) Alert.alert('Please check your inbox for email verification!')
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
					className='p-2 px-5 flex items-center rounded-full border bg-gray-200 '
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
					className='p-2 px-5 flex items-center border  rounded-full bg-gray-200'
					onChangeText={(value) => { setPassword(value) }}
				/>

			</View>
			<View className='w-full flex items-center h-1/4 justify-center'>

				<TouchableOpacity
					onPress={signUpWithEmail}
					style={styles.shadowButtonStyle}
					disabled={isDisabled}
					className={`w-5/6 space-y-1 p-2 px-5 flex items-center rounded-full ${isDisabled && 'opacity-60'}`}>
					<Text className='ml-2 text-lg font-semibold text-white'>
						Sign in
					</Text>
				</TouchableOpacity>
			</View>

		</View>
	)
}

export default EmailSignIn
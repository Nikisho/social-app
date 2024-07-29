import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styles from '../../utils/styles/shadow'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin'
import { supabase } from '../../../supabase'
import { setCurrentUser } from '../../context/navSlice'
import { useDispatch } from 'react-redux'

const SignInScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const dispatch = useDispatch();
    const handleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            const { error, data } = await supabase
            .from('users')
            .select()
            .eq('email', userInfo.user.email)

            if (data) {
                dispatch(setCurrentUser({ 
                    name: data[0].name ,
                    email: data[0].email,
                    photo: data[0].photo,
                    id: data[0].id
                 }))
            }
            if ( error) console.error(error.message)
        } catch (error) {
                        if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        // user cancelled the login flow
                        break;
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // play services not available or outdated
                        break;
                    default:
                    // some other error happened
                }
            } else {
                // an error that's not related to google sign in occurred
            }

        }
    };

    return (
        <View className='flex items-center space-y-5 h-3/4 justify-center '>
            <Text className='p-2 text-3xl font-bold'>
                Sign in to Friendzy.
            </Text>

            <View className='w-full flex space-y-3'>

                <TouchableOpacity style={styles.shadow} className='p-3 self-center bg-amber-300  rounded-2xl  w-5/6 flex items-center'>
                    <Text className='text-lg font-bold'>
                        Use email and password
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignIn} style={styles.shadow} className='p-3 bg-gray-100 rounded-2xl w-5/6 flex self-center items-center'>
                    <Text className='text-lg font-bold'>
                        Continue with Google
                    </Text>
                </TouchableOpacity>
                <View className='flex flex-row space-x-2 self-center' >
                    <Text className=' font-semibold p-3'>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('signup')} className='bg-yellow-400 py-3 px-4 rounded-full'><Text className='font-semibold'>Sign up</Text></TouchableOpacity>
                </View>
            </View>

        </View>

    )
}

export default SignInScreen
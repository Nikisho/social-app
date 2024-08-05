import { View } from 'react-native'
import React from 'react'
import { GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin'
import { supabase } from '../../../../supabase'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../../../context/navSlice'

const GoogleSignIn = () => {
    const dispatch = useDispatch();
    const handleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const { error, data } = await supabase
                .from('users')
                .select()
                .eq('email', userInfo?.user.email)

            if (data) {

                ////If no data, its a new sign up, sign the user up instead///
                if (data.length === 0) {
                    const { error, data } = await supabase
                        .from('users')
                        .insert({
                            name: userInfo.user.name,
                            email: userInfo.user.email,
                            photo: userInfo.user.photo,
                            auth_provider: 'google'
                        })
                        .select('id');
                    if (error) console.error(error.message);
                    if (data) {
                        dispatch(setCurrentUser({
                            name: userInfo.user.name,
                            email: userInfo.user.email,
                            photo: userInfo.user.photo,
                            id: data[0].id
                        }))
                    }
                    return;
                }
                console.log(data)
                dispatch(setCurrentUser({
                    name: data[0].name,
                    email: data[0].email,
                    photo: data[0].photo,
                    id: data[0].id
                }))
            }
            if (error) console.error(error.message)
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

    }
    return (
        <View className=' flex w-5/6 items-center self-center mt-2' >
            <GoogleSigninButton
                className=''
                size={GoogleSigninButton?.Size.Wide}
                style={{ "width": "103%" }}
                color={GoogleSigninButton?.Color.Dark}
                onPress={handleSignIn}
            // disabled={isInProgress}
            />
        </View>
    )
}

export default GoogleSignIn
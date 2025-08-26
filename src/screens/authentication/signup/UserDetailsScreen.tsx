import { View, TouchableOpacity, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useMultistepForm } from '../../../hooks/useMultistepForm';
import UserDetailsForm from './UserDetailsForm';
import colours from '../../../utils/styles/colours';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../../supabase';
import { setCurrentUser } from '../../../context/navSlice';
import { useDispatch } from 'react-redux';
import UserPhotoForm from './UserPhotoForm';
import UserInterestsForm from './UserInterestsForm';
import { decode } from 'base64-arraybuffer';
import { ImagePickerAsset } from 'expo-image-picker';
import { User } from '@supabase/supabase-js';
import LoadingScreen from '../../loading/LoadingScreen';
import { usePushNotifications } from '../../../utils/functions/usePushNotifications';
import platformAlert from '../../../utils/functions/platformAlert';
import getAge from '../../../utils/functions/getAge';
import formatDate from '../../../utils/functions/formatDate';

interface UserDataProps {
    name: string;
    dateOfBirth: Date | null;
    photo: ImagePickerAsset | null;
    sex: number | null ,
    userInterests: {
        interestCode: number;
        interestGroupCode: number
    }[]
}
const UserDetailsScreen = () => {
    const dispatch = useDispatch();
    const { expoPushToken } = usePushNotifications();
    const [user, setUser] = useState<User | null>(null);
    const [ loading, setLoading] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<UserDataProps>({
        name: '',
        dateOfBirth: new Date(),
        photo: null,
        sex: null,
        userInterests: []
    });
    function updateFields(fields: Partial<UserDataProps>) {
        setUserDetails(prev => {
            return { ...prev, ...fields }
        })
    };
    const {
        steps,
        currentStepIndex,
        step,
        isFirstStep,
        isLastStep,
        next,
        back
    } = useMultistepForm(
        [
            <UserDetailsForm {...userDetails} updateFields={updateFields} />,
            <UserPhotoForm {...userDetails} updateFields={updateFields} />,
            <UserInterestsForm {...userDetails} updateFields={updateFields} />
        ]);

    const getSession = async () => {
        const { data: user, error } = await supabase.auth.getUser();
        if (user) {
            setUser(user.user);
        }
        if (error) {
            //The user could not be retrieved, throw error message
            throw error.message
        };
    };
    const createUserInterests = async (user_id: number) => {
        const userInterestsData = userDetails.userInterests.map((interest) => ({
            user_id: user_id,
            interest_code: interest.interestCode,
            interest_group_code: interest.interestGroupCode,
        }));
        const { error } = await supabase
            .from('user_interests')
            .insert(userInterestsData)
        if (error) { console.error(error.message) }
    };
    const updateProfilePictureInStorageBucket = async (file: string, user_id: number) => {
        if (userDetails.photo === null) return;
        const arrayBuffer = decode(file)
        try {
            const { error } = await supabase
                .storage
                .from('users')
                .upload(`${user_id}/profile_picture.jpg`, arrayBuffer, {
                    contentType: 'image/png',
                    upsert: true,
                });

            if (error) {
                console.error('Upload error:', error.message);
            }

            //If no error, update the user photo in the DB
            const photoUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/users/${user_id}/profile_picture.jpg?v=${new Date().getTime()}`
            const { error: updateUserPhoto } = await supabase
                .from('users')
                .update({
                    photo: photoUrl
                })
                .eq('id', user_id)
            if (updateUserPhoto) {
                Alert.alert(updateUserPhoto.message)
            }
        } catch (error) {
            console.error('Conversion or upload error:', error);
        }

    }
    const createProfile = async () => {
        const todaysDate = new Date();
        if (userDetails.dateOfBirth && formatDate(userDetails.dateOfBirth) !== formatDate(todaysDate)) {
            const userAge = getAge(userDetails.dateOfBirth);
            if (userAge < 18) {
                platformAlert('Sorry, you must be 18 or older to use Linkzy. Please check back when you meet this age requirement!');
                return;
            }
        }
        setLoading(!loading);
        const { data, error } = await supabase
            .from('users')
            .insert({
                name: userDetails.name,
                date_of_birth : formatDate(userDetails.dateOfBirth!) !== formatDate(todaysDate)? userDetails.dateOfBirth : null,
                email: user?.email,
                auth_provider: user?.app_metadata.provider,
                sex: userDetails.sex,
                uid: user?.id,
                expo_push_token: expoPushToken?.data
            })
            .select('id, is_organizer')
            .single();
        if (error) {setLoading(!loading); throw error.message; };
        if (data) {
            await updateProfilePictureInStorageBucket(userDetails.photo?.base64!, data.id);
            await createUserInterests(data.id);
            const photoUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/users/${data.id}/profile_picture.jpg?v=${new Date().getTime()}`
            dispatch(setCurrentUser({
                name: userDetails.name,
                age: userDetails.dateOfBirth ? `${getAge(userDetails.dateOfBirth)}` : null,
                photo: userDetails.photo ? photoUrl : null,
                sex: userDetails.sex,
                id: data.id,
				isOrganizer: data.is_organizer
            }))
        }
        setLoading(!loading);
    };

    useEffect(() => {
        getSession();
    }, []);

    if (loading) {
        return <LoadingScreen displayText='Setting things up for you'/>
    }
    return (
        <View className='flex items-center space-y-5 h-[90%] '>
            {step}
            <View className='w-2/3 flex flex-row justify-between '>
                {
                    !isFirstStep && (
                        <TouchableOpacity onPress={back}
                            style={{ backgroundColor: colours.secondaryColour }}
                            className='p-2 rounded-full self-start'
                        >
                            <AntDesign name="arrowleft" size={24} color="white" />
                        </TouchableOpacity>
                    )
                }
                {
                    <TouchableOpacity onPress={isLastStep ? createProfile : next}
                        style={{ backgroundColor: colours.secondaryColour }}
                        className={`p-2 rounded-full self-end ${userDetails.name === '' ? 'opacity-50' : ''}`}
                        disabled={userDetails.name === '' || userDetails.sex === null}
                    >
                        <AntDesign name="arrowright" size={24} color="white" />
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default UserDetailsScreen
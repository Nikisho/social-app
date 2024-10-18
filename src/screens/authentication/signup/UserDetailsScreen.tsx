import { View, TouchableOpacity } from 'react-native'
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

interface UserDataProps {
    name: string;
    age: string | null;
    photo: string | null;
    userInterests: {
        interestCode: number;
        interestGroupCode: number
    }[]
}
const UserDetailsScreen = () => {
    const dispatch = useDispatch();
    const [userUid, setUserUid] = useState<string>('');

    const [userDetails, setUserDetails] = useState<UserDataProps>({
        name: '',
        age: null,
        photo: null,
        userInterests: []
    });
    function updateFields(fields: Partial<UserDataProps>) {
        setUserDetails(prev => {
            return { ...prev, ...fields }
        })
    };
    console.log(userDetails)
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
            <UserInterestsForm {...userDetails} updateFields={updateFields}  />
        ]);

    const getSession = async () => {
        const { data: user, error } = await supabase.auth.getUser();
        if (user.user) {
            setUserUid(user.user.id);
        }
        if (error) {
            //The user could not be retrieved, throw error message
            throw error.message
        };
    };
    const createProfile = async () => {
        const { data, error } = await supabase
            .from('users')
            .insert({
                name: userDetails.name,
                age: userDetails.age ? userDetails.age : null,
                photo: userDetails.photo ? userDetails.photo : null,
                uid: userUid
            })
            .select('id')
            .single();
        if (error) throw error.message;
        if (data) {
            dispatch(setCurrentUser({
                name: userDetails.name,
                age: userDetails.age,
                photo: userDetails.photo,
                id: data.id
            }))
        }
    };

    useEffect(() => {
        getSession();
    }, []);
    return (
        <View className='flex items-center space-y-5 h-full '>
            {step}
            <View className='w-2/3 flex flex-row justify-between'>
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
                    !isLastStep && (
                        <TouchableOpacity onPress={next}
                            style={{ backgroundColor: colours.secondaryColour }}
                            className={`p-2 rounded-full self-end ${userDetails.name === '' ? 'opacity-50' : ''}`}
                            disabled={userDetails.name === ''}
                        >
                            <AntDesign name="arrowright" size={24} color="white" />
                        </TouchableOpacity>
                    )
                }
            </View>
        </View>
    )
}

export default UserDetailsScreen
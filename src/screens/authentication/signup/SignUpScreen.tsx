import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import styles from '../../../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useMultistepForm } from '../../../hooks/useMultistepForm';
import UserDetailsForm from './UserDetailsForm';
import SignUpMethodForm from './SignUpMethodForm';
import colours from '../../../utils/styles/colours';
import { RootStackNavigationProp } from '../../../utils/types/types';
import Checkbox from 'expo-checkbox';

interface UserDataProps {
    name: string;
    age: string | null;
}
const SignUpScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [isChecked, setChecked] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDataProps>({
        name: '',
        age: null
    });
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
            <SignUpMethodForm
                name={userDetails.name}
                age={userDetails.age}
            />
        ]);

    function updateFields(fields: Partial<UserDataProps>) {
        setUserDetails(prev => {
            return { ...prev, ...fields }
        })
    };
    return (
        <View className='flex items-center space-y-5 h-full '>
            {step}

            {
                !isFirstStep && (
                    <View className='w-2/3'>

                        <TouchableOpacity onPress={back}
                            style={{ backgroundColor: colours.secondaryColour }}

                            className='p-2 rounded-full self-start'
                        >
                            <AntDesign name="arrowleft" size={24} color="white" />

                        </TouchableOpacity>
                    </View>

                )
            }
            {
                !isLastStep && (
                    <View className='w-2/3'>

                        <TouchableOpacity onPress={next}
                            style={{ backgroundColor: colours.secondaryColour }}
                            className={`p-2 rounded-full self-end ${userDetails.name === '' || !isChecked ? 'opacity-50' : ''}`}
                            disabled={userDetails.name === '' || !isChecked}
                        >
                            <AntDesign name="arrowright" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                )
            }

            {
                isFirstStep && (

                    <View className='absolute bottom-32 flex flex-row left-20'>
                        <Checkbox
                            value={isChecked} onValueChange={setChecked}
                            className='mt-1'
                        />
                        <View>
                            <Text onPress={() => navigation.navigate('eula')} className='w-4/5 ml-2 text-blue-600 underline'>
                                I agree to Linkzy's End User License Agreement (EULA).
                            </Text>
                        </View>
                    </View>

                )
            }
            <View className='absolute bottom-16 flex-row space-x-2'>
                <Text className=' font-semibold p-3 '>Already have an acccount?</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('signin')}
                    style={styles.shadowButtonStyle}
                    className=' py-3 px-4 rounded-full'>
                    <Text className='font-bold text-white'>Sign in</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}



export default SignUpScreen;




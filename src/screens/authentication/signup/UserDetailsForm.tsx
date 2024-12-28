import { View, Text, Platform, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker';
import formatDate from '../../../utils/functions/formatDate';
import Foundation from '@expo/vector-icons/Foundation';
import styles from '../../../utils/styles/shadow';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface UserDataProps {
    name: string;
    dateOfBirth: Date | null;
    sex: number | null;
};

interface UserDetailsFormProps extends UserDataProps {
    updateFields: (fields: Partial<UserDataProps>) => void;
};

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
    name,
    dateOfBirth,
    sex,
    updateFields
}) => {


    function formatDateOfBirth(datePickerObject: Date) {
        const options:any = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(datePickerObject).toLocaleDateString('en-GB', options);
      }


    const [open, setOpen] = useState(false);
    return (
        <View className='flex flex-col w-full  items-center justify-end space-y-5 mt-14'>
            <View className='ml-2 w-5/6 mb-5 flex'>
                <Text className=' text-xl font-bold'>
                    Let’s personalize your experience!
                </Text>
                <Text className='py-1'>
                    Please tell user more about you to get started.
                </Text>
            </View>
            <View className='w-5/6 space-y-3'>

                <Text className='ml-2 text-lg font-bold'>
                    Name
                </Text>
                <TextInput
                    placeholder='Enter username '
                    className={` px-5 text-center flex items-center rounded-full border bg-gray-200 ${Platform.OS === 'ios' ? 'py-4' : 'py-2'}`}
                    value={name}
                    maxLength={15}
                    onChangeText={(value) => updateFields({ name: value.replace(/[^a-z0-9_]/gi, '') })}
                />

            </View>
            <View className='w-5/6 space-y-3'>
                <Text className='ml-2 text-lg font-bold'>
                    Date of birth <Text className='text-md font-normal'>(optional)</Text>
                </Text>
                <TouchableOpacity onPress={() => setOpen(true)}
                    className={` px-5 text-center flex items-center rounded-full border bg-gray-200 ${Platform.OS === 'ios' ? 'py-4' : 'py-3'}`}
                    >
                    <Text className='text-center  '>
                        {formatDateOfBirth(dateOfBirth!)}
                    </Text>
                </TouchableOpacity>
                <DatePicker
                    modal
                    open={open}
                    mode='date'
                    date={dateOfBirth!}
                    onConfirm={(date: Date) => {
                        setOpen(false)
                        updateFields({ dateOfBirth: date})
                    }}
                    buttonColor='black'
                    theme='light'
                    onCancel={() => {
                        setOpen(false)
                    }}
                />
            </View>
            <View className='w-5/6 space-y-3 '>

                <Text className='ml-2 text-lg font-bold'>
                    Sex <Text className='text-md font-normal'>(for event purposes)</Text>
                </Text>
                <View className='flex flex-row w-5/6 self-center justify-between items-center'>
                    <View className='flex items-center space-y-2'>
                        <TouchableOpacity 
                            onPress={() => updateFields({ sex: 1})}
                            className={`${sex === 1? 'bg-blue-200' : 'bg-white'} flex items-center p-5 px-7 rounded-xl`} style={styles.shadow} >
                        <Foundation name="male-symbol" size={34} color="black" />
                        </TouchableOpacity>
                        <Text className='text-lg font-bold'>Male</Text>
                    </View>
                    <View className='flex items-center space-y-2'>
                    <TouchableOpacity className={`${sex === 2? 'bg-red-200' : 'bg-white'} flex items-center p-5 px-7 rounded-xl`} style={styles.shadow} 
                            onPress={() => updateFields({ sex: 2})}
                        >
                        <Foundation name="female-symbol" size={34} color="black" />
                        </TouchableOpacity>
                        <Text className='text-lg font-bold'>Female</Text>
                    </View>
                    <View className='flex items-center space-y-2'>
                        <TouchableOpacity className={`${sex === 0? 'bg-green-200' : 'bg-white'} flex items-center p-5 px-7 rounded-xl`} style={styles.shadow} 
                            onPress={() => updateFields({ sex: 0})}
                        >
                        <FontAwesome name="genderless" size={32} color="black" />
                        </TouchableOpacity>
                        <Text className='text-lg font-bold'>Skip</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default UserDetailsForm
import { View, Text, Platform, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker';
import formatDate from '../../../utils/functions/formatDate';

interface UserDataProps {
    name: string;
    dateOfBirth: Date | null;
};

interface UserDetailsFormProps extends UserDataProps {
    updateFields: (fields: Partial<UserDataProps>) => void;
};

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
    name,
    dateOfBirth,
    updateFields
}) => {


    function formatDateOfBirth(datePickerObject: Date) {
        const options:any = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(datePickerObject).toLocaleDateString('en-GB', options);
      }


    const [open, setOpen] = useState(false);
    return (
        <View className='flex flex-col w-full h-1/2 items-center justify-end space-y-3 '>
            <View className='ml-2 w-5/6 mb-5 flex'>
                <Text className=' text-xl font-bold'>
                    Let’s personalize your experience!
                </Text>
                <Text className='py-1'>
                    Please enter your name to get started.
                </Text>
            </View>
            <View className='w-5/6 space-y-1 '>

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
            <View className='w-5/6 space-y-1'>
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
                        // handleChange('date', date)
                        updateFields({ dateOfBirth: date})
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />

            </View>
        </View>
    )
}

export default UserDetailsForm
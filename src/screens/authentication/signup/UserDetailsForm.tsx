import { View, Text, Platform } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'

interface UserDataProps {
    name: string;
    age: string | null;
};

interface UserDetailsFormProps extends UserDataProps {
    updateFields: (fields: Partial<UserDataProps>) => void;
};

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
    name,
    age,
    updateFields
}) => {
    return (
        <View className='flex flex-col w-full h-1/2 items-center justify-end space-y-3 '>
            <View className=' h-1/3 space-y-3'>
                <Text className='text-2xl font-bold'>
                    Welcome to Linkzy!
                </Text>
                <Text>
                Please tell us your name to get started.
                </Text>
            </View>

            <View className='w-5/6 space-y-1'>
                <Text className='ml-2 text-lg font-bold'>
                    Name
                </Text>
                <TextInput
                    placeholder='Enter username '
                    className={` px-5 flex items-center rounded-full border bg-gray-200 ${Platform.OS === 'ios'? 'py-4' : 'py-2'}`}
                    value={name}
                    maxLength={15}
                    onChangeText={(value) => updateFields({ name: value.replace(/[^a-z0-9]/gi, '') })}
                />

            </View>
            <View className='w-5/6 space-y-1'>
                <Text className='ml-2 text-lg font-bold'>
                    Age <Text className='text-md font-normal'>(optional)</Text>
                </Text>
                <TextInput
                    keyboardType='numeric'
                    placeholder='Enter age '
                    value={age!}
                    maxLength={2}
                    className={`px-5 flex items-center border w-1/3 rounded-full bg-gray-200 ${Platform.OS === 'ios' ? 'py-4' : 'py-2'}`}
                    onChangeText={(value) => updateFields({ age: value.replace(/[^0-9]/g, '') })}
                />

            </View>
        </View>
    )
}

export default UserDetailsForm
import { View, Text } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'

const SubmitScreen = () => {
    return (
        <View className='p-2 flex space-y-4'>
            <TextInput className='text-2xl' placeholder='Title'>

            </TextInput>
            <TextInput className='text-lg' placeholder='Post'>

            </TextInput>
        </View>
    )
}

export default SubmitScreen
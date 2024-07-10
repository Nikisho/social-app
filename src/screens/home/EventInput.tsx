import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome6 } from '@expo/vector-icons'; const EventInput = () => {
    return (
        <View className='h- flex justify-end items-end bg-yellow-300 p-2'>
            <TouchableOpacity className='rounded-lg shadow-lg border p-1 px-2 '>
                <FontAwesome6 name="add" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}

export default EventInput
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import SecondaryHeader from '../../../components/SecondaryHeader'
import Ionicons from '@expo/vector-icons/Ionicons';
import { TextInput } from 'react-native-gesture-handler';

const FeaturedEventsSubmitScreen = () => {
    return (
        <ScrollView className='px-3'>
            <SecondaryHeader
                displayText='Create an event'
            />

            <TouchableOpacity className=' b py-[-10] items-center'>
                <Ionicons name="image" size={240} color="gray" />
            </TouchableOpacity>



            <View>
                <Text className='text-xl font-bold m-2'>
                    Title
                </Text>

                <TextInput 
                    className='border rounded-xl h-16 px-5'
                />
            </View>

            <View>
                <Text className='text-xl font-bold m-2'>
                    Description
                </Text>

                <TextInput 
                    multiline={true}
                    className='border rounded-xl h-32 p-5 '
                />
            </View>
        </ScrollView>
    )
}

export default FeaturedEventsSubmitScreen
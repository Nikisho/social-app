import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';

type InterestsProps = {
  interests?: {
    interest_code: number;
    interest_group_code: number;
    interests: {
      description: string;
    };
  }[];
};

const EventInterests:React.FC<InterestsProps> = ({
    interests
}) => {
    console.log(interests)
    const navigation = useNavigation<RootStackNavigationProp>();
    return (
        <View className='py-3'>
            <View className='flex flex-row items-center space-x-3 mb-4 '>
                <Text className='text-lg font-semibold'> Topics & Interests</Text>
            </View>
            <View
                // horizontal
                className='flex-row flex-wrap'
            >
                {
                    interests?.map((interest) => (
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('featuredEvents',{
                                interest: interest
                            })}
                            style={styles.interestButton} className='w-1/' key={interest.interest_code}>
                            <Text>{interest.interests.description}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    )
}

export default EventInterests

const styles = StyleSheet.create({
    interestButton: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        margin: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});
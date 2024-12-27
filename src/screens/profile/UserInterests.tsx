import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';

interface UserInterestsProps {
    user_id: number;
    isCurrentUserProfile: boolean
    userInterests: {
        interest_code: number;
        interest_group_code: number;
        interests: {
            description: string;
        }
    }[]
}

const UserInterests: React.FC<UserInterestsProps> = ({
    isCurrentUserProfile,
    userInterests
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    return (
        <View>
            <View className='flex flex-row items-center space-x-3'>
                <Text className='text-lg font-semibold my-1'>Interests</Text>
                {
                    isCurrentUserProfile && (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('updateinterests', {
                                user_interests: userInterests!
                            })}
                            className=' flex flex-row '>
                            <FontAwesome name="edit" size={20} color="black" />
                        </TouchableOpacity>
                    )
                }
            </View>
            {
                userInterests?.length === 0 ?
                    <View>
                        <Text className='italic py-3'>
                            No interests added yet
                        </Text>
                    </View>
                    :
                    <ScrollView
                        horizontal
                        className=''
                    >
                        {
                            userInterests?.map((interest) => (
                                <View style={styles.interestButton} key={interest.interest_code}>
                                    <Text>{interest.interests.description}</Text>
                                </View>
                            ))
                        }
                    </ScrollView>
            }

        </View>
    )
}

export default UserInterests

const styles = StyleSheet.create({
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    interestButton: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        margin: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});
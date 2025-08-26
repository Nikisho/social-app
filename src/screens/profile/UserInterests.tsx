import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    return (
        <View className='py-3'>
            <View className='flex flex-row items-center space-x-3 mb-4 '>
                <Text className='text-lg font-semibold'> {t('profile_screen.interests')} </Text>
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
                    isCurrentUserProfile ?
                        <View>
                            <Text className='italic text-lg py-3'>
                                {/* {t('profile_screen.no_interests')} */}
                                Select your interests to get the best experience!
                            </Text>
                        </View>
                        :
                        <View>
                            <Text className='italic text-lg py-3 text-center'>
                                {t('profile_screen.no_interests')}
                            </Text>
                        </View>
                    :
                    <View
                        // horizontal
                        className='flex-row flex-wrap'
                    >
                        {
                            userInterests?.map((interest) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('featuredEvents', {
                                            interest: interest
                                        })
                                    }}
                                    style={styles.interestButton} className='w-1/' key={interest.interest_code}>
                                    <Text>{interest.interests.description}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
            }

        </View>
    )
}

export default UserInterests

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
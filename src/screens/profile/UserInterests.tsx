import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';

interface UserInterestsProps {
    user_id: number;
    isCurrentUserProfile: boolean
}
interface Interests {
    interest_code: number;
    interest_group_code: number;
    interests: {
        description: string;
    }
}
const UserInterests:React.FC<UserInterestsProps> = ({user_id, isCurrentUserProfile}) => {
    const [userInterests, setUserInterests] = useState<Interests[]>();
    const navigation = useNavigation<RootStackNavigationProp>();
    
    const fetchInterests = async () => {
        const { error, data } = await supabase
            .from('user_interests')
            .select(`*,
                interests (
                    interest_code,
                    description
                )
                `)
            .eq('user_id', user_id)
        if (data) {
            setUserInterests(data)
            console.log(data)
        }
        if (error) console.error( error.message);
    };

    useEffect(() => {
        fetchInterests();
    },[]);

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
            <View 
                style={styles.interestsContainer}
                >
            {
                userInterests?.map((interest) => (
                    <View style={styles.interestButton}>
                        <Text>{interest.interests.description}</Text>
                    </View>
                    ))
                }
                </View>
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
import { View, Text, Image, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../../utils/styles/shadow'
import { supabase } from '../../../supabase'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

interface UserBadgesProps {
    user_id: number
}

interface BadgeDataProps {
    milestone_id: number;
    milestones: {
        badge_image_url: string;
        badge_reward: string;
        name: string
    }
};

const UserBadges: React.FC<UserBadgesProps> = ({
    user_id
}) => {
    const [badgeData, setBadgeData] = useState<BadgeDataProps[]>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const fetchBadges = async () => {
        const { data, error } = await supabase
            .from('user_milestones')
            .select(
                `*,
                    milestones(
                        badge_image_url,
                        badge_reward,
                        name
                    )
                `)
            .eq('user_id', user_id);
        if (data) {
            setBadgeData(data)
        }
        if (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        fetchBadges();
    }, [user_id]);

    return (
        <>
            <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={styles.shadow}
                className='p-2 my-3 bg-white rounded-xl w-1/3 flex-row 
                 items-center space-x-2'>
                {
                    badgeData && badgeData.length !== 0 ? 
                    (
                        <>
                            <Image
                                className='w-7 h-7 rounded-full'
                                source={{
                                    uri: badgeData[0]?.milestones.badge_image_url
                                }}
                            />
                            <Text className=''>
                                {badgeData?.length === 1 ? `${badgeData.length} badge` : `${badgeData.length} badges`  } 
                            </Text>
                        </>
                    ) :
                    (
                        <>
                            <SimpleLineIcons name="badge" size={24} color="black" />
                            <Text>
                                No badge
                            </Text>
                        </>
                    )
                }
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    className='flex-1 justify-center items-center mt-22' >
                    <TouchableWithoutFeedback>
                        <View
                            style={styles.shadow}
                            className='bg-gray-100 opacity-90 
                            rounded-xl m-20 h-1/2 
                            w-5/6 p-5 
                            flex-wrap flex-row
                            '
                        >

                            {
                                badgeData?.map((badge) => (
                                    <View key={badge.milestone_id} className=' flex items-center w-1/3 p-2'>
                                        <Image
                                            className='h-16 w-16 rounded-full'
                                            source={{
                                                uri: badge
                                                    .milestones
                                                    .badge_image_url
                                            }}
                                        />
                                        <Text className='text-center'>
                                            {badge
                                                .milestones
                                                .badge_reward}
                                        </Text>
                                    </View>
                                ))
                            }
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </>

    )
}

export default UserBadges
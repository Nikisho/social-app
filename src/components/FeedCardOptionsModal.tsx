import { View, Text, Modal, Alert , TouchableOpacity} from 'react-native'
import React from 'react'
import styles from '../utils/styles/shadow'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import { supabase } from '../../supabase';

interface FeedCardOptionsModalProps {
    modalVisible: boolean;
    setModalVisible: (modalVisible: boolean) => void;
    event_id: number;
    user_id: number;
    currentUser: {
        id: number
    };
    refreshOnBlock: () => void;
}

const FeedCardOptionsModal: React.FC<FeedCardOptionsModalProps> = ({
    modalVisible,
    setModalVisible,
    event_id,
    user_id,
    currentUser,
    refreshOnBlock
}) => {
    

    const deleteEvent = async () => {
        const {error} = await supabase
            .from('meetup_events')
            .delete()
            .eq('event_id', event_id);
        if (error) console.error(error.message);

        refreshOnBlock();
        Alert.alert('Your event has been deleted')
    }

    const reportEvent = async () => {

        const { error } = await supabase
            .from('reported_posts')
            .insert({
                event_id: event_id,
                poster_id: user_id,
                reporter_id: currentUser.id
            });

        setModalVisible(!modalVisible);
        refreshOnBlock();
        Alert.alert('This post has been reported, you will not it anymore');
        if (error) console.error(error.message);

    }

    const blockUser = async () => {
        const { error } = await supabase
            .from('user_blocked_users')
            .insert({
                user_id: currentUser.id,
                blocked_user_id: user_id
            })
        if (error) console.error(error.message);
        setModalVisible(!modalVisible);
        refreshOnBlock();
        Alert.alert('You will not receive any content or messages from this user')
    };

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View className='flex-1 justify-center items-center mt-22 h-full' >
                    <View className='bg-white rounded-xl m-20 h-auto w-4/5 p-2 space-y-5 items-center' style={styles.shadow}>
                        <View className='flex w-full space-y-2' >
                            {
                                currentUser.id === user_id ? (
                                    <TouchableOpacity 
                                        onPress={deleteEvent}
                                        className=' flex flex-row space-x-5 items-center rounded-xl w-full bg-gray-100 p-1 '>
                                        <FontAwesome name="trash" size={24} color="black" />
                                        <Text className='text-lg'>Delete</Text>
                                    </TouchableOpacity>
                                ) :
                                    <>
                                        <TouchableOpacity 
                                            onPress={reportEvent}
                                            className=' flex flex-row space-x-5 items-center rounded-xl w-full bg-gray-100 p-1 '>
                                            <FontAwesome name="flag" size={24} color="black" />
                                            <Text className='text-lg'>Report</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={blockUser}
                                            className=' flex flex-row space-x-5 items-center rounded-xl w-full bg-gray-100 p-1'>
                                            <Entypo name="block" size={24} color="black" />
                                            <Text className='text-lg'>Block user</Text>
                                        </TouchableOpacity>
                                    </>
                            }
                        </View>
                        <TouchableOpacity
                            className='rounded-xl p-2 bg-red-500'
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text className='text-white text-center font-bold'>Close</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        </View>
    )
}

export default FeedCardOptionsModal
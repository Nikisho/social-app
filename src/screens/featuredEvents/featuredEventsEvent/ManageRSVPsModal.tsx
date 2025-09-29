import { View, Text, Platform, TouchableOpacity, Modal, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../../../utils/styles/shadow'
import { supabase } from '../../../../supabase';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import colours from '../../../utils/styles/colours';
import { getColorFromName } from '../../../utils/functions/getColorFromName';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';

interface RsvpProps {
    id: number;
    users: { name: string, photo: string, id: number };
    user_id: number
};

const ManageRSVPsModal = ({
    featured_event_id
}: { featured_event_id: number }) => {

    const [rsvps, setRsvps] = useState<RsvpProps[]>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const navigation = useNavigation<RootStackNavigationProp>()
    const currentUser = useSelector(selectCurrentUser);

    const handleNavigateProfile = (user_id: number) => {
        navigation.navigate('profile', { user_id: user_id })
        setModalVisible(false);
    };

    const handleNavigateChat = (user_id: number) => {
        navigation.navigate('chat', { user_id: user_id })
        setModalVisible(false);
    };
    const fetchData = async () => {
        try {
            if (!featured_event_id) return
            const { data, error } = await supabase
                .from('tickets')
                .select(`*, users(*)`)
                .eq('featured_event_id', featured_event_id)
            if (data) {
                setRsvps(data)
            }
            if (error) console.error(error.message);
        } catch (error) {
            console.error(error)
        }

    }

    useEffect(() => {
        fetchData()
    }, [featured_event_id]);


    const RenderItem = ({ item }: { item: RsvpProps }) => {
        return (
            <TouchableOpacity
                onPress={() => handleNavigateProfile(item.user_id)}
                // style={styles.shadow}
                className='p-3 px-5 flex-row justify-between '>

                <View className='flex flex-row space-x-3 items-center'>
                    {item.users.photo ?
                        <Image
                            source={{
                                uri: item.users.photo
                            }}
                            className='h-14 w-14 rounded-full '
                        />
                        :
                        <View
                            style={{
                                backgroundColor: getColorFromName(item.users.name),
                                width: 55,
                                height: 55,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 5,
                                borderWidth: 1
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
                                {item.users.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    }
                    <View className=''>
                        <Text
                            numberOfLines={1}
                            style={{ width: 100 }}
                            className='text-lg text-'>
                            {item.users.name}
                        </Text>
                        {/* {
                            item.user_id === organizerIdUserId && (
                                <View className="bg-green-100 rounded-full  flex-row items-center border-green-800 border justify-center">
                                    <Text className="text-green-800 font-semibold text-xs text-center"> Organiser</Text>
                                </View>
                            )
                        } */}
                    </View>

                </View>

                {
                    currentUser.id !== item.user_id &&
                    <TouchableOpacity
                        onPress={() => handleNavigateChat(item.user_id)}
                        className='self-end p-2 px-3 bg-gray-300 rounded-full'>
                        <Text>
                            Message
                        </Text>
                    </TouchableOpacity>
                }
            </TouchableOpacity >)
    }

    return (
        <>
            <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={Platform.OS === 'ios' ? styles.shadow : { borderWidth: 1 }}
                className="bg-white mt-4 rounded-2xl p-4 flex-row items-center justify-between">
                <View>
                    <Text className="text-black/70 text-base font-semibold">See who's joining</Text>
                    <Text className="text-black text-lg font-bold">
                        RSVPs
                    </Text>
                </View>
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
                    className='flex-1 mt-20 ' >
                    <TouchableWithoutFeedback>
                        <View className='bg-white my-20 mx-5 h-3/4' style={styles.shadow} >
                            {rsvps?.length !== 0 ? (
                                <FlatList
                                    data={rsvps}
                                    renderItem={RenderItem}
                                    keyExtractor={(item) => item.users.id.toString()}
                                />
                            ) : (
                                <View style={{ alignItems: "center", padding: 20 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500", color: "#666" }}>
                                        No RSVPs yet
                                    </Text>
                                    <Text style={{ fontSize: 14, color: "#999", marginTop: 4 }}>
                                        Attendees will appear here once they RSVP.
                                    </Text>
                                </View>
                            )}


                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </>
    )
}

export default ManageRSVPsModal
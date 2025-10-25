import { View, Text, Platform, TouchableOpacity, Modal, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../../../../utils/styles/shadow'
import { supabase } from '../../../../../supabase';
import { FlatList } from 'react-native-gesture-handler';
import colours from '../../../../utils/styles/colours';
import { getColorFromName } from '../../../../utils/functions/getColorFromName';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../../utils/types/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../../context/navSlice';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

interface RsvpProps {
    id: number;
    users: { name: string, photo: string, id: number, email: string };
    user_id: number
    ticket_id: number;
    ticket_types: {
        name: string;
        is_free: boolean;
    }
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
                .select(`*, users(*), ticket_types(*)`)
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

        const handleInitiateRefund = async (ticket_id: number) => {
            console.log('refunding for', ticket_id)
        };

        return (
            <View className='p-3 px-5  bg-gray-100 m-2'>

                <TouchableOpacity
                    onPress={() => handleNavigateProfile(item.user_id)}
                    // style={styles.shadow}
                    className='flex-row justify-between '>

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
                </TouchableOpacity >
                <View className='flex py-3 flex-row items-center space-x-3'>
                    <MaterialIcons name="email" size={20} color="black" />

                    <Text selectable={true}>
                        {item.users.email}
                    </Text>
                </View>
                <View className='flex flex-row items-center space-x-3'>
                    <Entypo name="ticket" size={20} color="black" />

                    <Text>
                        {item.ticket_types?.name}
                    </Text>
                </View>
                {
                    !item.ticket_types?.is_free && (
                        <TouchableOpacity
                            onPress={() => handleInitiateRefund(item.ticket_id)}
                            className="mt-4 bg-red-50 border border-red-200 rounded-xl py-3 active:bg-red-100"
                        >
                            <Text className="text-center text-red-600 font-semibold text-base">
                                Initiate Refund
                            </Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        )
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
                <View
                    className='flex-1 mt-20 ' >
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

                        <TouchableOpacity
                            onPress={() => setModalVisible(!modalVisible)}
                            className="m-5 bg-black rounded-xl p-3 active:opacity-80"
                        >
                            <Text className="text-center text-white font-semibold text-base">
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        </>
    )
}

export default ManageRSVPsModal
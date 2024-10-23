import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../utils/styles/shadow';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../supabase';

interface HubProps {
    hub_name: string;
    hub_code: number;
}
interface ChooseEventLocationModalProps {
    modalVisible: boolean
    setModalVisible: (modalVisible: boolean) => void;
    selectedHub: HubProps | null;
    setSelectedHub: (selectedHub: HubProps) => void;
}


const ChooseEventLocationModal: React.FC<ChooseEventLocationModalProps> = ({
    modalVisible,
    selectedHub,
    setSelectedHub,
    setModalVisible
}) => {

    const [hubs, setHubs] = useState<HubProps[] | null>(null);
    const fetchHubs = async () => {
        const { error, data } = await supabase
            .from('hubs')
            .select('hub_name, hub_code')
        if (data) {
            setHubs(data)
        }
        if (error) (
            console.error(error.message)
        )
    };

    useEffect(() => {
        fetchHubs();
    }, []);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View className='flex-1 justify-end items-center shadow-xl' >
                <View className='bg-white rounded-xl m-20 h-1/2 w-full p-1 space-y-3'
                    style={styles.shadow}
                >
                    <View
                        className='w-full p-1 flex flex-row items-center '
                    >
                        <TouchableOpacity
                            onPress={() => setModalVisible(!modalVisible)}
                        >

                            <AntDesign name="close" size={25} color="black" />
                        </TouchableOpacity>
                        <Text className='place-self-center ml-28'>Select a hub</Text>
                    </View>
                    <ScrollView className=''>
                        {
                            hubs?.map((hub) => (
                                <TouchableOpacity
                                    onPress={() => setSelectedHub({hub_code: hub.hub_code, hub_name: hub.hub_name})}
                                    className={`w-full flex flex-row justify-center p-1 my-1 rounded-xl ${selectedHub?.hub_name === hub.hub_name ? 'bg-blue-400' : 'bg-gray-200'}`}
                                    key={hub.hub_code}>
                                    <Text className='text-xl'>
                                        {hub.hub_name}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

export default ChooseEventLocationModal
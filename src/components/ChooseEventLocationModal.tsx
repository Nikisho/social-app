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
    setSelectedHub: (selectedHub: HubProps | null) => void;
}

const ChooseEventLocationModal: React.FC<ChooseEventLocationModalProps> = ({
    modalVisible,
    setSelectedHub,
    setModalVisible
}) => {
    const [hubs, setHubs] = useState<HubProps[] | null>(null);
    const [tempSelectedHub, setTempSelectedHub] = useState<HubProps | null>();
    const fetchHubs = async () => {
        const { error, data } = await supabase
            .from('hubs')
            .select('hub_name, hub_code')
            .order('hub_code')
        if (data) {
            setHubs(data)
        }
        if (error) (
            console.error(error.message)
        )
    };

    const handleSelectHub = async () => {
        if (!tempSelectedHub) {
            setSelectedHub(null)
            setModalVisible(!modalVisible);
            return
        };

        setSelectedHub({ hub_code: tempSelectedHub?.hub_code!, hub_name: tempSelectedHub?.hub_name! });
        setModalVisible(!modalVisible);
    };

    const handleSelectTempHub = (hub: HubProps) => {
        if (tempSelectedHub && (tempSelectedHub?.hub_code === hub.hub_code && tempSelectedHub?.hub_name === hub.hub_name)) {
            setTempSelectedHub(null)
            return;
        }
        setTempSelectedHub({ hub_code: hub.hub_code, hub_name: hub.hub_name })
    }

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
                        className='w-full p-1 py-3 flex flex-row items-center justify-between'
                    >
                        <TouchableOpacity
                            onPress={() => setModalVisible(!modalVisible)}
                        >

                            <AntDesign name="close" size={25} color="black" />
                        </TouchableOpacity>
                        <Text className='place-self-center '>Select a hub</Text>
                        <TouchableOpacity
                            onPress={handleSelectHub}
                            style={styles.shadowButtonStyle}
                            className='p-2 rounded-xl'>
                            <Text className='text-white'>
                                OK
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView className=''>
                        {
                            hubs?.map((hub) => (
                                <TouchableOpacity
                                    // onPress={() => setTempSelectedHub({hub_code: hub.hub_code, hub_name: hub.hub_name})}
                                    onPress={() => handleSelectTempHub(hub)}
                                    className={`w-full flex flex-row justify-center p-1 my-1 rounded-xl ${tempSelectedHub?.hub_name === hub.hub_name ? 'bg-amber-400' : 'bg-gray-200'}`}
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
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import { supabase } from '../../../supabase';
import platformAlert from '../../utils/functions/platformAlert';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';

interface RefundModalVisibleProps {
    modalVisible: boolean;
    setModalVisible: (modalVisible: boolean) => void;
    user_id: number;
    featured_event_id: number;
    setLoading: (modalVisible: boolean) => void;
}

const RefundModal: React.FC<RefundModalVisibleProps> = ({
    modalVisible,
    setModalVisible,
    setLoading,
    user_id,
    featured_event_id
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const handleInitiateRefund = async () => {
        //Initiating refund. Function must:
        //- cancel the booking in featured_event_bookings,
        //- cancel the ticket in tickets
        //- create the stripe refund
        //- once successful amend the transaction from complete to refunded.
        //- email the user that a refund was sent.
        //- update the ticket sold quantity for the specific ticket types. 
        setLoading(true);

        try {

            const { error } = await supabase.functions.invoke(
                "initiate-individual-refund", {
                body: {
                    featured_event_id: featured_event_id,
                    user_id: user_id
                },
            });
            if (error) console.error('Error calling edge function initiate-individual-refund, see logs: ', error);

            platformAlert('Refund initiated successfully');
            navigation.navigate('manageevent', {
                featured_event_id: featured_event_id
            })

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1 justify-center items-center bg-black/40 px-6">
                <View className="bg-white rounded-3xl p-6 w-full">
                    <View className="items-center mb-5">
                        <View className="bg-red-100 p-3 rounded-full">
                            <Ionicons
                                name="cash-outline"
                                size={28}
                                color="#dc2626"
                            />
                        </View>

                        <Text className="text-xl font-semibold text-center mt-5">
                            Issue refund?
                        </Text>

                        <Text className="text-gray-500 text-center mt-3 leading-6">
                            You're about to refund this attendee. Their ticket will be cancelled,
                            their payment will be refunded, and they'll receive a confirmation email.
                            This action cannot be undone.
                        </Text>

                        <View className="flex-row mt-8">

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="flex-1 border border-gray-200 rounded-2xl py-4 mr-2"
                            >
                                <Text className="text-center font-medium">
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleInitiateRefund}
                                className="flex-1 bg-red-600 rounded-2xl py-4 ml-2"
                            >
                                <Text className="text-center text-white font-semibold">
                                    Issue refund
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default RefundModal
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../../../../utils/styles/shadow'
import { supabase } from '../../../../../supabase';
import { Ionicons } from '@expo/vector-icons';
import ManageEventBannerComponent from '../../../../components/ManageEventBannerComponent';


type PromoCode = {
    promo_code_id: number;
    code: string;
    discount_value: number;
    quantity: number | null;
    redemption_count: number | null;
    active: boolean;
};
const PromoCodeModal = ({ featured_event_id }: { featured_event_id: number }) => {
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const fetchPromoCodes = async () => {
        try {
            const { data, error } = await supabase
                .from('promo_codes')
                .select()
                .eq('featured_event_id', featured_event_id)
            if (error) {
                console.error('Error fetching promo codes:', error.message);
                // return;
            }
            if (data) {
                setPromoCodes(data);
            }
        } catch (error) {
            console.error('Error fetching promo codes:', error);
        }
    };

    useEffect(() => {
        fetchPromoCodes();
    }, [featured_event_id]);

    const renderItem = ({ item }: { item: PromoCode }) => (
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
            <View className="flex-row justify-between items-center">
                <View className="flex-1">
                    <Text className="text-lg font-semibold">
                        {item.code}
                    </Text>

                    <Text className="text-gray-500 mt-1">
                        {item.discount_value}% off
                    </Text>

                    {item.quantity !== null && (
                        <Text className="text-gray-400 text-sm mt-1">
                            {item.redemption_count ?? 0} / {item.quantity} redeemed
                        </Text>
                    )}

                </View>
                <View className="items-end">
                    <View
                        className={`
                        px-3 py-1 rounded-full
                        ${item.active
                                ? "bg-green-100"
                                : "bg-gray-200"}
                    `}
                    >
                        <Text
                            className={`
                            text-xs font-medium
                            ${item.active
                                    ? "text-green-700"
                                    : "text-gray-600"}
                        `}
                        >
                            {item.active ? "Active" : "Inactive"}
                        </Text>
                    </View>
                    {/* <TouchableOpacity
                        // onPress={() => handleDelete(item)}
                        className="mt-3"
                    >
                        <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#dc2626"
                        />
                    </TouchableOpacity> */}
                </View>
            </View>
        </View>
    );

    return (
        <>
            <ManageEventBannerComponent
                onPress={() => setModalVisible(!modalVisible)}
                title='Promo codes'
                description='Manage your promo codes'
            />
            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View
                        className="bg-white rounded-t-3xl px-5 pt-4 pb-6 max-h-[80%]"
                        style={styles.shadow}
                    >
                        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-5" />
                        <View className="flex-row justify-between items-center mb-5">

                            <Text className="text-2xl font-semibold">
                                Promo codes
                            </Text>

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="bg-gray-100 p-2 rounded-full"
                            >
                                <Ionicons
                                    name="close"
                                    size={20}
                                    color="black"
                                />
                            </TouchableOpacity>

                        </View>

                        <FlatList
                            data={promoCodes}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.promo_code_id.toString()}
                            ItemSeparatorComponent={() => <View className="h-3" />}
                            ListEmptyComponent={
                                <Text className="text-center text-gray-500 py-10">
                                    No promo codes available.
                                </Text>
                            }
                        />

                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="mt-5 bg-black rounded-2xl py-4"
                        >
                            <Text className="text-center text-white font-semibold">
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>

    )
}

export default PromoCodeModal
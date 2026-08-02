import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../../../supabase';
import DeletePromoCodeModal from './DeletePromoCodeModal';
type PromoCodeCardProps = {
    item: {
        promo_code_id: number;
        code: string;
        discount_value: number;
        quantity: number | null;
        redemption_count: number | null;
        active: boolean;
    };
    fetchPromoCodes: () => void;
};
const PromoCodeCard = ({ item, fetchPromoCodes }: PromoCodeCardProps) => {
    const [deletePromoCodeModalVisible, setDeletePromoCodeModalVisible] = React.useState(false);

    const handleDelete = async (promo_code_id: number) => {
        try {
            // Call your delete function here, e.g., API call to delete the ticket type
            console.log(`Deleting promo code with ID: ${promo_code_id}`);

            const { error } = await supabase
                .from("promo_codes")
                .delete()
                .eq("promo_code_id", promo_code_id)

            if (error) {
                console.error("Error deleting promo code:", error);
                // return;
            }
            setDeletePromoCodeModalVisible(false);
            fetchPromoCodes();
        } catch (error) {
            console.error("Error deleting promo code:", error);
        }
        finally {
            // Refresh the promo codes list after deletion
            setDeletePromoCodeModalVisible(false);
            fetchPromoCodes();
        }
    };
    return (
        <>
            <TouchableOpacity
                activeOpacity={0.9}
                className="bg-white border border-gray-200 rounded-3xl p-5 mb-4"
            >
                <View className="flex-row justify-between items-start">

                    <View className="flex-1 pr-4">

                        <View className="flex-row items-center">

                            <Text className="text-xl font-bold text-black">
                                {item.code}
                            </Text>

                            <View
                                className={`ml-3 px-3 py-1 rounded-full ${item.active
                                    ? "bg-green-100"
                                    : "bg-gray-200"
                                    }`}
                            >
                                <Text
                                    className={`text-xs font-semibold ${item.active
                                        ? "text-green-700"
                                        : "text-gray-600"
                                        }`}
                                >
                                    {item.active ? "Active" : "Inactive"}
                                </Text>
                            </View>

                        </View>

                        <Text className="text-gray-500 mt-2">
                            {item.discount_value}% discount
                        </Text>

                        {item.quantity !== null && (
                            <Text className="text-gray-400 text-sm mt-1">
                                {item.redemption_count ?? 0} of {item.quantity} redeemed
                            </Text>
                        )}

                    </View>

                    <TouchableOpacity
                        onPress={() => setDeletePromoCodeModalVisible(true)}
                        className="bg-red-50 p-2 rounded-full"
                    >
                        <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#dc2626"
                        />
                    </TouchableOpacity>

                </View>
            </TouchableOpacity>
            <DeletePromoCodeModal
                modalVisible={deletePromoCodeModalVisible}
                setModalVisible={setDeletePromoCodeModalVisible}
                onDelete={() => {
                    
                    handleDelete(item.promo_code_id);
                }}
            />
        </>

    )
}

export default PromoCodeCard
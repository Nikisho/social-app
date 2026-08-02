import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../context/navSlice";
import platformAlert from "../../../../utils/functions/platformAlert";
import { supabase } from "../../../../../supabase";
import fetchOrganizerId from "../../../../utils/functions/fetchOrganizerId";

interface NewPromoCodeModalProps {
    modalVisible: boolean
    setModalVisible: (bool: boolean) => void
    featured_event_id: number;
    fetchPromoCodes: () => void;
}
const NewPromoCodeModal = ({
    modalVisible,
    setModalVisible,
    featured_event_id,
    fetchPromoCodes
}: NewPromoCodeModalProps) => {

    const currentUser = useSelector(selectCurrentUser);
    const [newPromoCode, setNewPromoCode] = useState({
        code: "",
        discount: "",
        quantity: "",
    });

    const handleCreatePromoCode = async () => {
        if (!newPromoCode.code || !newPromoCode.discount || !newPromoCode.quantity) {
            alert("Please fill in all required fields.");
            return;
        }
        if (!newPromoCode.code.trim() || !newPromoCode.discount || !newPromoCode.quantity) return;

        if (Number(newPromoCode.discount) <= 0 || Number(newPromoCode.discount) > 100) {
            platformAlert("Discount must be between 1 and 100");
            return;
        }
        if (newPromoCode.code.trim().length < 3 || newPromoCode.code.trim().length > 10) {
            platformAlert("Promo code must be between 3 and 10 characters");
            return;
        }

        if (newPromoCode.quantity && Number(newPromoCode.quantity) <= 0 || !Number.isInteger(Number(newPromoCode.quantity))) {
            platformAlert("Quantity must be a positive integer");
            return;
        }

        try {
            const organizer_id = await fetchOrganizerId(currentUser.id);
            const { error } = await supabase
                .from("promo_codes")
                .insert([
                    {
                        code: newPromoCode.code.trim().toUpperCase(),
                        discount_value: Number(newPromoCode.discount),
                        quantity: Number(newPromoCode.quantity),
                        featured_event_id: featured_event_id,
                        discount_type: "percentage",
                        organizer_id: organizer_id,
                    },
                ]);
            if (error) {
                console.error(error.message)
            }
        } catch (error) {
            console.error("Error creating promo code:", error);
            platformAlert("Error creating promo code. Please try again.");
            return;
        } finally {
            setModalVisible(false);
            fetchPromoCodes();
        }
    };

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1 justify-end bg-black/40">
                <View className="bg-white rounded-t-3xl px-5 pt-4 pb-8">

                    <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-5" />

                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-2xl font-semibold">
                            New promo code
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

                    <Text className="text-gray-500 mb-6">
                        Create a discount code for this event.
                    </Text>

                    <View>
                        <Text className="font-medium mb-2">
                            Promo code
                        </Text>

                        <TextInput
                            value={newPromoCode.code}
                            onChangeText={(value) =>
                                setNewPromoCode({
                                    ...newPromoCode,
                                    code: value
                                        .trim()
                                        .toUpperCase()
                                        .replace(/[^A-Z0-9]/gi, "")
                                })
                            }
                            placeholder="e.g. EARLY10"
                            autoCapitalize="characters"
                            maxLength={10}
                            returnKeyType="done"
                            className="border border-gray-200 rounded-2xl p-4"
                        />
                    </View>

                    <View className="mt-5">
                        <Text className="font-medium mb-2">
                            Discount (%)
                        </Text>

                        <TextInput
                            value={newPromoCode.discount}
                            onChangeText={(value) =>
                                setNewPromoCode({
                                    ...newPromoCode,
                                    discount: value
                                        .replace(/[^0-9]/g, "")
                                        .replace(/^0+/, "")
                                })
                            }
                            keyboardType="number-pad"
                            placeholder="10"
                            returnKeyType="done"
                            className="border border-gray-200 rounded-2xl p-4"
                        />
                    </View>

                    <View className="mt-5">
                        <Text className="font-medium mb-2">
                            Quantity
                        </Text>

                        <TextInput
                            value={newPromoCode.quantity}
                            onChangeText={(value) =>
                                setNewPromoCode({
                                    ...newPromoCode,
                                    quantity: value
                                        .replace(/[^0-9]/g, "")
                                        .replace(/^0+/, "")
                                })
                            }
                            keyboardType="number-pad"
                            placeholder="100"
                            returnKeyType="done"
                            className="border border-gray-200 rounded-2xl p-4"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleCreatePromoCode}
                        disabled={!newPromoCode.code || !newPromoCode.discount || !newPromoCode.quantity}
                        className={`mt-8 rounded-2xl py-4 ${!newPromoCode.code || !newPromoCode.discount || !newPromoCode.quantity
                            ? "bg-gray-300"
                            : "bg-black"
                            }`}
                    >
                        <Text className="text-white text-center font-semibold text-base">
                            Create promo code
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

export default NewPromoCodeModal;
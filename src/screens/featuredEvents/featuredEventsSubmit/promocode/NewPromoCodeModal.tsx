import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { uuidv4 } from "../../../../utils/functions/uuidv4";
import platformAlert from "../../../../utils/functions/platformAlert";

interface NewPromoCodeModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    setPromoCodes: (promoCodes: ((prev: any[]) => any[]) | any[]) => void;
    editingPromoCode?: {
        promo_code_id: number;
        code: string;
        discount_value: number;
        quantity: number | null;
        active: boolean;
    } | null;
}

const NewPromoCodeModal: React.FC<NewPromoCodeModalProps> = ({
    modalVisible,
    setModalVisible,
    setPromoCodes,
    editingPromoCode
}) => {
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [quantity, setQuantity] = useState("");
    const handleSubmit = () => {

        if (!code.trim() || !discount || !quantity) return;

        if (Number(discount) <= 0 || Number(discount) > 100) {
            platformAlert("Discount must be between 1 and 100");
            return;
        }
        if (code.trim().length < 3 || code.trim().length > 10) {
            platformAlert("Promo code must be between 3 and 10 characters");
            return;
        }

        if (quantity && Number(quantity) <= 0 || !Number.isInteger(Number(quantity))) {
            platformAlert("Quantity must be a positive integer");
            return;
        }
        
        setPromoCodes((prev: any[]) => {
            // EDIT MODE
            if (editingPromoCode) {
                return prev.map((p) =>
                    p.promo_code_id === editingPromoCode.promo_code_id
                        ? {
                            ...p,
                            code: code.trim().toUpperCase(),
                            discount_value: Number(discount),
                            quantity: quantity ? Number(quantity) : null,
                        }
                        : p
                );
            }

            // CREATE MODE
            return [
                ...prev,
                {
                    uuid: uuidv4(9),
                    code: code.trim().toUpperCase(),
                    discount_value: Number(discount),
                    quantity: quantity ? Number(quantity) : null,
                    active: true,
                },
            ];
        });

        setCode("");
        setDiscount("");
        setModalVisible(false);
    };
    useEffect(() => {
        if (editingPromoCode) {
            setCode(editingPromoCode.code);
            setDiscount(
                String(editingPromoCode.discount_value)
            );
            setQuantity(
                editingPromoCode.quantity ? String(editingPromoCode.quantity) : ""
            );
        } else {
            setCode("");
            setDiscount("");
            setQuantity("");
        }
    }, [editingPromoCode, modalVisible]);

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="mt-10 flex-1 justify-start bg-black/40">

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
                            value={code}
                            onChangeText={(value) =>
                                setCode(value.toUpperCase())
                            }
                            placeholder="e.g. EARLY10"
                            returnKeyType="done"
                            maxLength={10}
                            autoCapitalize="characters"
                            className="border border-gray-200 rounded-2xl p-4"
                        />

                    </View>

                    <View className="mt-5">

                        <Text className="font-medium mb-2">
                            Discount (%)
                        </Text>

                        <TextInput
                            value={discount}
                            onChangeText={(value) =>
                                setDiscount(
                                    value
                                        .replace(/[^0-9]/g, "")
                                        .replace(/^0+/, "")
                                )
                            }
                            keyboardType="number-pad"
                            returnKeyType="done"
                            placeholder="10"
                            className="border border-gray-200 rounded-2xl p-4"
                        />

                    </View>
                    <View className="mt-5">

                        <Text className="font-medium mb-2">
                            Quantity
                        </Text>

                        <TextInput
                            value={quantity}
                            onChangeText={(value) =>
                                setQuantity(
                                    value
                                        .replace(/[^0-9]/g, "")
                                        .replace(/^0+/, "")
                                )
                            }
                            keyboardType="number-pad"
                            returnKeyType="done"
                            placeholder="10"
                            className="border border-gray-200 rounded-2xl p-4"
                        />
                    </View>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!code || !discount || !quantity}
                        className={`
                            mt-8
                            rounded-2xl
                            py-4
                            bg-black
                        `}
                    >
                        <Text className="text-white text-center font-semibold text-base">
                            {editingPromoCode ? "Save changes" : "Create promo code"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default NewPromoCodeModal;
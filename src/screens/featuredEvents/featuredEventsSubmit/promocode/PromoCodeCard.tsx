import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type PromoCodeCardProps = {
    item: {
        promo_code_id: number;
        code: string;
        discount_value: number;
        active: boolean;
    };
    onEdit: () => void;
    onDelete: () => void;
};

const PromoCodeCard: React.FC<PromoCodeCardProps> = ({
    item,
    onEdit,
    onDelete,
}) => {
    return (
        <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
            <View className="flex-row justify-between items-start">
                <View className="flex-1">
                    <Text className="text-lg font-semibold">
                        {item.code}
                    </Text>

                    <Text className="text-gray-500 mt-1">
                        {item.discount_value}% off
                    </Text>
                    <View
                        className={`
                            self-start
                            mt-3
                            px-3
                            py-1
                            rounded-full
                            ${
                                item.active
                                    ? "bg-green-100"
                                    : "bg-gray-200"
                            }
                        `}
                    >
                        <Text
                            className={`
                                text-xs
                                font-medium
                                ${
                                    item.active
                                        ? "text-green-700"
                                        : "text-gray-600"
                                }
                            `}
                        >
                            {item.active ? "Active" : "Inactive"}
                        </Text>
                    </View>
                </View>
                <View className="flex-row">
                    <TouchableOpacity
                        onPress={onEdit}
                        className="p-2 mr-2"
                    >
                        <Ionicons
                            name="create-outline"
                            size={20}
                            color="black"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onDelete}
                        className="p-2"
                    >
                        <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#dc2626"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default PromoCodeCard;
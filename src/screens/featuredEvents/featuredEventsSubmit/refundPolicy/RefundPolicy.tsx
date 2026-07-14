import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EventDataProps } from "../types/EventDataProps";

interface RefundPolicyProps {
    setEventData: React.Dispatch<React.SetStateAction<any>>;
    eventData: EventDataProps;
}

const REFUND_POLICIES = [
    {
        refund_policy_type_id: 1,
        title: "No refunds",
        description: "Tickets cannot be refunded after purchase.",
        icon: "close-circle-outline",
    },
    {
        refund_policy_type_id: 2,
        title: "24 hours before",
        description: "Refunds are available up to 24 hours before the event starts.",
        icon: "time-outline",
    },
    {
        refund_policy_type_id: 3,
        title: "48 hours before",
        description: "Refunds are available up to 48 hours before the event starts.",
        icon: "time-outline",
    },
    {
        refund_policy_type_id: 4,
        title: "7 days before event",
        description: "Refunds are available up to 7 days before the event starts.",
        icon: "calendar-outline",
    },
    {
        refund_policy_type_id: 5,
        title: "Before event starts",
        description: "Refunds are available until the event begins.",
        icon: "flag-outline",
    },
];

const RefundPolicy: React.FC<RefundPolicyProps> = ({
    setEventData,
    eventData,
}) => {
    return (
        <ScrollView className="mx-4 mb-6"
            contentContainerStyle={{
                paddingBottom: 350
            }}
        >
            <View className="mb-5">
                <Text className="text-2xl font-semibold">
                    Refund policy
                </Text>
            </View>
            {/* Information */}
            <View className="bg-zinc-50 rounded-3xl border border-zinc-200 p-5 mb-6">
                <View className="flex-row">
                    <View className="bg-black rounded-full p-2 mr-3 self-start">
                        <Ionicons
                            name="information-outline"
                            size={18}
                            color="white"
                        />
                    </View>

                    <View className="flex-1">
                        <Text className="font-semibold text-base mb-2">
                            Let attendees know what to expect
                        </Text>
                        <Text className="text-gray-600 leading-6">
                            Select when attendees are eligible for a refund if they can no longer attend your event. This policy will be displayed before checkout.
                        </Text>
                    </View>
                </View>
            </View>

            {REFUND_POLICIES.map((policy) => {

                const selected =
                    eventData.refund_policy_type_id ===
                    policy.refund_policy_type_id;

                return (
                    <TouchableOpacity
                        key={policy.refund_policy_type_id}
                        activeOpacity={0.8}
                        onPress={() =>
                            setEventData((prev: any) => ({
                                ...prev,
                                refund_policy_type_id:
                                    policy.refund_policy_type_id,
                            }))
                        }
                        className={`
                            flex-row
                            items-center
                            justify-between
                            rounded-3xl
                            border
                            p-5
                            mb-3
                            ${
                                selected
                                    ? "border-black bg-zinc-50"
                                    : "border-zinc-200 bg-white"
                            }
                        `}
                    >

                        <View className="flex-row flex-1 items-start">

                            <View
                                className={`
                                    p-2
                                    rounded-full
                                    mr-4
                                    ${
                                        selected
                                            ? "bg-black"
                                            : "bg-zinc-100"
                                    }
                                `}
                            >
                                <Ionicons
                                    name={policy.icon as any}
                                    size={20}
                                    color={
                                        selected
                                            ? "white"
                                            : "#52525b"
                                    }
                                />
                            </View>

                            <View className="flex-1">

                                <Text className="font-semibold text-base">
                                    {policy.title}
                                </Text>

                                <Text className="text-gray-500 mt-1 leading-5">
                                    {policy.description}
                                </Text>

                            </View>

                        </View>

                        <View
                            className={`
                                h-6
                                w-6
                                rounded-full
                                border-2
                                items-center
                                justify-center
                                ml-4
                                ${
                                    selected
                                        ? "bg-black border-black"
                                        : "border-gray-300"
                                }
                            `}
                        >
                            {selected && (
                                <Ionicons
                                    name="checkmark"
                                    size={14}
                                    color="white"
                                />
                            )}
                        </View>

                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

export default RefundPolicy;
import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../../supabase";
import platformAlert from "../../../../utils/functions/platformAlert";

interface Props {
    item: any;
    onPress?: () => void;
    fetchBuckets: () => void;
}

const TicketBucketCard: React.FC<Props> = ({
    item,
    onPress,
    fetchBuckets
}) => {
    const [ticketTypes, setTicketTypes] = React.useState<any[]>([]);
    const handleDelete = async (item: any) => {
        // Implement delete functionality here
        const { error } = await supabase
            .from("ticket_buckets")
            .delete()
            .eq("ticket_bucket_id", item.ticket_bucket_id);

        if (error) {
            console.error("Error deleting ticket bucket:", error.message);
        } else {
            console.log("Ticket bucket deleted successfully");
        }
        console.log("Delete ticket bucket:", item);
        fetchBuckets();
        platformAlert("Ticket bucket deleted successfully");
    };

    const fetchTicketTypes = async () => {
        // Implement fetch ticket types functionality here
        const { data, error } = await supabase
            .from("ticket_types")
            .select()
            .eq("ticket_bucket_id", item.ticket_bucket_id);

        if (error) {
            console.error("Error fetching ticket types:", error.message);
        }
        if (data) {
            setTicketTypes(data);
        }
        console.log("Fetch ticket types for bucket:", item);
    };

    useEffect(() => {
        fetchTicketTypes();
    }, [item.ticket_bucket_id]);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className="bg-white border border-gray-200 rounded-2xl p-4 mb-3"
        >

            <View className="flex-row items-start justify-between">

                <View className="flex-1">
                    <Text className="text-lg font-semibold">
                        {item.name}
                    </Text>

                    <Text className="text-gray-500 mt-1">
                        Capacity: {item.quantity} tickets
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => handleDelete(item)}
                    className="bg-red-50 p-2 rounded-full"
                >
                    <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#dc2626"
                    />
                </TouchableOpacity>

            </View>

            <View className="">
                <Text className="text-sm text-gray-400 mt-4 mb-2">
                    Ticket types
                </Text>

                {ticketTypes.map((ticket: any) => (
                    <View
                        key={ticket.ticket_type_id}
                        className="bg-gray-100  rounded-full px-3 py-1 self-start mr-2 mb-2"
                    >
                        <Text className="text-sm">
                            {ticket.name}
                        </Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
};

export default TicketBucketCard;
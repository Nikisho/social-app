import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../../supabase";
import { selectCurrentUser } from "../../../../context/navSlice";
import { useSelector } from "react-redux";
import fetchOrganizerId from "../../../../utils/functions/fetchOrganizerId";

interface Props {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    featured_event_id: number;
    fetchBuckets: () => void;
}

const NewTicketBucketModal = ({
    modalVisible,
    setModalVisible,
    featured_event_id,
    fetchBuckets
}: Props) => {

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [ticketTypes, setTicketTypes] = useState<any[]>([]);
    const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
    const currentUser = useSelector(selectCurrentUser);
    
    useEffect(() => {
        if (modalVisible) {
            fetchTicketTypes();
        }
    }, [modalVisible]);


    const fetchTicketTypes = async () => {
        // fetch ticket types using featured_event_id
        const { data, error } = await supabase
            .from("ticket_types")
            .select()
            .eq("featured_event_id", featured_event_id)
            .is('ticket_bucket_id', null); // Only fetch ticket types that are not assigned to any bucket

        if (data) {
            setTicketTypes(data);
        }
        if (error) {
            console.error("Error fetching ticket types:", error.message);
        }
    };


    const handleAddBucket = async () => {
        try {
            const organizer_id = await fetchOrganizerId(currentUser.id);

            const { data, error } = await supabase
                .from("ticket_buckets")
                .insert({
                    name: name.trim(),
                    quantity: parseInt(quantity),
                    featured_event_id,
                    organizer_id,
                })
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            const { error: updateError } = await supabase
                .from("ticket_types")
                .update({
                    ticket_bucket_id: data.ticket_bucket_id,
                })
                .in("ticket_type_id", selectedTickets);

            if (updateError) {
                throw new Error(updateError.message);
            }

            console.log("Ticket bucket created successfully");

            fetchBuckets();
            setModalVisible(false);
            setName("");
            setQuantity("");
            setSelectedTickets([]);

        } catch (error: any) {
            console.error(
                "Error creating ticket bucket:",
                error.message
            );
        }
    };


    const toggleTicket = (ticketTypeId: number) => {
        setSelectedTickets((prev) =>
            prev.includes(ticketTypeId)
                ? prev.filter((id) => id !== ticketTypeId)
                : [...prev, ticketTypeId]
        );
    };


    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1 justify-end bg-black/40">

                <View className="bg-white rounded-t-3xl px-5 pt-5 pb-8">

                    {/* Handle */}
                    <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-5" />


                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4">

                        <Text className="text-2xl font-semibold">
                            New ticket bucket
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


                    <View className="bg-violet-50 rounded-2xl p-4 mb-5">
                        <Text className="text-violet-800 text-sm leading-5">
                            Ticket buckets help organise ticket allocations,
                            such as Early Bird, VIP, or General Admission.
                        </Text>
                    </View>


                    {/* Name */}
                    <Text className="font-medium mb-2">
                        Bucket name
                    </Text>

                    <TextInput
                        value={name}
                        onChangeText={(value) => setName(value.trim().toUpperCase().replace(/[^A-Z0-9]/gi, ""))}
                        placeholder="e.g. Early Bird"
                        className="border border-gray-200 rounded-2xl p-4"
                    />


                    {/* Quantity */}
                    <View className="mt-5">

                        <Text className="font-medium mb-2">
                            Bucket capacity
                        </Text>

                        <TextInput
                            value={quantity}
                            onChangeText={(value) =>
                                setQuantity(
                                    value.replace(/[^0-9]/g, "")
                                )
                            }
                            keyboardType="number-pad"
                            placeholder="100"
                            className="border border-gray-200 rounded-2xl p-4"
                        />

                    </View>


                    {/* Ticket types */}
                    <View className="mt-5">

                        <Text className="font-medium mb-3">
                            Select ticket types
                        </Text>

                        <FlatList
                            data={ticketTypes}
                            keyExtractor={(item) =>
                                item.ticket_type_id.toString()
                            }
                            renderItem={({ item }) => {

                                const selected =
                                    selectedTickets.includes(
                                        item.ticket_type_id
                                    );

                                return (
                                    <TouchableOpacity
                                        onPress={() =>
                                            toggleTicket(
                                                item.ticket_type_id
                                            )
                                        }
                                        className={`p-4 rounded-2xl border mb-3 ${selected
                                            ? "bg-violet-50 border-violet-400"
                                            : "border-gray-200"
                                            }`}
                                    >

                                        <View className="flex-row justify-between">

                                            <Text className="font-medium">
                                                {item.name}
                                            </Text>

                                            <Ionicons
                                                name={
                                                    selected
                                                        ? "checkbox"
                                                        : "square-outline"
                                                }
                                                size={22}
                                                color={
                                                    selected
                                                        ? "#7c3aed"
                                                        : "#9ca3af"
                                                }
                                            />

                                        </View>

                                        <Text className="text-gray-500 mt-1">
                                            {item.quantity} tickets
                                        </Text>

                                    </TouchableOpacity>
                                );
                            }}
                        />

                    </View>


                    {/* CTA */}
                    <TouchableOpacity
                        onPress={handleAddBucket}
                        disabled={!name || !quantity || selectedTickets.length === 0}
                        className={`mt-5 rounded-2xl py-4 ${!name || !quantity || selectedTickets.length === 0
                            ? "bg-gray-300"
                            : "bg-black"
                            }`}
                    >
                        <Text className="text-white text-center font-semibold">
                            Create bucket
                        </Text>
                    </TouchableOpacity>


                </View>

            </View>

        </Modal>
    );
};

export default NewTicketBucketModal;
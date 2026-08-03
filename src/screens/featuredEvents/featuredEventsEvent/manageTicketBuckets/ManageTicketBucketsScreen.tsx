import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import SecondaryHeader from '../../../../components/SecondaryHeader';
import { useRoute } from '@react-navigation/native';
import { ManageTicketBucketsScreenRouteProp } from '../../../../utils/types/types';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../../../supabase';
import NewTicketBucketModal from './NewTicketBucketModal';
import TicketBucketCard from './TicketBucketCard';

type ManageTicketBucketsScreenProps = {
};

const ManageTicketBucketsScreen: React.FC<ManageTicketBucketsScreenProps> = () => {
    const route = useRoute<ManageTicketBucketsScreenRouteProp>();
    const [ticketBuckets, setTicketBuckets] = React.useState<any[]>([]);
    const [newTicketBucketModalVisible, setNewTicketBucketModalVisible] = React.useState<boolean>(false);
    const { featured_event_id } = route.params;

    const fetchBuckets = async () => {
        // Fetch ticket buckets logic here
        const { data, error } = await supabase
            .from('ticket_buckets')
            .select()
            .eq('featured_event_id', featured_event_id);

        if (error) {
            console.error('Error fetching ticket buckets:', error.message);
        }
        if (data) {
            setTicketBuckets(data);
        }
    };

    useEffect(() => {
        fetchBuckets();
    }, [featured_event_id]);
    return (
        <>
            <SecondaryHeader displayText="Manage your ticket buckets" />
            <View className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mt-2 mb-1 flex-row">
                <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color="#7c3aed"
                />

                <Text className="flex-1 ml-3 text-violet-900 leading-5">
                    Ticket buckets let you group multiple ticket types under a shared allocation,
                    such as <Text className="font-semibold">Early Bird</Text>,{" "}
                    <Text className="font-semibold">VIP</Text> or{" "}
                    <Text className="font-semibold">General Admission</Text>.
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => setNewTicketBucketModalVisible(true)}
                className='bg-gray-100 p-7 my-2 flex flex-row items-center'>
                <AntDesign name="plus" size={20} color="black" />
                <Text className='mx-10 font-bold text-center'>
                    Tap to add ticket buckets
                </Text>
            </TouchableOpacity>
            <FlatList
                data={ticketBuckets}
                renderItem={({ item }) => <TicketBucketCard
                    item={item}
                    fetchBuckets={fetchBuckets}
                />}
                keyExtractor={(item) => item.ticket_bucket_id.toString()}
                ItemSeparatorComponent={() => <View className="h-3" />}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 py-10">
                        No ticket buckets available.
                    </Text>
                }
            />
            <NewTicketBucketModal
                featured_event_id={featured_event_id}
                fetchBuckets={fetchBuckets}
                modalVisible={newTicketBucketModalVisible}
                setModalVisible={setNewTicketBucketModalVisible}
            />
        </>
    )
}

export default ManageTicketBucketsScreen;
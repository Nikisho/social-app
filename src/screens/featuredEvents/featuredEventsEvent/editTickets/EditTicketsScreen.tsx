import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SecondaryHeader from '../../../../components/SecondaryHeader'
import { useRoute } from '@react-navigation/native'
import { EditTicketsScreenRouteProp } from '../../../../utils/types/types'
import { supabase } from '../../../../../supabase'
import TicketTypeCard from './TicketTypeCard'
import EditTicketTypeModal from './EditTicketTypeModal'
import { AntDesign } from '@expo/vector-icons'
import NewTicketTypeModal from './NewTicketTypeModal'

type TicketType = {
    ticket_type_id: number;
    name: string;
    description: string;
    price: string;
    currency_code: string;
    quantity: number;
    tickets_sold: number;
    is_free: boolean;
    is_active: boolean;
    sales_start: string;
    sales_end: string;
};
const EditTicketsScreen = () => {
    const route = useRoute<EditTicketsScreenRouteProp>();
    const { featured_event_id } = route.params;
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>();
    const [selectedTicketType, setSelectedTicketType] = useState<TicketType>();
    const [EditTicketTypeModalVisible, setEditTicketTypeModalVisible] = useState<boolean>(false);
    const [NewTicketTypeModalVisible, setNewTicketTypeModalVisible] = useState<boolean>(false);

    const fetchTicketTypes = async () => {
        const { data, error } = await supabase
            .from('ticket_types')
            .select()
            .eq('featured_event_id', featured_event_id)

        if (data) {
            setTicketTypes(data)
        }
        if (error) {
            console.error(error.message)
        }
    };

    const onEdit = (ticket: any) => {
        setSelectedTicketType(ticket)
        setEditTicketTypeModalVisible(true);
    };

    useEffect(() => {
        fetchTicketTypes();
    }, []);

    return (
        <>
            <View>
                <SecondaryHeader displayText="Edit ticket types" />

                <TouchableOpacity
                    onPress={() => setNewTicketTypeModalVisible(true)}
                    className='bg-gray-100 p-7 my-2 flex flex-row items-center'>
                    <AntDesign name="plus" size={20} color="black" />
                    <Text className='mx-10 font-bold text-center'>
                        Tap to add tickets
                    </Text>

                </TouchableOpacity> 

                <FlatList
                    contentContainerStyle={{ paddingBottom: 400 }}
                    data={ticketTypes}
                    renderItem={({ item }) => (
                        <TicketTypeCard
                            ticket={item}
                            onEdit={onEdit}
                            fetchTicketTypes={fetchTicketTypes}
                        />
                    )}
                    keyExtractor={(item: TicketType) => item.ticket_type_id.toString()}
                />
            </View>

            {
                selectedTicketType &&
                <EditTicketTypeModal
                    modalVisible={EditTicketTypeModalVisible}
                    setModalVisible={setEditTicketTypeModalVisible}
                    ticket={selectedTicketType}
                    setTicket={setSelectedTicketType}
                    fetchTicketTypes={fetchTicketTypes}
                />
            }

            <NewTicketTypeModal
                modalVisible={NewTicketTypeModalVisible}
                setModalVisible={setNewTicketTypeModalVisible}
                fetchTicketTypes={fetchTicketTypes}
                featured_event_id={featured_event_id}
            />
        </>

    )
}

export default EditTicketsScreen
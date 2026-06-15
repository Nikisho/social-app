import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SecondaryHeader from '../../../../components/SecondaryHeader'
import { useRoute } from '@react-navigation/native'
import { EditTicketsScreenRouteProp } from '../../../../utils/types/types'
import { supabase } from '../../../../../supabase'
import TicketTypeCard from './TicketTypeCard'
import EditTicketTypeModal from './EditTicketTypeModal'

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
    const [modalVisible, setModalVisible] = useState<boolean>(false);
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
        setModalVisible(true);
    };

    useEffect(() => {
        fetchTicketTypes();
    }, []);

    return (
        <>
            <View>
                <SecondaryHeader displayText="Edit ticket types" />
                {ticketTypes?.map((ticket) => (
                    <TicketTypeCard
                        key={ticket.ticket_type_id}
                        ticket={ticket}
                        onEdit={onEdit}
                    />
                ))}
            </View>

            {
                selectedTicketType &&
                <EditTicketTypeModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    ticket={selectedTicketType}
                    setTicket={setSelectedTicketType}
                    fetchTicketTypes={fetchTicketTypes}
                />
            }
        </>

    )
}

export default EditTicketsScreen
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ManageEventScreenRouteProp, RootStackNavigationProp } from '../../../../utils/types/types'
import EmailParticipants from './EmailParticipants'
import GuestListBanner from './GuestListBanner'
import ManageRSVPsModal from './ManageRSVPsModal'
import TicketStatsBanner from './TicketStatsBanner'
import SecondaryHeader from '../../../../components/SecondaryHeader'
import { supabase } from '../../../../../supabase'
import EditEventBanner from './EditEventBanner'
import AnalyticsBanner from './AnalyticsBanner'
import EditTicketsBanner from './EditTicketsBanner'
import PromoCodeModal from './PromoCodeModal'

const ManageEventScreen = () => {
    const route = useRoute<ManageEventScreenRouteProp>()
    const { featured_event_id } = route.params
    const [eventData, setEventData] = useState<any>(null);

    const fetchEventData = async () => {
        const { data: event, error } = await supabase
            .from('featured_events')
            .select(`*, organizers(user_id, users(*)), ticket_types(*)`)
            .eq('featured_event_id', featured_event_id)
            .single();

        if (error || !event) {
            console.error(error?.message || 'No event found');
            return;
        }

        setEventData(event);

        // Compute total tickets sold
        const total = event.ticket_types?.reduce(
            (sum: number, t: any) => sum + (t.tickets_sold || 0),
            0
        );
        console.log(total);
    };

    useEffect(() => {
        fetchEventData();
    }, []);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className=''
            style={{ flex: 1 }}
        >
            <ScrollView
                className="p-2"
                contentContainerStyle={{ paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
            >
                <SecondaryHeader displayText="Manage event" />
                <TicketStatsBanner
                    ticket_types={eventData?.ticket_types!}
                />

                <ManageRSVPsModal
                    featured_event_id={featured_event_id}
                />
                <GuestListBanner
                    featured_event_id={featured_event_id}
                />
                <EmailParticipants
                    featured_event_id={featured_event_id}
                />
                <EditEventBanner
                    featured_event_id={featured_event_id}
                />
                <EditTicketsBanner
                    featured_event_id={featured_event_id}
                />
                <PromoCodeModal 
                    featured_event_id={featured_event_id}
                />
                <AnalyticsBanner
                    featured_event_id={featured_event_id}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default ManageEventScreen
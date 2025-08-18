import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import { supabase } from '../../../../supabase';
import LoadingScreen from '../../loading/LoadingScreen';

interface EmptyChatProps {
    user_id: number;
    name: string;
}

interface CommonEventsProps {
    featured_event_id: number;
    featured_events: {
        title: string;
        date: string;
        featured_event_id: number
    }
}
const EmptyChat: React.FC<EmptyChatProps> = ({
    user_id,
    name
}) => {

    const [commonEvent, setCommonEvent] = useState<CommonEventsProps>();
    const currentUser = useSelector(selectCurrentUser);
    const [loading, setLoading] = useState(false);
    const isEventPast = commonEvent && new Date(commonEvent?.featured_events?.date) < new Date();
    const CTAMessage = isEventPast ? 'You both attended' : `You're both going to`;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fetchCommonEvents = async () => {
        setLoading(true);
        const { data: currentUserEvents } = await supabase
            .from('featured_event_bookings')
            .select('featured_event_id')
            .eq('user_id', currentUser.id);

        if (!currentUserEvents?.length) return [];

        // 2. Find matching events
        const { data, error }: any = await supabase
            .from('featured_event_bookings')
            .select(`
                    featured_event_id,
                    featured_events (
                        title,
                        featured_event_id,
                        date
                    )
            `)
            .eq('user_id', user_id)
            .in('featured_event_id', currentUserEvents.map(e => e.featured_event_id))
            .order('date', { referencedTable: 'featured_events', ascending: false })
            .limit(1)
            .single()
        if (error) {
            console.error('Error fetching event: ', error.message);
        }
        if (data) {
            console.log(data);
            setCommonEvent(data)
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCommonEvents();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800, // half a second fade in
            useNativeDriver: true,
        }).start();
    }, []);

    // if (loading) {
    //     return <LoadingScreen displayText='Getting your messages...' />
    // }

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity: fadeAnim }}>

                <View
                    className='p-3 px-10 bg-gray-300 rounded-2xl space-y-2'
                >
                    <Text className='text-center text-lg font-semibold'>
                        Say hi to {name}! 👋
                    </Text>
                    {
                        commonEvent &&
                        <Text className='text-center text-lg'>
                            {CTAMessage} {commonEvent?.featured_events.title} 🚀
                        </Text>
                    }
                </View>
            </Animated.View>
        </View>
    )
}

export default EmptyChat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }

});
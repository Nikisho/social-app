import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { EventAnalyticsScreenRouteProp } from '../../../../utils/types/types';
import SecondaryHeader from '../../../../components/SecondaryHeader';
import { supabase } from '../../../../../supabase';

const EventAnalyticsScreen = () => {
    const route = useRoute<EventAnalyticsScreenRouteProp>()
    const { featured_event_id } = route.params;
    const [period, setPeriod] = useState<string>('total');
    const [views, setViews] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const fetchPageViews = async () => {
        try {
            const { data, error } = await supabase.rpc('fetch_page_views',
                {
                    p_featured_event_id: featured_event_id,
                    p_period: period
                }
            )
            if (data) {
                setViews(data[0].views);
            }
            if (error) {
                console.error(error.message);
            }
        }
        catch (error) {
            console.error('Error fetching page views:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const periods = [
    { label: "Day", value: "day" },
    { label: "Week", value: "week" },
    { label: "Total", value: "total" },
] as const;

    useEffect(() => {
        fetchPageViews();
    }, [period]);

    return (
    <View className="flex-1 bg-gray-50">
        <SecondaryHeader displayText="Event analytics" />

        <View className="p-5">
            <Text className="text-2xl font-semibold mb-1">
                Page views
            </Text>

            <Text className="text-gray-500 mb-5">
                See how many people viewed your event page.
            </Text>

            <View className="bg-white rounded-2xl p-2 flex-row mb-5 border border-gray-100">
                {periods.map((item) => {
                    const isActive = period === item.value;
                    return (
                        <TouchableOpacity
                            key={item.value}
                            onPress={() => setPeriod(item.value)}
                            className={`flex-1 py-3 rounded-xl items-center ${
                                isActive ? "bg-black" : "bg-white"
                            }`}
                        >
                            <Text
                                className={`font-semibold ${
                                    isActive ? "text-white" : "text-gray-500"
                                }`}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 6,
                    elevation: 2,
                }}
                className="bg-white rounded-3xl p-6 border border-gray-100"
            >
                <Text className="text-gray-500 text-sm mb-2">
                    {period === "day"
                        ? "Views today"
                        : period === "week"
                        ? "Views this week"
                        : "Total views"}
                </Text>

                <Text className="text-5xl font-bold">
                    {loading ? "..." : views}
                </Text>

                <Text className="text-gray-400 text-sm mt-3">
                    Unique event page visits based on your selected period.
                </Text>
            </View>
        </View>
    </View>
    )
}

export default EventAnalyticsScreen
import { View, Text, Image, TouchableOpacity } from "react-native";
import { supabase } from "../../../../supabase";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../../utils/types/types";

export default function OrganizerInfo({ organizer_id }: { organizer_id: number }) {
    const [organizer, setOrganizer] = useState<{name:string; photo:string; email:string, id:number}>();
    const navigation = useNavigation<RootStackNavigationProp>();
    const fetchOrganizerData = async () => {

        try {
            const { data, error } = await supabase
                .from('organizers')
                .select(`*, users(*)`)
                .eq('organizer_id', organizer_id)
                .single()
            if (error) console.error(error.message)
            if (data) {
                setOrganizer(data.users)
            }
        } catch (error) {
            console.error('Error fetching organizer data :' , error)
        }
    };

    useEffect(() => {
        fetchOrganizerData();
    }, []);

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('profile', {user_id: organizer?.id!})}
             className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mt-4">
            <Text className="text-lg font-semibold mb-3 text-gray-800">
                Organised by
            </Text>

            <View className="flex-row items-center">
                <Image
                    source={{ uri: organizer?.photo }}
                    className="w-12 h-12 rounded-full mr-3"
                />
                <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                        {organizer?.name}
                    </Text>
                    <TouchableOpacity>
                        <Text 
                        selectable
                            className="text-sm text-blue-600">
                            {organizer?.email}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

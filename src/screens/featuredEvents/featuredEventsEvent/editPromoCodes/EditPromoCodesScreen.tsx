import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import SecondaryHeader from '../../../../components/SecondaryHeader'
import { AntDesign } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { EditPromoCodesScreenRouteProp } from '../../../../utils/types/types'
import { supabase } from '../../../../../supabase'
import PromoCodeCard from './PromoCodeCard'
import NewPromoCodeModal from './NewPromoCodeModal'

type PromoCode = {
    promo_code_id: number;
    code: string;
    discount_value: number;
    quantity: number | null;
    featured_event_id: number;
    redemption_count: number | null;
    active: boolean;
};

const EditPromoCodesScreen = () => {

    const route = useRoute<EditPromoCodesScreenRouteProp>();
    const { featured_event_id } = route.params;
    const [NewPromoCodeModalVisible, setNewPromoCodeModalVisible] = useState<boolean>(false);
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

    const fetchPromoCodes = async () => {
        try {
            const { data, error } = await supabase
                .from('promo_codes')
                .select()
                .eq('featured_event_id', featured_event_id)
            if (error) {
                console.error('Error fetching promo codes:', error.message);
            }
            if (data) {
                setPromoCodes(data);
                console.log('Fetched promo codes:', data);
            }
        } catch (error) {
            console.error('Error fetching promo codes:', error);
        }
    };

    useEffect(() => {
        fetchPromoCodes();
    }, [featured_event_id]);

    return (
        <View>
            <SecondaryHeader displayText="Manage your promo codes" />

            <TouchableOpacity
                onPress={() => setNewPromoCodeModalVisible(true)}
                className='bg-gray-100 p-7 my-2 flex flex-row items-center'>
                <AntDesign name="plus" size={20} color="black" />
                <Text className='mx-10 font-bold text-center'>
                    Tap to add promo codes
                </Text>

            </TouchableOpacity>

            <FlatList
                data={promoCodes}
                renderItem={({ item }) => <PromoCodeCard item={item} fetchPromoCodes={fetchPromoCodes} />}
                keyExtractor={(item) => item.promo_code_id.toString()}
                ItemSeparatorComponent={() => <View className="h-3" />}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 py-10">
                        No promo codes available.
                    </Text>
                }
            />
            <NewPromoCodeModal
                modalVisible={NewPromoCodeModalVisible}
                setModalVisible={setNewPromoCodeModalVisible}
                featured_event_id={featured_event_id}
                fetchPromoCodes={fetchPromoCodes}
                />
        </View >
    )
}

export default EditPromoCodesScreen
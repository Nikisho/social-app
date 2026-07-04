import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import PromoCodeCard from './PromoCodeCard'
import AntDesign from '@expo/vector-icons/AntDesign';
import NewPromoCodeModal from './NewPromoCodeModal';

interface NewPromoCodesProps {
    promoCodes: any[];
    setPromoCodes: (promoCodes: ((prev: any[]) => any[]) | any[]) => void;
}
const NewPromoCodes: React.FC<NewPromoCodesProps> = ({
    promoCodes,
    setPromoCodes
}) => {
    const [promoCodeModalVisible, setPromoCodeModalVisible] = React.useState<boolean>(false);
    const [editingPromoCode, setEditingPromoCode] = useState(null);

    const handleOpenEditModal = (item: any) => {
        setEditingPromoCode(item);
        setPromoCodeModalVisible(true);
    };
    const handleOpenNewModal = () => {
        setEditingPromoCode(null);
        setPromoCodeModalVisible(true);
    };

    const handleRemove = (item: any) => {
        const newArray = promoCodes.filter((t) => t.uuid !== item.uuid);
        setPromoCodes(newArray);
    };

    return (
        <>
            <View className='mx-4 mb-4'>
                <View className={`mb-5`} >
                    <Text className='text-2xl font-semibold '>
                        Promo codes
                    </Text>
                </View>

                {
                    promoCodes &&
                    <FlatList
                        ListHeaderComponent={(promoCodes?.length <= 3) ?
                            <TouchableOpacity
                                onPress={() => handleOpenNewModal()}
                                className='bg-gray-100 p-7 mt-2 flex flex-row items-center mb-3'>
                                <AntDesign name="plus" size={20} color="black" />
                                <Text className='mx-10 font-bold text-center'>
                                    Tap to add promo codes
                                </Text>

                            </TouchableOpacity> :
                            <></>
                        }
                        contentContainerStyle={{ paddingBottom: 400 }}
                        data={promoCodes}
                        renderItem={({ item }) => <PromoCodeCard item={item} onEdit={() => { handleOpenEditModal(item) }} onDelete={() => { handleRemove(item) }} />}
                        keyExtractor={(item: any) => item.uuid.toString()}
                    />
                }

            </View>
            <NewPromoCodeModal
                modalVisible={promoCodeModalVisible}
                setModalVisible={setPromoCodeModalVisible}
                setPromoCodes={setPromoCodes}
                editingPromoCode={editingPromoCode}
            />
        </>
    )
}

export default NewPromoCodes
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import styles from '../utils/styles/shadow'
import abbrNum from '../utils/functions/abbrNum'
import platformAlert from '../utils/functions/platformAlert'
import { supabase } from '../../supabase'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, setCurrentUser } from '../context/navSlice'
import Purchases from 'react-native-purchases'
import { recordTransaction } from '../utils/functions/recordTransaction'

interface BuyGamsModalProps {
    modalVisible: boolean
    setModalVisible: (bool: boolean) => void
    message: string
}
const gemOptions = [
    {
        id: 1,
        price: '2.99',
        amount: 299,
        quantity: 100,
        gems: '💎',
        revenue_cat_identifier: 'one-time-100-gems'
    },
    {
        id: 2,
        price: '4.99',
        amount: 499,
        quantity: 500,
        gems: '💎💎💎',
        revenue_cat_identifier: 'one-time-500-gems'

    },
    {
        id: 3,
        price: '6.99',
        amount: 699,
        quantity: 1000,
        gems: '💎💎💎💎',
        revenue_cat_identifier: 'one-time-1000-gems'

    },
]
const BuyGemsModal: React.FC<BuyGamsModalProps> = ({
    modalVisible,
    setModalVisible,
    message
}) => {
    const [loading, setLoading] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();

    const fetchPaymentSheetParams = async (package_identifier: string, extraGemCount: number) => {
        const offerings = await Purchases.getOfferings();
        const packages = offerings.all['gem_packs'].availablePackages;
        const gem_package = packages.find((gem:{identifier: string}) => (gem.identifier) === package_identifier)
        try {
            const { transaction } = await Purchases.purchasePackage(gem_package!);
            if (transaction) {
                const { data, error } = await supabase
                .from('users')
                .update({
                    gem_count: currentUser?.gemCount + extraGemCount
                }).
                eq('id', currentUser.id)
                .select()
                .single()
                if (error) {
                    console.error(error?.message)
                } else {
                    dispatch(setCurrentUser({
                        ...currentUser,
                        gemCount: data.gem_count
                    }));
                    platformAlert(`You received ${extraGemCount.toString()} extra gems!`)

                    recordTransaction(
                        gem_package?.product.priceString!,
                        gem_package?.identifier!,
                        transaction.purchaseDate,
                        data.uid,
                        transaction.transactionIdentifier,
                        gem_package?.product.currencyCode!
                    )
                }
                setModalVisible(false)
            }
        } catch (error:any) {
            console.error(error.message)
        }
    };
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View className='flex-1 justify-center items-center mt-22 h-full shadow-xl'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
                <View
                    className='bg-white rounded-xl m-20 h-auto w-[90%] p-4 space-y-3 items-center'

                    style={styles.shadow}
                >
                    <Text className='text-2xl font-bold'>
                        Top up?
                    </Text>
                    <Text className='text-xl'>
                        {message}
                    </Text>

                    <View className='flex flex-row space-x-1 '>
                        {
                            gemOptions.map((gemOption) => (
                                <TouchableOpacity key={gemOption.id}
                                    onPress={() => fetchPaymentSheetParams(gemOption.revenue_cat_identifier, gemOption.quantity)}
                                    className='w-1/3 flex items-center bg-amber-400 p-3 rounded-xl space-y-4'>
                                    <Text
                                        className=' px-2 text-xl text-white font-bold'>
                                        {gemOption.quantity}
                                    </Text>
                                    <Text>
                                        {gemOption.gems}

                                    </Text>
                                    <Text className='px-2 text-xl text-white font-bold' >
                                        £{gemOption.price}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        className=' px2 rounded-lg  w-1/2'>

                        <Text className=' text-center '>
                            No, thanks
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default BuyGemsModal

const textStyle = StyleSheet.create({

    currencyStyle: {
        fontFamily: 'Bangers-Regular', // Cartoon-style font
        fontWeight: 'bold',
        fontSize: 18, // Large text for a bold effect
        color: '#ffffff', // Main text color (gold)
        textShadowColor: '#000', // Outline color (black)
        textShadowOffset: { width: 1, height: 1 }, // Position of the shadow (creates an outline effect)
        textShadowRadius: 2, // Smoothness of the shadow edges
    }
})
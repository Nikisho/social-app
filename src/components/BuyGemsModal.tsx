import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import styles from '../utils/styles/shadow'
import abbrNum from '../utils/functions/abbrNum'
import platformAlert from '../utils/functions/platformAlert'
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native'
import { supabase } from '../../supabase'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, setCurrentUser } from '../context/navSlice'

interface BuyGamsModalProps {
    modalVisible: boolean
    setModalVisible: (bool: boolean) => void
}
const gemOptions = [
    {
        id: 1,
        price: '2.99',
        amount: 299,
        quantity: 100,
        gems: '💎'
    },
    {
        id: 2,
        price: '4.99',
        amount: 499,
        quantity: 500,
        gems: '💎💎💎'
    },
    {
        id: 3,
        price: '6.99',
        amount: 699,
        quantity: 1000,
        gems: '💎💎💎💎'
    },
]
const BuyGemsModal: React.FC<BuyGamsModalProps> = ({
    modalVisible,
    setModalVisible
}) => {
    const [loading, setLoading] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const fetchPaymentSheetParams = async (amount: number) => {
        const { data, error } = await supabase.functions.invoke(
            "create-checkout-session", {
            body: { amount: amount },
        }
        );
        if (!data || error) {
            Alert.alert(`Error: ${error?.message ?? "no data"}`);
            return {};
        }
        const { paymentIntent, ephemeralKey, customer, stripe_pk } = data;
        return {
            paymentIntent,
            ephemeralKey,
            customer
        };
    };

    const openPaymentSheet = async (amount: number, extraGemCount: number) => {
        await initializePaymentSheet(amount);

        const { error } = await presentPaymentSheet();
        if (error) {
            // Alert.alert(`Error code: ${error.code}`, error.message);
            console.error(error.message)
        } else {
            const { data, error } = await supabase
                .from('users')
                .update({
                    gem_count: currentUser?.gemCount + extraGemCount
                }).
                eq('id', currentUser.id)
                .select()
                .single()
            if (error) {
                console.error(error.message)
            } else {

                dispatch(setCurrentUser({
                    ...currentUser,
                    gemCount: data.gem_count
                }));
                platformAlert(`You received ${extraGemCount.toString()} extra gems!`)
            }
            setModalVisible(false)
        }
    };

    const initializePaymentSheet = async (amount: number) => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams(amount);

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Linkzy",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: true,
            returnURL: 'https://www.linkzyapp.com',
            // defaultBillingDetails: {
            //     name: 'Jane Doe',
            // },
            applePay: {
                merchantCountryCode: "GB",  // Change to your country code (e.g., "GB" for the UK)
            },
            googlePay: {
                merchantCountryCode: 'GB',
                testEnv: true, // use test environment
            },
        });
        if (error) {
            console.error(error.message);
            platformAlert(error.message)
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
                        You don't have enough gems
                    </Text>

                    <View className='flex flex-row space-x-1 '>
                        {
                            gemOptions.map((gemOption) => (
                                <TouchableOpacity key={gemOption.id}
                                    onPress={() => openPaymentSheet(gemOption.amount, gemOption.quantity)}
                                    className='w-1/3 flex items-center bg-teal-500 p-3 rounded-xl space-y-4'>
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
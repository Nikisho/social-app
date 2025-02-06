import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import styles from '../utils/styles/shadow'
import abbrNum from '../utils/functions/abbrNum'
import platformAlert from '../utils/functions/platformAlert'

interface BuyGamsModalProps {
    modalVisible: boolean
    setModalVisible: (bool: boolean) => void
}
const gemOptions = [
    {
        id: 1,
        price: '2.99',
        quantity: 100,
        gems: '💎'
    },
    {
        id: 2,
        price: '4.99',
        quantity: 500,
        gems: '💎💎💎'
    },
    {
        id: 3,
        price: '6.99',
        quantity: 1000,
        gems: '💎💎💎💎'
    },
]
const BuyGemsModal: React.FC<BuyGamsModalProps> = ({
    modalVisible,
    setModalVisible
}) => {
    const [loading, setLoading] = useState(false);

    const fetchPaymentIntent = async () => {
        try {
            const response = await fetch("https://your-supabase-function-url/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 1000, currency: "usd" }) // 10 USD
            });

            const { paymentIntent, ephemeralKey, customer } = await response.json();
            return { paymentIntent, ephemeralKey, customer };
        } catch (error) {
            console.error("Error fetching payment intent:", error);
            Alert.alert("Payment failed", "Try again later.");
            return null;
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        const paymentData = await fetchPaymentIntent();
        if (!paymentData) return;

        // const { error } = await initPaymentSheet({
        //     paymentIntentClientSecret: paymentData.paymentIntent,
        //     merchantDisplayName: "com.linkzy",
        //     customerId: paymentData.customer,
        //     customerEphemeralKeySecret: paymentData.ephemeralKey,
        //     allowsDelayedPaymentMethods: true,
        // });

        // if (error) {
        //     platformAlert("Error " + error.message);
        //     setLoading(false);
        //     return;
        // }

        // const { error: paymentError } = await presentPaymentSheet();

        // if (paymentError) {
        //     platformAlert("Payment Failed " + paymentError.message);
        // } else {
        //     platformAlert("Success" + "Payment completed!");
        // }

        setLoading(false);
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
                                <TouchableOpacity
                                    className='w-1/3 flex flex items-center bg-teal-500 p-3 rounded-xl space-y-4'>
                                    <Text
                                        className=' px-2 text-xl text-white font-bold'>
                                        {gemOption.quantity}
                                    </Text>
                                    <Text>
                                        {gemOption.gems}

                                    </Text>
                                    <Text className='px-2 text-xl text-white font-bold' >
                                        {gemOption.price}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                    <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        className='bg-gray-100 px2 rounded-lg  w-1/2'>

                        <Text className='text-lg text-center '>
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
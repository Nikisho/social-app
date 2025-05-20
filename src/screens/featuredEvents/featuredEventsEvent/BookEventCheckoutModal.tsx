import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native'
import React from 'react'
import { supabase } from '../../../../supabase';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import platformAlert from '../../../utils/functions/platformAlert';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';

interface BookEventCheckoutModalProps {
    modalVisible: boolean;
    setModalVisible: (bool: boolean) => void;
    handleBookEvent: () => void;
    price: string;
    is_free: boolean;
    featured_event_id: number;
    organizer_id: number
    date: Date
}

const BookEventCheckoutModal: React.FC<BookEventCheckoutModalProps> = ({
    modalVisible,
    setModalVisible,
    price,
    date,
    is_free,
    handleBookEvent,
    featured_event_id,
    organizer_id
}) => {

    const priceStripeAmount = Math.round(parseFloat(price) * 100); 
    const currentUser = useSelector(selectCurrentUser);

    const fetchPaymentSheetParams = async (amount: number) => {
        const { data, error } = await supabase.functions.invoke(
            "create-checkout-session", {
            body: { 
                amount: amount, 
                featured_event_id: featured_event_id, 
                organizer_id:organizer_id,
                user_id: currentUser.id,
                date: date
            },
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

    const openPaymentSheet = async (amount: number) => {
        try {
          if (is_free === true) {
            handleBookEvent();
            return;
          }
      
          await initializePaymentSheet(amount);
          const { error } = await presentPaymentSheet();
          if (error) {
            console.error(error.message);
            return; // skip booking if payment error
          }
      
          handleBookEvent();
      
        } catch (error) {
          console.error(error);
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
            returnURL: 'https://www.linkzyapp.com/payment-complete.html',
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
            transparent
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
        >
            <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                className='flex-1 justify-end items-center bottom-0 w-full  ' >
                    <TouchableWithoutFeedback>

                <View className='bg-black w-full p-1 space-y-3 h-80' >
                    <View className='p-2'>
                        <Text className='text-white text-xl'>
                            Order summary
                        </Text>
                    </View>

                    <View className='p-2 py-3  border-y border-white flex flex-row justify-between'>
                        <Text className='text-white text-lg'>
                            General Admission
                        </Text>
            {
                is_free ?
                    <Text className='text-lg text-white font-bold'>
                        FREE
                    </Text>
                    :
                    <Text className=' text-lg text-white font-bold'>
                        £{price}
                    </Text>
            }
                        
                    </View>
                    <View className='flex items-center p-5'>
                        <TouchableOpacity
                            className=' bg-white w-full p-4 rounded-full'
                            onPress={() => openPaymentSheet(priceStripeAmount)}>
                            <Text className='text-lg text-center  font-bold'>PURCHASE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
}

export default BookEventCheckoutModal
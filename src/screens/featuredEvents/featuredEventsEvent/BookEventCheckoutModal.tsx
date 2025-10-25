import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Alert, Platform } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../../../../supabase';
import { confirmPlatformPayPayment, initPaymentSheet, isPlatformPaySupported, PlatformPay, presentPaymentSheet } from '@stripe/stripe-react-native';
import platformAlert from '../../../utils/functions/platformAlert';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import { PlatformPayButton, usePlatformPay } from '@stripe/stripe-react-native';
import { useTranslation } from 'react-i18next';

interface BookEventCheckoutModalProps {
    modalVisible: boolean;
    setModalVisible: (bool: boolean) => void;
    handleBookEvent: () => void;
    price: string;
    is_free: boolean;
    featured_event_id: number;
    organizer_id: number
    date: Date
    tickets_sold: number;
    chat_room_id: number;
    ticket_name: number;
    ticket_type_id: number;
}

const BookEventCheckoutModal: React.FC<BookEventCheckoutModalProps> = ({
    modalVisible,
    setModalVisible,
    price,
    date,
    is_free,
    handleBookEvent,
    featured_event_id,
    organizer_id,
    chat_room_id,
    tickets_sold,
    ticket_name,
    ticket_type_id
}) => {

    const { t } = useTranslation();
    const priceStripeAmount = Math.round(parseFloat(price) * 100);
    const currentUser = useSelector(selectCurrentUser);
    console.log(chat_room_id)
    const [loading, setLoading] = useState<boolean>(false);
    const fetchPaymentSheetParams = async (amount: number) => {
        const { data, error } = await supabase.functions.invoke(
            "create-checkout-session", {
            body: {
                amount: amount,
                featured_event_id: featured_event_id,
                organizer_id: organizer_id,
                user_id: currentUser.id,
                date: date,
                tickets_sold: tickets_sold,
                ticket_type_id: ticket_type_id,
                chat_room_id: chat_room_id
            },
        }
        );
        if (!data || error) {
            Alert.alert(`Error: ${error?.message ?? "no data"}`);
            setLoading(false);
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
        setLoading(true);
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
        finally {
            setLoading(false);
        }
    };

    const handlePlatformPay = async (amount: number) => {
        setLoading(true);
        try {
            const { paymentIntent } = await fetchPaymentSheetParams(amount);
            const { error } = await confirmPlatformPayPayment(
                paymentIntent,
                {
                    googlePay: {
                        testEnv: __DEV__ ? true : false,
                        merchantName: 'Linkzy',
                        merchantCountryCode: 'GB',
                        currencyCode: 'GBP',
                        billingAddressConfig: {
                            format: PlatformPay.BillingAddressFormat.Full,
                            isPhoneNumberRequired: true,
                            isRequired: true,
                        },
                    },
                    applePay: {
                        cartItems: [
                            {
                                label: 'Linkzy',
                                amount: price,
                                paymentType: PlatformPay.PaymentType.Immediate,
                            }
                        ],
                        merchantCountryCode: 'GB',
                        currencyCode: 'GBP',
                        requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
                    }
                }
            );
            if (error) {
                Alert.alert(error.code, error.message);
                setLoading(false);

                // Update UI to prompt user to retry payment (and possibly another payment method)
                return;
            }
            handleBookEvent();

        } catch (error) {
            console.error(error)
        }

        finally {
            setLoading(false);
        }
    };

    const initializePaymentSheet = async (amount: number) => {
        if (!(await isPlatformPaySupported({ googlePay: { testEnv: true } }))) {
            console.log('Google Pay is not supported.');
        } else {
            console.log('google pay supported')
        }
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
                testEnv: __DEV__ ? true : false, // use test environment,
                currencyCode: 'gbp',
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
                    <View className='bg-black w-full p-1 space-y-3 h-96' >
                        <View className='p-2'>
                            <Text className='text-white text-xl'>
                                {t('event_checkout.order_summary')}
                            </Text>
                        </View>

                        <View className='p-2 py-3  border-y border-white flex flex-row justify-between'>
                            <Text className='text-white text-lg'>
                                {/* {t('event_checkout.general_admission')} */}
                                {ticket_name}

                            </Text>
                            {
                                is_free ?
                                    <Text className='text-lg text-white font-bold'>
                                        {t('event_checkout.free')}
                                    </Text>
                                    :
                                    <Text className=' text-lg text-white font-bold'>
                                        {/* £{price} */}
                                        {t('event_checkout.currency')} {price}
                                    </Text>
                            }
                        </View>
                        <View className='flex items-center p-5 space-y-5'>
                            <TouchableOpacity
                                disabled={loading}
                                className={`bg-white w-full p-2 rounded-full ${loading && 'opacity-30'}`}
                                onPress={() => openPaymentSheet(priceStripeAmount)}>
                                <Text className='text-lg text-center  font-bold'> 
                                    {t('event_checkout.purchase')}
                                </Text>
                            </TouchableOpacity>
                            {!is_free &&
                                <PlatformPayButton
                                    disabled={loading}
                                    type={PlatformPay.ButtonType.Pay}
                                    onPress={() => handlePlatformPay(priceStripeAmount)}
                                    appearance={Platform.OS === 'ios'? PlatformPay.ButtonStyle.Black : PlatformPay.ButtonStyle.White}
                                    style={{
                                        width: '100%',
                                        height: 50,
                                        borderColor: Platform.OS === 'ios' ? 'white' : '',
                                        borderWidth: 1,
                                        borderRadius: 100
                                    }}
                                    borderRadius={100}
                                    
                                />
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
}

export default BookEventCheckoutModal
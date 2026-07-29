import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Alert, Platform } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../../../../supabase';
import { confirmPlatformPayPayment, initPaymentSheet, isPlatformPaySupported, PlatformPay, presentPaymentSheet } from '@stripe/stripe-react-native';
import platformAlert from '../../../utils/functions/platformAlert';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import { PlatformPayButton, usePlatformPay } from '@stripe/stripe-react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getPricePlusPlatformFee } from '../../../utils/functions/getPricePlusPlatformFee';

interface BookEventCheckoutModalProps {
    modalVisible: boolean;
    setModalVisible: (bool: boolean) => void;
    handleBookEvent: (quantity?: number) => void;
    price: string;
    is_free: boolean;
    featured_event_id: number;
    organizer_id: number
    date: Date
    tickets_sold: number;
    chat_room_id: number;
    ticket_name: number;
    ticket_type_id: number;
    platform_fee_discount_pct: number;
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
    ticket_type_id,
    platform_fee_discount_pct
}) => {

    const { t } = useTranslation();
    const currentUser = useSelector(selectCurrentUser);
    const [ticketQuantity, setTicketQuantity] = useState<number>(1);
    const subtotal = parseFloat(price) * ticketQuantity;
    const ticketPrice = getPricePlusPlatformFee(
        price,
        platform_fee_discount_pct
    );
    const total = ticketPrice ? ticketPrice * ticketQuantity : 0;
    const [loading, setLoading] = useState<boolean>(false);
    const fetchPaymentSheetParams = async (subtotal: number) => {
        const { data, error } = await supabase.functions.invoke(
            "create-checkout-session", {
            body: {
                subtotal: subtotal,
                featured_event_id: featured_event_id,
                organizer_id: organizer_id,
                user_id: currentUser.id,
                date: date,
                tickets_sold: tickets_sold,
                ticket_type_id: ticket_type_id,
                chat_room_id: chat_room_id,
                quantity: ticketQuantity
            },
        }
        );
        if (!data || error) {
            Alert.alert(`Error: ${error?.message ?? "no data"}`);
            console.log('Payment failed: ', JSON.stringify(error, null, 2));
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
                handleBookEvent(ticketQuantity);
                return;
            }

            await initializePaymentSheet(amount);
            const { error } = await presentPaymentSheet();
            if (error) {
                console.error(error);
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
                                amount: total.toFixed(2),
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
            console.log('Payment failed :', JSON.stringify(error, null, 2));

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
                    <View className='bg-black w-full p-1 space-y-3 h-1/2' >
                        <View className='p-2'>
                            <Text className='text-white text-xl'>
                                {t('event_checkout.order_summary')}
                            </Text>
                        </View>
                        <View className='flex-row justify-between border-y border-white'>
                            <View className='p-2 py-3   flex '>
                                <Text className='text-white text-lg'>
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
                            <View className='flex-row items-center px-3'>
                                <TouchableOpacity
                                    disabled={ticketQuantity === 1}
                                    className={`{ticketQuantity === 1 && 'opacity-50'}`}
                                    onPress={() =>
                                        setTicketQuantity((prev: number) =>
                                            Math.max(0, prev - 1)
                                        )
                                    }
                                >
                                    <Ionicons
                                        name="remove-circle-outline"
                                        size={28}
                                        color="white"
                                    />
                                </TouchableOpacity>

                                <Text className='text-white text-lg font-semibold mx-3'>
                                    {ticketQuantity}
                                </Text>

                                <TouchableOpacity
                                    disabled={ticketQuantity === 5}
                                    className={`{ticketQuantity === 5 && 'opacity-50'}`}
                                    onPress={() =>
                                        setTicketQuantity((prev: number) => prev + 1)
                                    }
                                >
                                    <Ionicons
                                        name="add-circle"
                                        size={28}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className='mt-4 px-2'>
                            {
                                !is_free && (
                                    <>
                                        <View className='flex-row justify-between items-center mb-'>
                                            <Text className='text-gray-300'>
                                                Subtotal
                                            </Text>

                                            <Text className='text-white'>
                                                {t('event_checkout.currency')}
                                                {(subtotal).toFixed(2)}
                                            </Text>
                                        </View>
                                        <View className='flex-row justify-between items-center mt-1 mb-3'>
                                            <Text className='text-gray-400 text-sm'>
                                                Booking fee
                                            </Text>

                                            <Text className='text-gray-400 text-sm'>
                                                {t('event_checkout.currency')}
                                                {(total - subtotal).toFixed(2)}
                                            </Text>
                                        </View>
                                    </>
                                )
                            }

                            <View className='flex-row justify-between items-center border-t border-white/10 pt-2'>
                                <Text className='text-white font-semibold text-lg'>
                                    Total
                                </Text>

                                <Text className='text-white font-bold text-xl'>
                                    {is_free
                                        ? t('event_checkout.free')
                                        : `${t('event_checkout.currency')}${(total).toFixed(2)}`}
                                </Text>
                            </View>

                        </View>

                        <View className='flex items-center p-5 space-y-5'>
                            <TouchableOpacity
                                disabled={loading}
                                className={`bg-white w-full p-2 rounded-full ${loading && 'opacity-30'}`}
                                onPress={() => openPaymentSheet(subtotal)}>
                                <Text className='text-lg text-center  font-bold'>
                                    {t('event_checkout.purchase')}
                                </Text>
                            </TouchableOpacity>
                            {!is_free &&
                                <PlatformPayButton
                                    setOrderTracking={(
                                        completion: (
                                            orderIdentifier: string,
                                            orderTypeIdentifier: string,
                                            authenticationToken: string,
                                            webServiceUrl: string
                                        ) => void
                                    ) => {
                                        completion("", "", "", "");
                                    }}
                                    disabled={loading}
                                    type={PlatformPay.ButtonType.Pay}
                                    onPress={() => handlePlatformPay(subtotal)}
                                    appearance={Platform.OS === 'ios' ? PlatformPay.ButtonStyle.Black : PlatformPay.ButtonStyle.White}
                                    style={{
                                        width: '100%',
                                        height: 50,
                                        borderColor: Platform.OS === 'ios' ? 'white' : '',
                                        borderWidth: 1,
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
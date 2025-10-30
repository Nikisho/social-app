import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, InputAccessoryView, Button, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import formatDateShortWeekday from '../../../../utils/functions/formatDateShortWeekday';
import extractTimeFromDateSubmit from '../../../../utils/functions/extractTimeFromDateSubmit';
import AntDesign from '@expo/vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import { uuidv4 } from '../../../../utils/functions/uuidv4';
import platformAlert from '../../../../utils/functions/platformAlert';
import DoneKeyboardCloseButton from '../../../../components/DoneKeyboardCloseButton';

type TicketProps = {
    setTickets: any;
    modalVisible: boolean;
    setModalVisible: (bool: boolean) => void;
};


const NewTicketsModal: React.FC<TicketProps> = ({
    modalVisible,
    setModalVisible,
    setTickets
}) => {
    const [openSalesStart, setOpenSalesStart] = useState<boolean>(false);
    const [openSalesEnd, setOpenSalesEnd] = useState<boolean>(false);
    const [ticket, setTicket] = useState({
        id: '',
        is_free: false,
        name: 'General Admission',
        quantity: '',
        price: null,
        description: '',
        sales_start: new Date((new Date()).setHours(12, 0, 0, 0)),
        sales_end: new Date((new Date()).setHours(12, 0, 0, 0)),
    });

    const handleSaveTicket = () => {

        if (Number(ticket.quantity) <= 4) {
            platformAlert('The available quantity must be at least 5');
            return;
        }
        if (Number(ticket.price) < 3 && !ticket.is_free) {
            platformAlert('Paid tickets must cost at least £3');
            return;
        }
        if (ticket.sales_start >= ticket.sales_end) {
            platformAlert('Sales start date must be before sales end date');
            return;
        }

        if (ticket.sales_start <= new Date(Date.now() - 86400000)) {
            platformAlert('The sales start date cannot be in the past');
            return;
        }

        const newTicket = {
            ...ticket,
            id: uuidv4(4),
        };

        setTickets((prev: any) => [...prev, newTicket]);
        setModalVisible(false);

        setTicket({
            id: '',
            is_free: false,
            name: 'General Admission',
            description: '',
            quantity: '0',
            price: null,
            sales_start: new Date((new Date()).setHours(12, 0, 0, 0)),
            sales_end: new Date((new Date()).setHours(12, 0, 0, 0)),
        });
    };

    const calculateRevenue = (price: string) => {
        const platformFeeRate = 0;
        const priceNum = Number(price);
        const stripeFee = priceNum * 0.015 + 0.2;
        const platformFee = priceNum * platformFeeRate;
        const revenue = priceNum - stripeFee - platformFee;

        return revenue.toFixed(2);
    };
    const inputAccessoryViewID = 'uniqueID';

    return (
        <Modal
            animationType='slide'
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false)
            }}
        >
            <View className='flex-1 justify-end itemscitems-center shadow-xl py-10 mx-5'>
                <ScrollView className='w-full m-8 self-center '>
                    <View className={`mb-5`} >
                        <Text className='text-2xl font-semibold '>
                            New ticket
                        </Text>

                    </View>

                    <View className='flex flex-row space-x-4 my-2 justif-center'>
                        <TouchableOpacity
                            onPress={() => setTicket((prevData: any) => ({
                                ...prevData,
                                is_free: false
                            }))}
                            className={`p-4 flex grow items-center `}
                            style={{
                                borderWidth: 0.3,
                                borderColor: ticket.is_free ? '#000000' : 'blue',
                            }}
                        >
                            <Text className={`font-semibold ${!ticket.is_free && 'text-blue-500'}`}>
                                Paid
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setTicket((prevData: any) => ({
                                ...prevData,
                                is_free: true,
                                price: '0'
                            }))}
                            className='p-4 flex  grow items-center  '
                            style={{
                                borderWidth: 0.3,
                                borderColor: !ticket.is_free ? '#000000' : 'blue',
                            }}
                        >
                            <Text className={`font-semibold ${ticket.is_free && 'text-blue-500'}`}>
                                Free
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <View className='border my-6'>
                        <Text className='font-semibold mt-3 px-5'>
                            Name
                            <Text className='text-red-400'> *  </Text>
                        </Text>

                        <TextInput
                            value={ticket.name}
                            placeholder='Add a title for your ticket'
                            maxLength={30}
                            onChangeText={(value) => {
                                setTicket((prevData: any) => ({
                                    ...prevData,
                                    name: value
                                }))
                            }}
                            className=' h-10 px-5'
                        />
                    </View>

                    <View className='border mb-6'>
                        <Text className='font-semibold mt-3 px-5'>
                            Description
                            <Text className='text-red-400'> *  </Text>
                        </Text>


                        <TextInput
                            value={ticket.description}
                            inputAccessoryViewID={inputAccessoryViewID}
                            multiline
                            placeholder='Add a description for your ticket'
                            maxLength={100}
                            onChangeText={(value) => {
                                setTicket((prevData: any) => ({
                                    ...prevData,
                                    description: value
                                }))
                            }}
                            className=' h-16 px-5'
                        />
                        <DoneKeyboardCloseButton
                            inputAccessoryViewID={inputAccessoryViewID}
                        />
                    </View>
                    <View className='border my-'>
                        <Text className='font-semibold mt-3 px-5'>
                            Available Quantity
                            <Text className='text-red-400'> *  </Text>
                        </Text>

                        <TextInput
                            value={ticket.quantity}
                            placeholder='20'
                            keyboardType='numeric'
                            maxLength={5}
                            returnKeyType='done'
                            onChangeText={(value) => {
                                setTicket((prevData: any) => ({
                                    ...prevData,
                                    quantity: (value.replace(/[^0-9]/g, '')).replace(/^0+/, '')
                                }))
                            }}
                            className=' h-10 px-5'
                        />
                    </View>

                    <View className={` border mt-6 ${ticket.is_free ? 'opacity-30' : 'opacity-1'}`}>

                        <Text className='font-semibold mt-3 px-5'>
                            Price
                            <Text className='text-red-400'> *  </Text>
                        </Text>

                        <TextInput
                            value={ticket.price!}
                            editable={!ticket.is_free}
                            returnKeyType='done'
                            placeholder='£0.00'
                            keyboardType='numeric'
                            maxLength={10}
                            onChangeText={(value) => {
                                setTicket((prevData: any) => ({
                                    ...prevData,
                                    price: value
                                        .replace(/[^\d.,]/g, "")        // remove non-numeric, non-decimal chars
                                        .replace(/^0+(?=\d)/, "")
                                        .replace(/^(\d*(?:\.\d{0,2})?).*$/, "$1")
                                }))
                            }}
                            className=' h-10 px-5'
                        />
                    </View>
                    {
                        !ticket.is_free &&
                        <View className='flex-row -6 items-center space-x-4 px-2 py-1 bg-amber-100 border border-amber-500 '>
                            <Text className=''>You’ll receive the ticket price minus Stripe’s processing fee (1.5% + 20p). {ticket.price && Number(ticket.price) >= 1 ? `Total per ticket: £${calculateRevenue(ticket.price)}` : ''}</Text>
                        </View>
                    }
                    <View className='border px-5 my-6 space-y-4'>
                        <Text className='font-semibold mt-3 '>
                            Sales start
                            <Text className='text-red-400'> *  </Text>
                        </Text>

                        <TouchableOpacity onPress={() => setOpenSalesStart(true)}
                            // style={styles.translucidViewStyle}
                            className='justify-between  flex items-center space-x-2 flex-row   mb-3'>
                            <View className=' flex flex-row space-x-2 items-center'>
                                <AntDesign name="calendar" size={23} color="black" />
                                <Text className='text-'>
                                    {formatDateShortWeekday(ticket.sales_start)}
                                </Text>
                            </View>
                            <View className='flex flex-row space-x-2 items-center'>

                                <AntDesign name="clockcircleo" size={24} color="black" />
                                <Text className='text-'>
                                    {extractTimeFromDateSubmit(ticket.sales_start)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View className='border px-5  space-y-4'>
                        <Text className='font-semibold mt-3 '>
                            Sales end
                            <Text className='text-red-400'> *  </Text>
                        </Text>

                        <TouchableOpacity onPress={() => setOpenSalesEnd(true)}
                            // style={styles.translucidViewStyle}
                            className='justify-between  flex items-center space-x-2 flex-row   mb-3'>
                            <View className=' flex flex-row space-x-2 items-center'>
                                <AntDesign name="calendar" size={23} color="black" />
                                <Text className='text-'>
                                    {formatDateShortWeekday(ticket.sales_end)}
                                </Text>
                            </View>
                            <View className='flex flex-row space-x-2 items-center'>

                                <AntDesign name="clockcircleo" size={24} color="black" />
                                <Text className='text-'>
                                    {extractTimeFromDateSubmit(ticket.sales_end)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        className='flex flex-row my-6 justify-center space-x-2 '>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className='px-4 p-3  grow border-2 border-red-500 '>
                            <Text className='text-lg text-center font-semibold text-red-500 '>
                                Discard
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSaveTicket}
                            className='px-4 p-3 grow border-2 border-blue-500 '>
                            <Text className='text-lg text-center font-semibold text-blue-500 '>
                                Save ticket
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <DatePicker
                        modal
                        open={openSalesStart}
                        date={ticket.sales_start}
                        onConfirm={(date: Date) => {
                            setOpenSalesStart(false)
                            setTicket((prevData: any) => ({
                                ...prevData,
                                sales_start: date
                            }))
                        }}
                        onCancel={() => {
                            setOpenSalesStart(false)
                        }}
                    />
                    <DatePicker
                        modal
                        open={openSalesEnd}
                        date={ticket.sales_end}
                        onConfirm={(date: Date) => {
                            setOpenSalesEnd(false)
                            setTicket((prevData: any) => ({
                                ...prevData,
                                sales_end: date
                            }))
                        }}
                        onCancel={() => {
                            setOpenSalesEnd(false)
                        }}
                    />
                </ScrollView >
            </View >
        </Modal >
    )
}

export default NewTicketsModal

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        minHeight: 120,
        margin: 20,
    },
    accessory: {
        backgroundColor: '#f7f7f7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignItems: 'flex-end',
    },
});
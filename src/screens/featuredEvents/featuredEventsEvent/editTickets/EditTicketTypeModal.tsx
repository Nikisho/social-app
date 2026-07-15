import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import DatePicker from 'react-native-date-picker'
import AntDesign from '@expo/vector-icons/AntDesign';
import formatDateShortWeekday from '../../../../utils/functions/formatDateShortWeekday';
import extractTimeFromDateSubmit from '../../../../utils/functions/extractTimeFromDateSubmit';
import { supabase } from '../../../../../supabase';
import platformAlert from '../../../../utils/functions/platformAlert';

interface EditTicketTypeModalProps {
    modalVisible: boolean
    setModalVisible: (bool:boolean) => void
    ticket: any
    setTicket: (ticket: any) => void
    fetchTicketTypes: () => void;
}

const EditTicketTypeModal = ({
    modalVisible,
    setModalVisible,
    ticket,
    setTicket,
    fetchTicketTypes
}: EditTicketTypeModalProps) => {
    const [openSalesStart, setOpenSalesStart] = useState<boolean>(false);
    const [openSalesEnd, setOpenSalesEnd] = useState<boolean>(false);
    const handleSaveTicket = async () => {

        if (!ticket.is_free && ticket.price === '0') {
            platformAlert('Please select a price');
            return;
        }

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

        setModalVisible(false);
        const { error } = await supabase
            .from('ticket_types')
            .update({
                name: ticket.name,
                description: ticket.description,
                is_free: ticket.price === '0' || ticket.is_free ? true : false,
                price: ticket.price,
                quantity: ticket.quantity,
                sales_start: ticket.sales_start,
                sales_end: ticket.sales_end
            })
            .eq('ticket_type_id', ticket.ticket_type_id);
        if (error) {
            console.error(error.message)
        };
        fetchTicketTypes();
        platformAlert('Ticket type details changed.')
    };

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1 bg-zinc-100">
                {/* Header */}
                <View className="px-6 pt-16 pb-5 bg-white rounded-b-[30px]">
                    <View className="flex-row justify-between items-center">

                        <View>
                            <Text className="text-3xl font-bold">
                                Edit ticket
                            </Text>

                            <Text className="text-zinc-500 mt-1">
                                Update availability and pricing
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="w-10 h-10 rounded-full bg-zinc-100 items-center justify-center"
                        >
                            <AntDesign name="close" size={18} />
                        </TouchableOpacity>

                    </View>
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        padding: 20,
                        paddingBottom: 150,
                    }}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* Ticket Type */}
                    <View className="bg-white rounded-3xl p-2 flex-row mb-5">

                        <TouchableOpacity
                            onPress={() =>
                                setTicket((p: any) => ({
                                    ...p,
                                    is_free: false,
                                }))
                            }
                            className={`flex-1 rounded-2xl py-4 items-center ${!ticket.is_free
                                ? "bg-blue-600"
                                : ""
                                }`}
                        >
                            <Text
                                className={`font-semibold ${!ticket.is_free
                                    ? "text-white"
                                    : "text-zinc-600"
                                    }`}
                            >
                                Paid
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                setTicket((p: any) => ({
                                    ...p,
                                    is_free: true,
                                    price: "0",
                                }))
                            }
                            className={`flex-1 rounded-2xl py-4 items-center ${ticket.is_free
                                ? "bg-blue-600"
                                : ""
                                }`}
                        >
                            <Text
                                className={`font-semibold ${ticket.is_free
                                    ? "text-white"
                                    : "text-zinc-600"
                                    }`}
                            >
                                Free
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* Main Form */}
                    <View className="bg-white rounded-3xl p-3 space-y-1">
                        <Text>Title</Text>
                        {/* <Field label="Title"> */}
                        <TextInput
                            value={ticket.name}
                            placeholder="General Admission"
                            maxLength={30}
                            onChangeText={(name) =>
                                setTicket((p: any) => ({
                                    ...p,
                                    name,
                                }))
                            }
                            className="text-base pb-2"
                        />

                        <Text>Description</Text>
                        <TextInput
                            multiline
                            value={ticket.description}
                            maxLength={100}
                            // inputAccessoryViewID={inputAccessoryViewID}
                            onChangeText={(description) =>
                                setTicket((p: any) => ({
                                    ...p,
                                    description,
                                }))
                            }
                            className=" min-h-[90] "
                        />
                        {/* </Field> */}

                        <View className="flex-row gap-3">
                            <View className='flex-1'>
                                <Text className=''>Quantity</Text>

                                <View className="flex-1">
                                    {/* <Field label="Quantity"> */}
                                    <TextInput
                                        keyboardType="numeric"
                                        value={String(ticket.quantity)}
                                        onChangeText={(v) =>
                                            setTicket((p: any) => ({
                                                ...p,
                                                quantity: v
                                                    .replace(/[^\d]/g, "")
                                                    .replace(/^0+/, ""),
                                            }))
                                        }
                                        className="py-4"
                                    />
                                    {/* </Field> */}
                                </View>
                            </View>

                            <View
                                className={`flex-1 ${ticket.is_free
                                    ? "opacity-40"
                                    : ""
                                    }`}
                            >
                                <Text className=''>Price</Text>
                                <View className="flex-row items-center">

                                    <Text className="text-lg mr-2">
                                        £
                                    </Text>

                                    <TextInput
                                        editable={!ticket.is_free}
                                        keyboardType="numeric"
                                        value={ticket.price}
                                        onChangeText={(v) =>
                                            setTicket((p: any) => ({
                                                ...p,
                                                price: v
                                                    .replace(/[^\d.]/g, "")
                                                    .replace(
                                                        /^(\d*(?:\.\d{0,2})?).*$/,
                                                        "$1"
                                                    ),
                                            }))
                                        }
                                        className="flex-1 py-4"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Dates */}
                    <View className="bg-white rounded-3xl p-5 mt-5">
                        <View className="bg-white rounded-3xl p-5 mt-5">
                            {/* Sales Start */}
                            <TouchableOpacity
                                onPress={() => setOpenSalesStart(true)}
                                className="flex-row justify-between items-center"
                            >
                                <View>
                                    <Text className="font-semibold mb-1">
                                        Sales start
                                        <Text className="text-red-500">
                                            {" "}*
                                        </Text>
                                    </Text>

                                    <Text className="text-zinc-500">
                                        {formatDateShortWeekday(ticket.sales_start)}
                                    </Text>
                                </View>
                                <View className="flex-row items-center space-x-2">

                                    <Text className="text-zinc-800">
                                        {extractTimeFromDateSubmit(ticket.sales_start)}
                                    </Text>

                                    <AntDesign
                                        name="calendar"
                                        size={18}
                                        color="#52525B"
                                    />
                                </View>
                            </TouchableOpacity>

                            <View className="h-[1] bg-zinc-100 my-5" />

                            {/* Sales End */}
                            <TouchableOpacity
                                onPress={() => setOpenSalesEnd(true)}
                                className="flex-row justify-between items-center"
                            >
                                <View>
                                    <Text className="font-semibold mb-1">
                                        Sales end
                                        <Text className="text-red-500">
                                            {" "}*
                                        </Text>
                                    </Text>

                                    <Text className="text-zinc-500">
                                        {formatDateShortWeekday(ticket.sales_end)}
                                    </Text>
                                </View>
                                <View className="flex-row items-center space-x-2">

                                    <Text className="text-zinc-800">
                                        {extractTimeFromDateSubmit(ticket.sales_end)}
                                    </Text>
                                    <AntDesign
                                        name="calendar"
                                        size={18}
                                        color="#52525B"
                                    />

                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </ScrollView>
                {/* Bottom Actions */}
                <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-4 pb-10 border-t border-zinc-200">
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="flex-1 py-4 rounded-2xl bg-zinc-100"
                        >
                            <Text className="text-center font-semibold">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSaveTicket}
                            className="flex-1 py-4 rounded-2xl bg-blue-600"
                        >
                            <Text className="text-center text-white font-semibold">
                                Save changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <DatePicker
                    modal
                    open={openSalesStart}
                    date={new Date(ticket.sales_start)}
                    onConfirm={(date) => {
                        setOpenSalesStart(false)

                        setTicket((p: any) => ({
                            ...p,
                            sales_start: date,
                        }))
                    }}
                    onCancel={() => setOpenSalesStart(false)}
                />

                <DatePicker
                    modal
                    open={openSalesEnd}
                    date={new Date(ticket.sales_end)}
                    onConfirm={(date) => {
                        setOpenSalesEnd(false)

                        setTicket((p: any) => ({
                            ...p,
                            sales_end: date,
                        }))
                    }}
                    onCancel={() => setOpenSalesEnd(false)}
                />
            </View>
        </Modal>
    )
}

export default EditTicketTypeModal
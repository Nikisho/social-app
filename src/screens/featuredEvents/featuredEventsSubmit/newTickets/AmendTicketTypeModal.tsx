
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';

import DatePicker from 'react-native-date-picker';
import { AntDesign } from '@expo/vector-icons';
import DoneKeyboardCloseButton from '../../../../components/DoneKeyboardCloseButton';

interface TicketsProps {
    name: string;
    description?: string;
    is_free: boolean;
    price: number;
    quantity: number;
    sales_start: Date;
    sales_end: Date;
    id: number;
}

interface AmendTicketTypeModalProps {
    modalVisible: boolean;
    setModalVisible: (bool: boolean) => void;
    item: TicketsProps;
    onSave: (ticket: TicketsProps) => void | Promise<void>;
}

const AmendTicketTypeModal = ({
    modalVisible,
    setModalVisible,
    item,
    onSave,
}: AmendTicketTypeModalProps) => {
    console.log(item)
    
    const [ticket, setTicket] = useState({
        ...item,
        id: item.id,
        name: item.name ?? '',
        description: item.description ?? '',
        is_free: item.is_free,
        price: String(item.price ?? 0),
        quantity: String(item.quantity ?? 0),
        sales_start: new Date(item.sales_start),
        sales_end: new Date(item.sales_end),
    });

    const [openSalesStart, setOpenSalesStart] = useState(false);
    const [openSalesEnd, setOpenSalesEnd] = useState(false);
    const [saving, setSaving] = useState(false);

    const inputAccessoryViewID = 'amendTicketInput';

    // Populate the form whenever the selected ticket/modal changes.
    useEffect(() => {
        if (modalVisible) {
            setTicket({
                ...item,
                name: item.name ?? '',
                description: item.description ?? '',
                price: String(item.price ?? 0),
                quantity: String(item.quantity ?? 0),
                sales_start: new Date(item.sales_start),
                sales_end: new Date(item.sales_end),
            });
        }
    }, [modalVisible, item]);

    const updateTicket = (field: string, value: any) => {
        setTicket((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const formatDateShortWeekday = (date: Date) => {
        return date.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const extractTimeFromDateSubmit = (date: Date) => {
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSaveTicket = async () => {
        const quantity = Number(ticket.quantity);
        const price = ticket.is_free ? 0 : Number(ticket.price);

        if (!ticket.name.trim()) {
            Alert.alert('Missing title', 'Please enter a ticket title.');
            return;
        }

        if (!ticket.quantity || !Number.isInteger(quantity) || quantity < 1) {
            Alert.alert('Invalid quantity', 'Please enter a valid ticket quantity.');
            return;
        }

        if (!ticket.is_free && (!Number.isFinite(price) || price < 0)) {
            Alert.alert('Invalid price', 'Please enter a valid ticket price.');
            return;
        }

        if (ticket.sales_end <= ticket.sales_start) {
            Alert.alert(
                'Invalid sales dates',
                'Sales end must be after sales start.'
            );
            return;
        }

        const amendedTicket: TicketsProps = {
            id: item.id,
            name: ticket.name.trim(),
            description: ticket.description.trim(),
            is_free: ticket.is_free,
            price,
            quantity,
            sales_start: ticket.sales_start,
            sales_end: ticket.sales_end,
        };

        try {
            setSaving(true);
            await onSave(amendedTicket);
            setModalVisible(false);
        } catch (error) {
            console.error('Error amending ticket:', error);
            Alert.alert('Error', 'Unable to save ticket changes.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1 justify-end items-center py-10 mx-5">

                <ScrollView
                    className="w-full m-8 self-center"
                    keyboardShouldPersistTaps="handled"
                >

                    <View className="mb-5">
                        <Text className="text-2xl font-semibold">
                            Amend ticket
                        </Text>
                    </View>

                    {/* Free / Paid */}
                    <View className="flex flex-row space-x-4 my-2">

                        <TouchableOpacity
                            onPress={() => updateTicket('is_free', false)}
                            className="p-4 flex-1 items-center"
                            style={{
                                borderWidth: 0.3,
                                borderColor: !ticket.is_free ? 'blue' : '#000000',
                            }}
                        >
                            <Text className={`font-semibold ${!ticket.is_free ? 'text-blue-500' : ''}`}>
                                Paid
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setTicket((prev) => ({
                                    ...prev,
                                    is_free: true,
                                    price: '0',
                                }));
                            }}
                            className="p-4 flex-1 items-center"
                            style={{
                                borderWidth: 0.3,
                                borderColor: ticket.is_free ? 'blue' : '#000000',
                            }}
                        >
                            <Text className={`font-semibold ${ticket.is_free ? 'text-blue-500' : ''}`}>
                                Free
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/* Title */}
                    <View className="border my-6">
                        <Text className="font-semibold mt-3 px-5">
                            Title <Text className="text-red-400">*</Text>
                        </Text>

                        <TextInput
                            value={ticket.name}
                            placeholder="Add a title for your ticket"
                            maxLength={30}
                            onChangeText={(value) => updateTicket('name', value)}
                            className="h-10 px-5"
                        />
                    </View>

                    {/* Description */}
                    <View className="border mb-6">
                        <Text className="font-semibold mt-3 px-5">
                            Description
                        </Text>

                        <TextInput
                            value={ticket.description}
                            inputAccessoryViewID={inputAccessoryViewID}
                            multiline
                            placeholder="Add a description for your ticket"
                            maxLength={100}
                            onChangeText={(value) => updateTicket('description', value)}
                            className="h-16 px-5"
                        />

                        <DoneKeyboardCloseButton
                            inputAccessoryViewID={inputAccessoryViewID}
                        />
                    </View>

                    {/* Quantity */}
                    <View className="border">
                        <Text className="font-semibold mt-3 px-5">
                            Available Quantity <Text className="text-red-400">*</Text>
                        </Text>

                        <TextInput
                            value={ticket.quantity}
                            placeholder="20"
                            keyboardType="numeric"
                            maxLength={5}
                            returnKeyType="done"
                            onChangeText={(value) => {
                                updateTicket(
                                    'quantity',
                                    value.replace(/[^0-9]/g, '').replace(/^0+/, '')
                                );
                            }}
                            className="h-10 px-5"
                        />
                    </View>

                    {/* Price */}
                    <View className={`border mt-6 ${ticket.is_free ? 'opacity-30' : ''}`}>
                        <Text className="font-semibold mt-3 px-5">
                            Price <Text className="text-red-400">*</Text>
                        </Text>

                        <TextInput
                            value={ticket.price}
                            editable={!ticket.is_free}
                            returnKeyType="done"
                            placeholder="£0.00"
                            keyboardType="decimal-pad"
                            maxLength={10}
                            onChangeText={(value) => {
                                let formatted = value.replace(/[^\d.]/g, '');

                                // Allow only one decimal point.
                                const parts = formatted.split('.');
                                if (parts.length > 2) {
                                    formatted = `${parts[0]}.${parts.slice(1).join('')}`;
                                }

                                // Restrict to two decimal places.
                                const [whole, decimal] = formatted.split('.');
                                if (decimal !== undefined) {
                                    formatted = `${whole}.${decimal.slice(0, 2)}`;
                                }

                                updateTicket('price', formatted);
                            }}
                            className="h-10 px-5"
                        />
                    </View>

                    {/* Sales Start */}
                    <View className="border px-5 my-6 space-y-4">
                        <Text className="font-semibold mt-3">
                            Sales start <Text className="text-red-400">*</Text>
                        </Text>

                        <TouchableOpacity
                            onPress={() => setOpenSalesStart(true)}
                            className="justify-between flex items-center flex-row mb-3"
                        >
                            <View className="flex flex-row space-x-2 items-center">
                                <AntDesign name="calendar" size={23} color="black" />
                                <Text>
                                    {formatDateShortWeekday(ticket.sales_start)}
                                </Text>
                            </View>

                            <View className="flex flex-row space-x-2 items-center">
                                <AntDesign name="clockcircleo" size={24} color="black" />
                                <Text>
                                    {extractTimeFromDateSubmit(ticket.sales_start)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Sales End */}
                    <View className="border px-5 space-y-4">
                        <Text className="font-semibold mt-3">
                            Sales end <Text className="text-red-400">*</Text>
                        </Text>

                        <TouchableOpacity
                            onPress={() => setOpenSalesEnd(true)}
                            className="justify-between flex items-center flex-row mb-3"
                        >
                            <View className="flex flex-row space-x-2 items-center">
                                <AntDesign name="calendar" size={23} color="black" />
                                <Text>
                                    {formatDateShortWeekday(ticket.sales_end)}
                                </Text>
                            </View>

                            <View className="flex flex-row space-x-2 items-center">
                                <AntDesign name="clockcircleo" size={24} color="black" />
                                <Text>
                                    {extractTimeFromDateSubmit(ticket.sales_end)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Actions */}
                    <View className="flex flex-row my-6 justify-center space-x-2">

                        <TouchableOpacity
                            disabled={saving}
                            onPress={() => setModalVisible(false)}
                            className="px-4 p-3 flex-1 border-2 border-red-500"
                        >
                            <Text className="text-lg text-center font-semibold text-red-500">
                                Discard
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={saving}
                            onPress={handleSaveTicket}
                            className="px-4 p-3 flex-1 border-2 border-blue-500"
                        >
                            {saving ? (
                                <ActivityIndicator color="blue" />
                            ) : (
                                <Text className="text-lg text-center font-semibold text-blue-500">
                                    Save ticket
                                </Text>
                            )}
                        </TouchableOpacity>

                    </View>

                </ScrollView>

                {/* Date pickers */}
                <DatePicker
                    modal
                    open={openSalesStart}
                    date={ticket.sales_start}
                    mode="datetime"
                    onConfirm={(date: Date) => {
                        setOpenSalesStart(false);
                        updateTicket('sales_start', date);
                    }}
                    onCancel={() => setOpenSalesStart(false)}
                />

                <DatePicker
                    modal
                    open={openSalesEnd}
                    date={ticket.sales_end}
                    mode="datetime"
                    onConfirm={(date: Date) => {
                        setOpenSalesEnd(false);
                        updateTicket('sales_end', date);
                    }}
                    onCancel={() => setOpenSalesEnd(false)}
                />

            </View>
        </Modal>
    );
};

export default AmendTicketTypeModal;

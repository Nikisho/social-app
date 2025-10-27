import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler';
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday';
import extractTimeFromDate from '../../../utils/functions/extractTimeFromDate';
import extractTimeFromDateSubmit from '../../../utils/functions/extractTimeFromDateSubmit';


interface ticket_type_props {
    name: string;
    price: string;
    is_free: boolean;
    ticket_type_id: number
    quantity: number;
    tickets_sold: number
    organizer_id: number;
    sales_start: Date;
    description: string;
    sales_end: Date;
}
interface TicketTypeModalProps {
    modalVisible: boolean;
    setModalVisible: (bool: boolean) => void;
    setSelectedTicket: (item: ticket_type_props) => void
    ticket_types: ticket_type_props[]
    setBookEventModalVisible: (bool: boolean) => void;
}

const TicketTypeModal: React.FC<TicketTypeModalProps> = ({
    modalVisible,
    setModalVisible,
    setSelectedTicket,
    setBookEventModalVisible,
    ticket_types
}) => {


    const renderItem = ({ item }: { item: ticket_type_props }) => {
        const handleSelectTicket = (item: ticket_type_props) => {
            setSelectedTicket(item);
            setBookEventModalVisible(true);
        }
        const isSoldOut = item.quantity <= item.tickets_sold;
        const now = new Date();
        const hasSalesEnded = new Date(item.sales_end).getTime() <= now.getTime();
        const salesNotStarted = new Date(item.sales_start).getTime() > now.getTime();
        console.log(now.getTime())
        return (
            <TouchableOpacity
                disabled={isSoldOut || hasSalesEnded || salesNotStarted}
                onPress={() => handleSelectTicket(item)}
                className={`bg-white p-4 mt-3 mx-2 rounded-xl border border-gray-200 ${(isSoldOut || hasSalesEnded || salesNotStarted) && 'opacity-50'
                    }`}
            >
                {/* Header Row */}
                <View className="flex flex-row justify-between items-center">
                    <Text className="font-semibold text-lg text-gray-900">
                        {item.name}
                    </Text>

                    {hasSalesEnded ? (
                        <Text className="text-lg font-medium text-gray-900">Sales ended</Text>
                    ) : isSoldOut ? (
                        <Text className={`text-lg font-medium ${Platform.OS === 'ios' ? 'text-red-500' : ''}`}>Sold out</Text>
                    ) : item.is_free ? (
                        <Text className="text-lg font-medium">Free</Text>
                    ) : (
                        <Text className="text-lg font-medium text-gray-800">£{item.price}</Text>
                    )}
                </View>

                {/* Description */}
                {!item.description ? (
                    <Text
                        className="text-sm mt-2" numberOfLines={3}>
                        {item.description}
                    </Text>
                ) : (
                    <Text className={` ${Platform.OS === 'ios' ? 'text-gray-400' : 'text-gray-900'} text-sm mt-2 italic`}>
                        No description provided
                    </Text>
                )}

                {/* Quantity / availability */}
                <View className="mt-2 flex flex-row justify-between">
                    {/* <Text className="text-xs text-gray-500">
                        {item.tickets_sold}/{item.quantity} sold
                    </Text> */}
                    <View>
                        {
                            salesNotStarted &&
                            <Text className="text font-medium text-gray-900">Sales starts on {formatDateShortWeekday(item.sales_start)} at {extractTimeFromDateSubmit(item.sales_start)}</Text>
                        }

                        <Text className="text-xs">
                            {/* Ends {new Date(item.sales_end).toLocaleDateString()} */}
                            Ends {formatDateShortWeekday(item.sales_end)}
                        </Text>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }
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
                            <Text className=' text-xl'>

                            </Text>
                        </View>
                        <FlatList
                            contentContainerStyle={{
                                paddingBottom: 100
                            }}
                            data={ticket_types}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.ticket_type_id.toString()}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
}

export default TicketTypeModal
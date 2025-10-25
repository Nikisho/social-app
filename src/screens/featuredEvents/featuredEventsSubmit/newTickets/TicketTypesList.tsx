import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import NewTicketsModal from './NewTicketModal';
import formatDateShortWeekday from '../../../../utils/functions/formatDateShortWeekday';


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
interface TicketTypesListProps {
    tickets: TicketsProps[];
    setTickets: (tickets: TicketsProps[]) => void

}
const TicketTypesList: React.FC<TicketTypesListProps> = ({
    tickets,
    setTickets
}) => {
    const [newTicketModalVisible, setNewTicketModalVisible] = useState<boolean>(false);

    const handleRemove = (item: TicketsProps) => {
        const newArray = tickets.filter((t) => t.id !== item.id);
        setTickets(newArray);
    };

    const renderItem = ({ item }: { item: TicketsProps }) => {
        return (
            <View
                className='bg-gray-100 p-4 mt-2'>
                <View className='flex flex-row justify-between'>
                    <Text className='font-bold'>
                        {item.name}
                    </Text>
                    {
                        !item.is_free &&
                        <Text>
                            £{item.price}
                        </Text>
                    }
                </View>
                <View className='flex flex-row my-2 justify-between'>
                    <View>

                        <Text>
                            Available Quantity
                        </Text>
                        <Text className='font-semibold'>
                            {item.quantity}
                        </Text>
                    </View>

                    {
                        item.is_free ?
                            <Text>
                                Free
                            </Text> :
                            <Text>
                                Paid
                            </Text>
                    }
                </View>

                <View className='space-y-1 my-3'>
                    <Text>
                        Sales start on <Text className='font-semibold'>{formatDateShortWeekday(item.sales_start)}</Text>
                    </Text>

                    <Text>
                        Sales end  on <Text className='font-semibold'>{formatDateShortWeekday(item.sales_end)}</Text>
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleRemove(item)}
                    className='border p-1 w-20 my-2 bg-black'>
                    <Text className='text-center text-white font-semibold' > Remove</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View className='mx-4 mb-4'>
            <View className={`mb-5`} >
                <Text className='text-2xl font-semibold '>
                    Tickets
                </Text>
            </View>
            <FlatList
                ListHeaderComponent={(tickets?.length <= 3) ?
                    <TouchableOpacity
                        onPress={() => setNewTicketModalVisible(true)}
                        className='bg-gray-100 p-7 mt-2 flex flex-row items-center'>
                        <AntDesign name="plus" size={20} color="black" />
                        <Text className='mx-10 font-bold text-center'>
                            Tap to add tickets
                        </Text>

                    </TouchableOpacity> :
                    <></>
                }
                contentContainerStyle={{ paddingBottom: 400 }}
                data={tickets}
                renderItem={renderItem}
                keyExtractor={(item: TicketsProps) => item.id.toString()}
            />
            <NewTicketsModal
                modalVisible={newTicketModalVisible}
                setModalVisible={setNewTicketModalVisible}
                setTickets={setTickets}
            />
        </View>
    )
}

export default TicketTypesList
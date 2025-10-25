import React, { useState } from 'react';
import { View, Text, Platform, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import styles from '../../../../utils/styles/shadow';
import { supabase } from '../../../../../supabase';
import { FlatList } from 'react-native-gesture-handler';

type TicketTypeProps = {
  name: string;
  price: string;
  quantity: number;
  tickets_sold: number;
  ticket_type_id: number;
  is_free: boolean;
  description: string;
}

type TicketStatsBannerProps = {
  ticket_types: TicketTypeProps[]
};

const TicketStatsBanner: React.FC<TicketStatsBannerProps> = ({ ticket_types }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: TicketTypeProps }) => {
    const percentage = Math.round((item.tickets_sold / item.quantity) * 100);
    return (
      <View className="m-2 p-4 bg-white rounded-2xl shadow-sm flex flex-row justify-between items-center">
        {/* Left: Ticket info */}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>

          <View className="flex flex-row space-x-2 mt-1">
            <Text className="text-gray-600">Sold:</Text>
            <Text className="font-medium text-gray-800">
              {item.tickets_sold}/{item.quantity}
            </Text>
          </View>

          <View className="flex flex-row space-x-2 mt-1">
            <Text className="text-gray-600">Price:</Text>
            {Number(item.price) === 0 || item.is_free ? (
              <Text className="font-medium text-green-600">Free</Text>
            ) : (
              <Text className="font-medium text-gray-800">£{item.price}</Text>
            )}
          </View>

          <View className='my-3'>
            <Text className='font-semibold'>Description: </Text>
            {item?.description ? (
              <Text className="text-sm text-gray-600 mt-1">
                {item.description}
              </Text>
            ) : <Text className='italic'>No description provided</Text>}
          </View>
        </View>

        {/* Right: Progress pill */}
        <View className="bg-gray-100 h-8 rounded-full px-4 self-start ustify-center items-center min-w-[80px]">
          <Text className="text-gray-800 font-semibold text-sm">{percentage}% full</Text>
        </View>
      </View>

    )
  }
  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        style={Platform.OS === 'ios' ? styles.shadow : { borderWidth: 1 }}
        className="bg-white mt-4 rounded-2xl p-4 flex-row items-center justify-between">
        <View>
          <Text className="text-black/70 text-base font-semibold">Tickets & Sales</Text>
          <Text className="text-black text-lg font-bold">
            {/* {sold} / {max} */}
            See more
          </Text>
        </View>


      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          className='flex-1 mt-20 ' >
          <View className='bg-gray-50 my-20 mx-5 h-3/4' style={styles.shadow} >

            <FlatList
              data={ticket_types}
              renderItem={renderItem}
              keyExtractor={(item) => item.ticket_type_id.toString()}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              className="m-5 bg-black rounded-xl p-3 active:opacity-80"
            >
              <Text className="text-center text-white font-semibold text-base">
                Close
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </>
  );
};

export default TicketStatsBanner

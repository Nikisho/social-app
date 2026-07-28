import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import styles from '../../../../utils/styles/shadow';
import { FlatList } from 'react-native-gesture-handler';
import ManageEventBannerComponent from '../../../../components/ManageEventBannerComponent';

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
  const totalSold = ticket_types?.reduce((sum, t) => sum + t.tickets_sold, 0);
  const totalAmount = ticket_types?.reduce((sum, t) => sum + (Number(t.price) * t.tickets_sold), 0);

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
        <View className="bg-gray-100 h-8 rounded-full px-4 self-start justify-center items-center min-w-[80px]">
          <Text className="text-gray-800 font-semibold text-sm">{percentage}% full</Text>
        </View>
      </View>

    )
  }
  return (
    <>
      
      <ManageEventBannerComponent
          onPress={() => setModalVisible(!modalVisible)}
          title='Tickets & Sales'
          description='See more'
        />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          className='flex-1 justify-center ' >
          <View className='bg-gray-50 mx-5 h-3/4' style={styles.shadow} >
          <View className='my-6'>
              {/* <Text className='text-center text-xl font-bold my-4'>Ticket sales</Text> */}
              <View className='flex-row justify-around '>
                <View className='items-center'>
                  <Text className='text-gray-600'>Total sold</Text>
                  <Text className='font-semibold text-lg'>{totalSold}</Text>
                </View>
                <View className='items-center'>
                  <Text className='text-gray-600'>Total amount</Text>
                  <Text className='font-semibold text-lg'>£{totalAmount?.toFixed(2)}</Text>
                </View>
              </View>
          </View>
            <FlatList
              contentContainerStyle={{
                // paddingBottom: 1
              }}
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

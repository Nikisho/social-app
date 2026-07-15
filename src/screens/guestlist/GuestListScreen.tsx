import { View, Text, FlatList, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import SecondaryHeader from '../../components/SecondaryHeader'
import { useRoute } from '@react-navigation/native';
import { EditFeaturedEventScreenRouteProps } from '../../utils/types/types';
import { supabase } from '../../../supabase';
import { getColorFromName } from '../../utils/functions/getColorFromName';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import styles from '../../utils/styles/shadow';
import RefundModal from './RefundModal';
import LoadingScreen from '../loading/LoadingScreen';

interface GuestProps {
  user_id: number;
  username: string;
  email: string;
  photo: string | null;
  ticket_count: number;
  checked_in_count: number;
  tickets: {
    type: string;
    quantity: number;
    checked_in: number;
  }[];
};


const GuestListScreen = () => {
  const route = useRoute<EditFeaturedEventScreenRouteProps>();
  const { featured_event_id } = route.params;
  const [guests, setGuests] = useState<GuestProps[]>([]);
  const [search, setSearch] = useState("");
  const [refundModalVisible, setRefundModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from("event_bookings_view")
        .select("*")
        .eq("featured_event_id", featured_event_id);

      if (error) {
        console.error(error.message);
      } else {
        const grouped: GuestProps[] = Object.values(
          data.reduce((acc: any, row: any) => {
            const userId = row.id;

            if (!acc[userId]) {
              acc[userId] = {
                user_id: userId,
                username: row.username,
                email: row.email,
                photo: row.photo,
                ticket_count: 0,
                checked_in_count: 0,
                tickets: [],
              };
            }

            acc[userId].ticket_count += row.quantity;
            acc[userId].checked_in_count += row.checked_in_quantity;

            acc[userId].tickets.push({
              type: row.ticket_type,
              quantity: row.quantity,
              checked_in: row.checked_in_quantity,

            });

            return acc;
          }, {})
        );
        setGuests(grouped);
      };
    } catch (error) {
      console.error("Error fetching guests: ", error);
    }
  };

  const handleCheckIn = async (guest: GuestProps) => {
    // Implement check-in logic here, e.g., update the guest's check-in status in the database
    console.log("Checking in guest: ", guest);
    const { data, error } = await supabase
      .from('tickets')
      .update({ checked_in: true })
      .eq('featured_event_id', featured_event_id)
      .eq('user_id', guest.user_id);

    if (error) {
      console.error("Error checking in guest: ", error);
    }
    setGuests((prev: GuestProps[]) =>
      prev.map((u: GuestProps) =>
        u.user_id === guest.user_id
          ? {
            ...u,
            checked_in_count: u.ticket_count
          }
          : u
      )
    );

  };

  useEffect(() => {
    fetchGuests();
  }, [featured_event_id,]);

  console.log(guests);

  const RenderItem = ({ item }: { item: GuestProps }) => {
    const isFullyCheckedIn = item.checked_in_count === item.ticket_count;
    return (
      <View className='p-3 px-5 bg-gray-100 m-2 rounded-2xl'>

        {/* Header */}
        <View className='flex-row justify-between items-center'>

          <View className='flex flex-row space-x-3 items-center'>
            {item.photo ?
              <Image
                source={{ uri: item.photo }}
                className='h-14 w-14 rounded-full'
              />
              :
              <View
                style={{
                  backgroundColor: getColorFromName(item.username),
                  width: 55,
                  height: 55,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 5,
                  borderWidth: 1
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
                  {item.username.charAt(0).toUpperCase()}
                </Text>
              </View>
            }

            <Text
              numberOfLines={1}
              className='text-lg font-semibold max-w-[120px]'>
              {item.username}
            </Text>
          </View>

          {/* Check-in Button */}
          <TouchableOpacity
            onPress={() => handleCheckIn(item)}
            disabled={isFullyCheckedIn}
            className={`px-4 py-2 rounded-full ${isFullyCheckedIn ? 'bg-green-100' : 'bg-black'
              }`}
          >
            <Text className={`text-sm font-semibold ${isFullyCheckedIn ? 'text-green-700' : 'text-white'
              }`}>
              {isFullyCheckedIn
                ? 'Checked In'
                : `Check In`}
            </Text>
          </TouchableOpacity>

        </View>

        {/* Content */}
        <View className="rounded-2xl p-2 my-2">

          {/* Email */}
          <View className="flex flex-row items-center mb-2">
            <MaterialIcons name="email" size={18} color="#6B7280" />
            <Text className="ml-2 text-sm text-gray-600" selectable>
              {item.email}
            </Text>
          </View>

          {/* Tickets */}
          <View className="flex flex-row items-start mb-2">
            <Entypo name="ticket" size={18} color="#6B7280" />
            <View className="ml-2 flex-1">
              {item.tickets.map((ticket: { type: string, quantity: number }, index: number) => (
                <Text key={index} className="text-sm text-gray-800">
                  • {ticket.type} <Text className="text-gray-500">x{ticket.quantity}</Text>
                </Text>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-gray-200 my-2" />

          {/* Quantity */}
          <View className="flex flex-row justify-between items-center">
            <Text className="text-sm text-gray-500">
              Total tickets
            </Text>
            <Text className="text-base font-semibold text-black">
              {item.ticket_count}
            </Text>
          </View>
        </View>
        <View className="items-start">
          <TouchableOpacity
            style={styles.shadow} 
            className="rounded-full bg-white px-5 py-2"
            onPress={() => setRefundModalVisible(!refundModalVisible)}
            >
            <Text className="text- font-bold">
              Refund
            </Text>
          </TouchableOpacity>
          <RefundModal 
            modalVisible={refundModalVisible}
            setModalVisible={setRefundModalVisible}
            setLoading={setLoading}
            featured_event_id={featured_event_id}
            user_id={item.user_id}
          />
        </View>
      </View>
    );
  };
  const filteredGuests = guests.filter((item: { username?: string, email?: string }) => {
    const query = search.toLowerCase();

    return (
      item.username?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query)
    );
  });

    if (loading) {
        return <View className='absolute h-full w-full'>
            <LoadingScreen displayText='Issuing refund...' />
        </View>
    }
  return (
    <View className='px-3 space-y-5 h-[85%]'>
      <SecondaryHeader displayText='Guest list' />
      <View className="px-4 py-2">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
          <MaterialIcons name="search" size={20} color="#6B7280" />

          <TextInput
            placeholder="Search name or email"
            value={search}
            onChangeText={setSearch}
            className="ml-2 flex-1 text-sm"
            placeholderTextColor="#9CA3AF"
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialIcons name="close" size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {guests?.length !== 0 ? (
        <FlatList
          data={filteredGuests}
          renderItem={RenderItem}
          keyExtractor={(item) => item.user_id.toString()}
        />
      ) : (
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#666" }}>
            No RSVPs yet
          </Text>
          <Text style={{ fontSize: 14, color: "#999", marginTop: 4 }}>
            Attendees will appear here once they RSVP.
          </Text>
        </View>
      )}
    </View>
  )
}

export default GuestListScreen
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ManageEventBannerComponent from '../../../../components/ManageEventBannerComponent'
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../../../supabase';
import { RootStackNavigationProp } from '../../../../utils/types/types';
import { useNavigation } from '@react-navigation/native';
import platformAlert from '../../../../utils/functions/platformAlert';

const DuplicateEventModal = ({ featured_event_id, loading, setLoading }: { featured_event_id: number, loading: boolean, setLoading: (loading: boolean) => void }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<RootStackNavigationProp>();

  const handleDuplicate = async () => {
    setLoading(true);
    try {

      const { data, error } = await supabase
        .rpc("duplicate_featured_event", {
          original_event_id: featured_event_id
        });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      if (data) {
        const newEventId = data;
        platformAlert('Event duplicated successfully')
        navigation.navigate('featuredeventsevent', {
          featured_event_id: newEventId
        });
        
        setModalVisible(false);
      }

    } catch (error) {
      console.error(error)
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ManageEventBannerComponent
        onPress={() => setModalVisible(!modalVisible)}
        title='Duplicate event'
        description='Tap to duplicate this event'
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">

          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-8">

            {/* Handle */}
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

            {/* Icon */}
            <View className="bg-violet-100 w-14 h-14 rounded-full items-center justify-center self-center mb-5">
              <Ionicons
                name="copy-outline"
                size={28}
                color="#7c3aed"
              />
            </View>

            <Text className="text-xl font-semibold text-center">
              Duplicate this event?
            </Text>

            <Text className="text-gray-500 text-center mt-3 leading-6">
              This will create a copy of your event, including all event
              details and ticket types.
            </Text>

            {/* Warning */}
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-5">
              <Text className="text-amber-800 text-sm leading-5">
                Remember to update the event date, time, and ticket sales
                start and end dates before publishing.
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row mt-7">

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 border border-gray-200 rounded-2xl py-4 mr-2"
              >
                <Text className="text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={handleDuplicate}
                className="flex-1 bg-black rounded-2xl py-4 ml-2"
              >
                <Text className="text-center text-white font-semibold">
                  Duplicate
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default DuplicateEventModal
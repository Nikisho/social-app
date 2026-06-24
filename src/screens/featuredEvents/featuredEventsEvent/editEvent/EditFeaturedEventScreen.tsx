import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Switch } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { EditFeaturedEventScreenRouteProps, EventDataProps, RootStackNavigationProp } from '../../../../utils/types/types'
import SecondaryHeader from '../../../../components/SecondaryHeader'
import { supabase } from '../../../../../supabase'
import MediaPicker from './MediaPicker'
import { uploadEventMediaToStorageBucket } from '../../../../utils/functions/uploadEventMediaToStorageBucket'
import platformAlert from '../../../../utils/functions/platformAlert'
import LoadingScreen from '../../../loading/LoadingScreen'
import { uuidv4 } from '../../../../utils/functions/uuidv4'
import ManageSeries from './ManageSeries'
import DeleteEventModal from './DeleteEventModal'
import EditEventDateTime from './EditEventDateTime'
import EditAddressInput from './EditAddressInput'

type Base64<imageType extends string> = `data:image/${imageType};base64${string}`

interface InitialStateProps {
  description: string;
  image_url: string | { base64: Base64<'jpg'>, uri: string };
  title: string;
  hasSeries: boolean;
  repeatEvent: boolean | null;
  date: Date;
  end_date: Date;
  end_time: string;
  time: string;
  location: string;
  email_on_ticket_purchase: boolean;
}
const EditFeaturedEventScreen = () => {
  const route = useRoute<EditFeaturedEventScreenRouteProps>()
  const { featured_event_id } = route.params
  const navigation = useNavigation<RootStackNavigationProp>();
  const [repeatEvent, setRepeatEvent] = useState<boolean | null>(null);
  const [eventData, setEventData] = useState<EventDataProps | null>(null)
  const [oldUniqueFileIdentifier, setOldUniqueFileIdentifier] = useState<string | null>(null);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [initial, setInitial] = useState<InitialStateProps>({
    description: '',
    image_url: '',
    title: '',
    hasSeries: false,
    repeatEvent: null,
    date: new Date(),
    end_date: new Date(),
    end_time: '',
    time: '',
    location: '',
    email_on_ticket_purchase: false
  })
  const [loading, setLoading] = useState(false)
  const fetchEventData = async () => {
    const { data: event, error } = await supabase
      .from('featured_events')
      .select(`*, organizers(user_id, users(*)), ticket_types(*)`)
      .eq('featured_event_id', featured_event_id)
      .single();

    if (error || !event) {
      console.error(error?.message || 'No event found');
      return;
    }

    setEventData(event);

    // Compute total tickets sold
    const total = event.ticket_types?.reduce(
      (sum: number, t: any) => sum + (t.tickets_sold || 0),
      0
    );

    let paused = null;

    // ✅ Fetch recurring_series separately
    if (event.series_id) {
      const { data: series, error: seriesError } = await supabase
        .from('recurring_series')
        .select('paused')
        .eq('series_id', event.series_id)
        .single();

      if (seriesError) console.error(seriesError.message);
      paused = series?.paused;
    }

    const repeatFlag = Boolean(event.series_id && paused === false);

    setInitial({
      description: event.description,
      image_url: event.image_url,
      title: event.title,
      hasSeries: Boolean(event.series_id),
      repeatEvent: repeatFlag,
      date: event.date,
      end_date: event.end_date,
      end_time: event.end_time,
      time: event.time,
      location: event.location,
      email_on_ticket_purchase: event.email_on_ticket_purchase
    });

    setRepeatEvent(repeatFlag);
  };

  useEffect(() => {
    fetchEventData()
  }, []);

  useEffect(() => {
    if (eventData?.image_url && typeof eventData.image_url === 'string') {
      const match = eventData.image_url.match(/featured-events\/\d+\/([^\/]+)\.[a-zA-Z0-9]+$/)
      setOldUniqueFileIdentifier(match ? match[1] : null)
    }
  }, [eventData?.image_url])


  const hasChanges = useMemo(() => {
    if (!eventData) return false
    if (eventData.description !== initial.description) return true
    if (repeatEvent !== initial.repeatEvent) return true
    if (eventData.title !== initial.title) return true
    if (eventData.date.toString() !== initial.date.toString()) return true
    if (eventData.end_date.toString() !== initial.end_date.toString()) return true
    if (eventData.end_time !== initial.end_time) return true
    if (eventData.time !== initial.time) return true
    if (eventData.location !== initial.location) return true
    if (typeof eventData.image_url === 'object') return true
    if (eventData.email_on_ticket_purchase !== initial.email_on_ticket_purchase) return true
    return false
  }, [eventData, initial, repeatEvent])


  const handleRepeatEvent = async () => {
    if (repeatEvent === initial.repeatEvent) return;

    // CASE 1: Event is not part of a series yet → Create new series
    if (!initial.hasSeries && repeatEvent) {
      const dayOfWeek = new Date(eventData?.date!).getDay();

      const { data, error } = await supabase
        .from('recurring_series')
        .insert({
          featured_event_id,
          day_of_week: dayOfWeek,
          paused: false,
        })
        .select('series_id')
        .single();

      if (error) {
        console.error('Error inserting into series:', error.message);
        return;
      }

      const { error: updateError } = await supabase
        .from('featured_events')
        .update({ series_id: data.series_id })
        .eq('featured_event_id', featured_event_id);

      if (updateError) console.error('Error linking series_id:', updateError.message);
      return;
    }

    // CASE 2: Event is part of a series → Pause or unpause
    if (initial.hasSeries && eventData?.series_id) {
      const { data: series, error: fetchError } = await supabase
        .from('recurring_series')
        .select('paused')
        .eq('series_id', eventData.series_id)
        .single();

      if (fetchError) {
        console.error('Error fetching series:', fetchError.message);
        return;
      }

      // Pause series
      if (!repeatEvent && !series?.paused) {
        const { error } = await supabase
          .from('recurring_series')
          .update({ paused: true })
          .eq('series_id', eventData.series_id);

        if (error) console.error('Error pausing series:', error.message);
      }

      // Unpause series
      if (repeatEvent && series?.paused) {
        const { error } = await supabase
          .from('recurring_series')
          .update({ paused: false })
          .eq('series_id', eventData.series_id);

        if (error) console.error('Error unpausing series:', error.message);
      }
    }
  };


  const checkDateBeforeEndDate = () => {
    const eventDate = new Date(`${eventData?.date}T${eventData?.time}`);
    const eventEndDate = new Date(`${eventData?.end_date}T${eventData?.end_time}`);
    return eventDate < eventEndDate;
  }

  const handleSubmit = async () => {
    if (!hasChanges) {
      return platformAlert('Nothing to save, you haven’t made any changes.')
    }

    setLoading(true);
    const newUniqueFileIdentifier = uuidv4(9)
    const mediaUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/featured-events/${eventData?.organizer_id}/${newUniqueFileIdentifier}.jpg`
    const oldPath = `${eventData?.organizer_id}/${oldUniqueFileIdentifier}.jpg`;
    const isDateValid = checkDateBeforeEndDate();
    if (!isDateValid) {
      setLoading(false);
      return platformAlert('Event start date must be before end date.');
    }
    try {
      if (
        eventData &&
        typeof eventData.image_url !== 'string' &&
        eventData.image_url.base64 &&
        oldUniqueFileIdentifier
      ) {

        const { error: deleteError } = await supabase.storage
          .from('featured-events')
          .remove([oldPath]);
        if (deleteError) { console.error(deleteError?.message) }

        await uploadEventMediaToStorageBucket(
          eventData.image_url.base64,
          newUniqueFileIdentifier,
          eventData.organizer_id
        )
      }
      const { error } = await supabase
        .from('featured_events')
        .update({
          description: eventData!.description,
          image_url: typeof eventData?.image_url !== 'string' ? mediaUrl : eventData.image_url,
          title: eventData?.title,
          date: eventData?.date,
          end_date: eventData?.end_date,
          end_time: eventData?.end_time,
          time: eventData?.time,
          location: eventData?.location,
          email_on_ticket_purchase: eventData?.email_on_ticket_purchase
        })
        .eq('featured_event_id', featured_event_id)

      if (error) throw new Error(error.message)

      await handleRepeatEvent();


      platformAlert('Changes saved successfully')
      navigation.goBack();
    } catch (err: any) {
      console.error('handleSubmit error:', err)
      platformAlert(err.message ?? 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke(
        "handle-delete-event",
        {
          method: "POST",
          body: JSON.stringify({ featured_event_id }),
        }
      );

      if (error) {
        console.error("Error invoking delete function:", error.message);
        platformAlert("Failed to delete event. Please try again.");
        return;
      }

      platformAlert("Event deleted successfully");
      navigation.navigate("featuredEvents", {});
    } catch (err) {
      console.error("Unexpected error:", err);
      platformAlert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <LoadingScreen displayText="Saving changes..." />
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className=''
      // keyboardVerticalOffset={Platform.OS === 'ios' ? 80 + 47 : 0}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="p-2"
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <SecondaryHeader displayText="Edit event details" />
        <ManageSeries
          repeatEvent={repeatEvent}
          setRepeatEvent={setRepeatEvent}
        />
        <View
          className={`p-4 my-2 rounded-xl ${eventData?.email_on_ticket_purchase! === null ? "bg-gray-100" : "bg-white"
            }`}
        >
          <Text className="font-semibold text-base">Turn on alerts</Text>
          <Text className="text-gray-500 text-sm my-2 mb-4">
            When activated, you will receive an email whevener a ticket is purchased.
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            onValueChange={() => setEventData((prev) => prev! && { ...prev, email_on_ticket_purchase: !eventData?.email_on_ticket_purchase })}
            value={eventData?.email_on_ticket_purchase!}
          />
        </View>
        {eventData && (
          <>
            {/* <View className={`${keyboardStatus==='Keyboard Shown' ? 'hidden' : '' }`}> */}
            <MediaPicker setEventData={setEventData} eventData={eventData} />
            {/* </View> */}

            <View
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 10,
                marginVertical: 10
              }}
            >

              <Text className='font-semibold mt-2 px-3'>Title</Text>

              <TextInput

                multiline
                value={eventData.title}
                placeholder="Enter your event's title"
                onChangeText={(value) =>
                  setEventData((prev) => prev! && { ...prev, title: value })
                }
                className="  h-15 p-5"
              />
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 10,
                marginVertical: 10
              }}
            >

              <Text className='font-semibold mt-2 px-3'>Description</Text>

              <TextInput

                multiline
                value={eventData.description}
                placeholder="Enter your event's description"
                onChangeText={(value) =>
                  setEventData((prev) => prev! && { ...prev, description: value })
                }
                className=" h-32 p-5"
              />
            </View>
            <EditAddressInput
              address={eventData?.location}
              setEventData={setEventData}
            />
            {/* Edit event date and time */}
            <EditEventDateTime
              eventData={eventData}
              setEventData={setEventData}
            />
            <View className="pt-5">
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!hasChanges}
                className={`p-4 rounded-lg w-full self-center ${hasChanges ? 'bg-black' : 'bg-gray-400'
                  }`}
              >
                <Text className="text-white text-center font-bold">SAVE CHANGES</Text>
              </TouchableOpacity>
            </View>

            <View className="pt-3">
              <TouchableOpacity
                onPress={() => setConfirmDeleteModalVisible(true)}
                // disabled={!hasChanges}
                className={`p-4 rounded-lg w-full self-center bg-red-600`}
              >
                <Text className="text-white text-center font-bold">DELETE EVENT</Text>
              </TouchableOpacity>
            </View>

            <DeleteEventModal
              showDeleteModal={confirmDeleteModalVisible}
              setShowDeleteModal={setConfirmDeleteModalVisible}
              handleDeleteEvent={handleDeleteEvent}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>

  )
}

export default EditFeaturedEventScreen

import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { EditFeaturedEventScreenRouteProps, RootStackNavigationProp } from '../../../utils/types/types'
import SecondaryHeader from '../../../components/SecondaryHeader'
import { supabase } from '../../../../supabase'
import MediaPicker from './MediaPicker'
import { uploadEventMediaToStorageBucket } from '../../../utils/functions/uploadEventMediaToStorageBucket'
import Ionicons from '@expo/vector-icons/Ionicons'
import platformAlert from '../../../utils/functions/platformAlert'
import LoadingScreen from '../../loading/LoadingScreen'
import TicketStatsBanner from './TicketStatsBanner'
import { uuidv4 } from '../../../utils/functions/uuidv4'
import ManageRSVPsModal from './ManageRSVPsModal'
import ManageSeries from './ManageSeries'

type Base64<imageType extends string> = `data:image/${imageType};base64${string}`

interface EventDataProps {
  title: string
  description: string
  organizer_id: number
  price: string
  time: string
  location: string
  image_url: string | { base64: Base64<'jpg'>, uri: string }
  is_free: boolean
  featured_event_id: number
  tickets_sold: number
  date: Date;
  recurring_series: {
    paused: boolean
  }
  max_tickets: number
  organizers: {
    user_id: number
    users: { name: string; photo: string }
  }
}

const EditFeaturedEventScreen = () => {
  const route = useRoute<EditFeaturedEventScreenRouteProps>()
  const { featured_event_id } = route.params
  const navigation = useNavigation<RootStackNavigationProp>();
  const [repeatEvent, setRepeatEvent] = useState<boolean | null>(null);
  const [eventData, setEventData] = useState<EventDataProps | null>(null)
  const [oldUniqueFileIdentifier, setOldUniqueFileIdentifier] = useState<string | null>(null)
  const [initial, setInitial] = useState<{ description: string; image_url: string | { base64: string }, hasSeries: boolean, repeatEvent: boolean | null }>({
    description: '',
    image_url: '',
    hasSeries: false,
    repeatEvent: null,
  })
  const [loading, setLoading] = useState(false)
  const fetchEventData = async () => {
    const { data, error } = await supabase
      .from('featured_events')
      .select(`*, organizers(user_id, users(*)), recurring_series(paused)`)
      .eq('featured_event_id', featured_event_id)
      .single()
    if (error) {
      console.error(error.message)
      return
    }
    if (data) {
      setEventData(data)
      setInitial({
        description: data.description,
        image_url: data.image_url,
        hasSeries: Boolean(data.series_id),
        repeatEvent: data.series_id && !data.recurring_series.paused ? true : false
      })
    }
    if (data.series_id && !data.recurring_series.paused) {
      setRepeatEvent(true);
    } else {
      setRepeatEvent(false);
    }
  }
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
    if (typeof eventData.image_url === 'object') return true
    return false
  }, [eventData, initial, repeatEvent])


  const handleRepeatEvent = async () => {
    if (repeatEvent === initial.repeatEvent) return;

    if (!initial.hasSeries && repeatEvent) {
      //Create new series if the event was originally not a series
      const { data, error } = await supabase
        .from('recurring_series')
        .insert({
          featured_event_id: featured_event_id,
          day_of_week: new Date(eventData?.date!).getDay()
        })
        .select('series_id')
        .single()

      if (data) {
        const { error: errorInsertSeriesId } = await supabase
          .from('featured_events')
          .update({
            series_id: data.series_id
          })
          .eq('featured_event_id', featured_event_id)
        if (errorInsertSeriesId) {
          console.error(errorInsertSeriesId.message)
        }
      }
      if (error) {
        console.error('Error inserting into series :', error.message)
      }
    }

    if (initial.hasSeries && !repeatEvent) {
      //Pause the series if the event was scheduled
      const { error } = await supabase
        .from('recurring_series')
        .update({
          paused: true
        })
        .eq('featured_event_id', featured_event_id)
      if (error) console.error('Error pausing event :', error.message)
    }

    if (initial.hasSeries && repeatEvent && eventData?.recurring_series?.paused) {
      // Unpause the series
      const { error } = await supabase
        .from('recurring_series')
        .update({ paused: false })
        .eq('featured_event_id', featured_event_id);

      if (error) console.error('Error unpausing event :', error.message);
    }
  }


  const handleSubmit = async () => {
    if (!hasChanges) {
      return platformAlert('Nothing to save, you haven’t made any changes.')
    }

    setLoading(true);

    const newUniqueFileIdentifier = uuidv4(9)
    const mediaUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/featured-events/${eventData?.organizer_id}/${newUniqueFileIdentifier}.jpg`
    const oldPath = `${eventData?.organizer_id}/${oldUniqueFileIdentifier}.jpg`;

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
        .update({ description: eventData!.description, image_url: typeof eventData?.image_url !== 'string' ? mediaUrl : eventData.image_url })
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
        <SecondaryHeader displayText="Manage event" />
        <TicketStatsBanner
          sold={eventData?.tickets_sold!}
          max={eventData?.max_tickets!}
        />

        <ManageRSVPsModal
          featured_event_id={featured_event_id}
        />

        <ManageSeries
          repeatEvent={repeatEvent}
          setRepeatEvent={setRepeatEvent}
        />
        <View
          className="flex-row items-center space-x-4 bg-amber-100 border border-amber-300 rounded-2xl p-4 my-4 w-full"
        >
          <Ionicons name="warning-outline" size={28} color="#D97706" />
          <Text className="flex-1 text-amber-800 text-base leading-6">
            You can only edit the image and description of featured events.
          </Text>
        </View>

        {eventData && (
          <>
            {/* <View className={`${keyboardStatus==='Keyboard Shown' ? 'hidden' : '' }`}> */}
            <MediaPicker setEventData={setEventData} eventData={eventData} />
            {/* </View> */}

            <Text className="text-xl font-bold m-2">Description</Text>
            <TextInput
              multiline
              value={eventData.description}
              placeholder="Enter your event's description"
              onChangeText={(value) =>
                setEventData((prev) => prev! && { ...prev, description: value })
              }
              className="border rounded-xl h-32 p-5"
            />

            <View className="py-5">
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!hasChanges}
                className={`p-4 rounded-full w-1/2 self-center ${hasChanges ? 'bg-black' : 'bg-gray-400'
                  }`}
              >
                <Text className="text-white text-center font-bold">SAVE CHANGES</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>

  )
}

export default EditFeaturedEventScreen

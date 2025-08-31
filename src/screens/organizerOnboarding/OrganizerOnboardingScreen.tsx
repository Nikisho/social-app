import { View, Text, TouchableOpacity, AppState, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../../../supabase';
import * as WebBrowser from 'expo-web-browser';
import LoadingScreen from '../loading/LoadingScreen';
import SecondaryHeader from '../../components/SecondaryHeader';
import styles from '../../utils/styles/shadow';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import platformAlert from '../../utils/functions/platformAlert';

const OrganizerOnboardingScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const currentUser = useSelector(selectCurrentUser);
  const navigation = useNavigation<RootStackNavigationProp>();

  const checkIfOrganizer = async () => {
    const { error, data } = await supabase
      .from('users')
      .select('is_organizer')
      .eq('id', currentUser.id)
      .single()

    if (data?.is_organizer) {
      console.log(data.is_organizer);
      navigation.navigate('featuredEvents', {})
    }
    if (error) {
      console.error(error.message)
    }
  };

  const handleOnboarding = async () => {
    setLoading(true);
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    const forwardurl = 'https://wffeinvprpdyobervinr.supabase.co'
    try {
      const response = await fetch(`${forwardurl}/functions/v1/onboard-organizer-stripe`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const { url, accountId } = await response.json();

      console.log("Stripe link created: ", url, ' for ', accountId);
      WebBrowser.dismissBrowser()
      if (AppState.currentState === 'active') {
        const result = await WebBrowser.openBrowserAsync(url);
        console.log('WebBrowser result:', result);
      } else {
        console.error('App is in the background, cannot open browser.');
      }
      const verify = await fetch(`${forwardurl}/functions/v1/verify-onboarding`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: `${accountId}`
        }),
      });
      const result = await verify.json();
      if (result?.success) {
        navigation.navigate('featuredEvents', {});
        platformAlert('Congratulations! You are now an organizer ✨')
      } else {
        Alert.alert('Verification Failed', 'Please complete onboarding.');
      }

    } catch (error: any) {
      console.error(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      checkIfOrganizer();
    }, [])
  );

  if (loading) return <LoadingScreen displayText='Redirecting you to Stripe' />
  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 200
      }}
    >
      <View className='p-3'>
        <SecondaryHeader
          displayText='Become an organiser'
        />
      </View>
      <View className='flex items-center  justify-center bg-[#fffef4]  px-5 space-y'>
        <Text className='text-2xl font-bold text-center' >🎉 Ready to Host Your Own Events?</Text>
        <Text className=' mb-5 text-lg'>Become an organiser and unlock powerful tools:</Text>

        <View className='space-y-4'>
          <Text className=' text-lg '>🌟 Feature your events to reach more people</Text>
          <Text className=' text-lg '>📊 Track attendee numbers in real time</Text>
          <Text className=' text-lg '>🚀 Boost your visibility in the community</Text>
          <Text className=' text-lg '>💳 Get paid directly through Stripe</Text>
          <Text className=' text-lg '>📥 Manage RSVPs and event analytics</Text>
        </View>

        <View className="space-y-6 rounded-2xl p-5 mt-2 w-full">
          <Text className="text-xl font-bold text-center">🛠 What’s Involved</Text>

          <View className="space-y-3">
            <Text className="text-lg">1️⃣ Fill in your profile information</Text>
            <Text className="text-lg">2️⃣ Verify your identity with Stripe</Text>
            <Text className="text-lg">3️⃣ Add your payment details</Text>
            <Text className="text-lg">4️⃣ Create your first event</Text>
            <Text className="text-lg">5️⃣ Start selling tickets and track your earnings</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.shadowButtonStyle}
          className='rounded-lg p-3 bg-black my-1 px-4' onPress={handleOnboarding}>
          <Text className='text-lg font-bold text-[#fffef4]'>Become an Organizer 🚀</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default OrganizerOnboardingScreen

import { View, Text, TouchableOpacity, AppState } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../../../supabase';
import * as WebBrowser from 'expo-web-browser';
import LoadingScreen from '../loading/LoadingScreen';
import SecondaryHeader from '../../components/SecondaryHeader';
import styles from '../../utils/styles/shadow';

const OrganizerOnboardingScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
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
          accountId: `${accountId}`  // Replace with the actual value
        }),
      });

    } catch (error: any) {
      console.error(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingScreen displayText='Redirecting you to Stripe' />
  return (
    <>
      <View className='p-3'>
        <SecondaryHeader
          displayText='Become an organiser'
        />
      </View>
      <View className='flex items-center h-3/4 justify-center bg-[#fffef4]  px-5 space-y'>
        <Text className='text-2xl font-bold my-5  text-center' >🎉 Ready to Host Your Own Events?</Text>
        <Text className=' mb-10 text-lg'>Become an organizer and unlock powerful tools:</Text>

        <View className='space-y-4'>
          <Text className=' text-lg font-semibold'>🌟 Feature your events to reach more people</Text>
          <Text className=' text-lg font-semibold'>📊 Track attendee numbers in real time</Text>
          <Text className=' text-lg font-semibold'>🚀 Boost your visibility in the community</Text>
          <Text className=' text-lg font-semibold'>💳 Get paid directly through Stripe</Text>
          <Text className=' text-lg font-semibold'>📥 Manage RSVPs and event analytics</Text>
        </View>

        <TouchableOpacity
          style={styles.shadowButtonStyle}
          className='rounded-full p-3 bg-black my-14 px-4' onPress={handleOnboarding}>
          <Text className='text-lg font-bold text-[#fffef4]'>Become an Organizer 🚀</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default OrganizerOnboardingScreen

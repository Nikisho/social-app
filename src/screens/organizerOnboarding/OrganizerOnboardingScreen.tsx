import { View, Text, TouchableOpacity, AppState, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
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
    console.log(token)
    const forwardurl = 'https://8b2d-81-105-240-100.ngrok-free.app'
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


    } catch (error: any) {
      console.error(error.message);
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <>
      <View className='p-3'>
        <SecondaryHeader
          displayText='Become an organiser'
        />
      </View>
      <View className='flex items-center h-3/4 justify-center bg-[#fffef4]  space-y'>
        <Text className='text-2xl font-bold  my-2' >🎉 Ready to Host Your Own Events?</Text>
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
          <Text className='text-xl font-bold text-[#fffef4]'>Become an Organizer 🚀</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default OrganizerOnboardingScreen

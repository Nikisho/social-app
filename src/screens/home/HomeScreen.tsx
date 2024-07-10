import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import EventInput from './EventInput'
import Feed from './Feed'

const HomeScreen = () => {
  return (
    <View>
        <EventInput/>
        <Feed />
    </View>
  )
}

export default HomeScreen

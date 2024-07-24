import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Feed from './Feed'
import Header from './Header'

const HomeScreen = () => {
  return (
    <View>
        <Header />
        <Feed />
    </View>
  )
}

export default HomeScreen

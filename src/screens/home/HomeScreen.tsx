import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Feed from './Feed'
import Header from '../../components/Header'

const HomeScreen = () => {
  return (
    <View className=''>
        <Header />
        <Feed />
    </View>
  )
}

export default HomeScreen

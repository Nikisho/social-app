import { View } from 'react-native'
import React from 'react'
import Leaderboard from './Leaderboard'
import SecondaryHeader from '../../components/SecondaryHeader'

const LeaderboardScreen = () => {
  return (
    <View className='flex space-y-2 mx-3 '>
        <SecondaryHeader
            displayText='Leaderboard'
            />
        <Leaderboard/>
    </View>
  )
}

export default LeaderboardScreen
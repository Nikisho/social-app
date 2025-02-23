import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Leaderboard from './Leaderboard'
import SecondaryHeader from '../../components/SecondaryHeader'
import CompetitionCountDown from './CompetitionCountDown'

const LeaderboardScreen = () => {


  return (
    <View className='flex space-y-2 mx-3 '>
      <SecondaryHeader
        displayText='Leaderboard'
      />
      <CompetitionCountDown />
      <Leaderboard />
    </View>
  )
}

export default LeaderboardScreen
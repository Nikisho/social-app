import { View, Text } from 'react-native'
import React from 'react'
import FeedCard from './FeedCard';
import { supabase } from '../../../supabase';

const Feed = () => {
  const testData = [
    {
      userName: 'James',
      title: 'Meet Up - London Bridge Pub',
      description:  `LONDON. The full stage split for our biggest to date open-air, multi-stage party in the city is here.`,
      id: 1
    },
    {
      userName: 'Susaane Bell945',
      title: 'Meet Up - Greenwich Park',
      description:  `Planning to hang out at the park with some friends later this afternoon, feel free to join!`,
      id: 2
    }
  ];


  return (
    <View className='py-2 '>
      {testData?.map((card) => (
        <FeedCard 
          name={card.userName}
          key={card.id}
          description={card.description}
          title={card.title}
        />
      ))}
    </View>
  )
}


export default Feed
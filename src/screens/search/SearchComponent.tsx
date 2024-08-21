import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import styles from '../../utils/styles/shadow';

interface SearchComponentProps {
  query: string;
  fetchEvents: () => void;
  setQuery: (value: string) => void
}
const SearchComponent: React.FC<SearchComponentProps> = ({
  query,
  setQuery,
  fetchEvents
}) => {
  return (
    <View className='h-[20%] flex justify-center items-center space-y-2'>
      <TextInput
        className='p-2 px-5 flex items-center border w-5/6 rounded-full bg-gray-200'
        maxLength={200}
        placeholder='Search for key words'
        onChangeText={(value) => { setQuery(value) }}
        value={query}
      />
      <TouchableOpacity onPress={fetchEvents}
        style={styles.shadowButtonStyle}
        className='p-2 px-5 py-3 flex items-center w-5/6 rounded-full '
      >
        <Text
          className='text-white font-bold'
        >Search</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SearchComponent
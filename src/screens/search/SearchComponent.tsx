import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'

interface SearchComponentProps {
    query: string;
    setQuery: (value:string) => void
}
const SearchComponent:React.FC<SearchComponentProps> = ({
    query,
    setQuery
}) => {
  return (
    <View className='h-1/2 bg-red-200 flex justify-center'>
        <TextInput 
            className='p-2 px-5 flex items-center border  rounded-full bg-gray-200'
            placeholder='Search for key words'
            onChangeText={(value) => { setQuery(value)}}
            value={query}
        />
    </View>
  )
}

export default SearchComponent
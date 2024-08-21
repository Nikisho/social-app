import { View, Text } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header'
import SearchComponent from './SearchComponent'
import QueryResults from './QueryResults'

const SearchScreen = () => {
    const [query, setQuery] = useState<string>('');

  return (
    <View className='mx-2'>
      <Header />
      <SearchComponent 
        query={query}
        setQuery={setQuery}
      />
      <QueryResults/>
    </View>
  )
}

export default SearchScreen
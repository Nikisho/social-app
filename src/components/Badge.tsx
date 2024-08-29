import { View, Text } from 'react-native'
import React from 'react'

const Badge = ({messageCount}: {messageCount:number}) => {
    if (messageCount) {
        return (
            <View 
                // style={{ position:"absolute", top:8, right:8, backgroundColor: 'green', padding: 2}} 
                className='px-1 absolute right-0 bg-green-600 rounded-full border border-white'
                >
              <Text 
                style={{fontSize: 9, color: 'white'}}
                >{messageCount}</Text>
            </View>
          )
    }

}

export default Badge 
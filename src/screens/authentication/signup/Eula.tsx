import { View, Text } from 'react-native'
import React, { useState } from 'react'
import Checkbox from 'expo-checkbox'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigationProp } from '../../../utils/types/types'

const Eula = () => {
    const [isChecked, setChecked] = useState(false);
    const navigation = useNavigation<RootStackNavigationProp>();
    return (
        <View className='absolute bottom-32 flex flex-row left-20'>
            <Checkbox
                value={isChecked} onValueChange={setChecked}
                className='mt-1'
            />
            <View>
                <Text onPress={() => navigation.navigate('eula')} className='w-4/5 ml-2 text-blue-600 underline'>
                    I agree to Linkzy's End User License Agreement (EULA).
                </Text>
            </View>
        </View>
    )
}

export default Eula
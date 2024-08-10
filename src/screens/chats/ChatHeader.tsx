import { View, Text, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { RootStackNavigationProp } from '../../utils/types/types';
import styles from '../../utils/styles/shadow';
import colours from '../../utils/styles/colours';

interface ChatHeaderProps {
    name: string;
    photo: string;
    user_id: number;
}

const ChatHeader:React.FC<ChatHeaderProps> = ({
    name,
    photo,
    user_id
}) => {

    const navigation = useNavigation<RootStackNavigationProp>();
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('profile',
                { user_id: user_id }
            )}
            style={{backgroundColor: colours.secondaryColour}}
            className='p-2 py-3 flex  flex-row space-x-3 items-center'>

            {
                photo === null ?
                    <>
                        <FontAwesome name="user-circle" size={28} color="white" />
                    </> :
                    <>
                        <Image
                            className='w-10 h-10 rounded-full'
                            source={{
                                uri: photo,
                            }}
                        />
                    </>
            }
            <Text className='text-white'>
                {name}
            </Text>
        </TouchableOpacity>
 
    )
}

export default ChatHeader
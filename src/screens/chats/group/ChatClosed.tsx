import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity } from 'react-native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import styles from '../../../utils/styles/shadow';

const ChatClosed = ({message}: {message:string}) => {
       const navigation = useNavigation<RootStackNavigationProp>();
       const handleConnect = () => {
           navigation.navigate('featuredEvents');
       };
    return (
        <View className={`bg-gray-200 p-5 justify-between flex items-center`}>
            <Text className="text-gray-800 text-lg first-letter:font-medium">Chat closed</Text>
            <Text className="text-gray-500 text-xs mt-1">
                {message}
            </Text>
            <TouchableOpacity 
                style={styles.shadowButtonStyle}
                className='p-2 rounded-full mt-5 mb-2 px-5'
                onPress={handleConnect}>
                <Text className='text-white font-semibold' > Browse events</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ChatClosed;
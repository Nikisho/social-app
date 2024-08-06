import { View, TouchableOpacity} from 'react-native'
import React  from 'react'
import EvilIcons from '@expo/vector-icons/EvilIcons';
import styles from '../../utils/styles/shadow';
import LikeHandler from '../../components/LikeHandler';

interface EngagementBarProps {
    event_id: number;
    user_id: number;
};

const EngagementBar: React.FC<EngagementBarProps> = ({ event_id, user_id }) => {
    return (
        <View 
            style={styles.translucidViewStyle}
            className='rounded-xl py-2 flex flex-row '>
            <LikeHandler
                user_id={user_id}
                event_id={event_id}
            />
            <TouchableOpacity className='w-1/2  flex flex-row justify-center items-center'>
                <EvilIcons name="comment" size={30} color="black" />
            </TouchableOpacity>
        </View>
    )
}

export default EngagementBar
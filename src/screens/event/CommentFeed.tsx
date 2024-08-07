import { View, Text, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../../supabase';
import styles from '../../utils/styles/shadow';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackNavigationProp } from '../../utils/types/types';

interface CommentFeedProps {
    event_id: number
};
interface CommentsProps {
    users: {
        name: string;
        photo: string;
        id: number;
    }
    text: string;
    comment_id: number;
}
const CommentFeed: React.FC<CommentFeedProps> = ({ event_id }) => {

    const [comments, setComments] = useState<CommentsProps[]>();
    const navigation = useNavigation<RootStackNavigationProp>();
    const fetchComments = async () => {
        const { error, data } = await supabase
            .from('comments')
            .select(`*,
                users(
                    name,
                    photo,
                    id
                )`)
            .eq('event_id', event_id)
        if (data) { setComments(data) }
        if (error) console.error(error.message);
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchComments();
        }, [])
    );
    return (
        <ScrollView className='space-y-2 mt-2 '>
            {
                comments?.map((comment) => (
                    <View
                        style={styles.shadow}
                        key={comment.comment_id}
                        className='bg-white
                                    p-2 m-1 rounded-xl space-y-1'>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('profile',
                                { user_id: comment.users.id }
                            )}
                            className='flex  flex-row space-x-3 items-center '>

                            {
                                comment.users.photo === null ?
                                    <>
                                        <FontAwesome name="user-circle" size={24} color="black" />
                                    </> :
                                    <>
                                        <Image
                                            className='w-8 h-8 rounded-full'
                                            source={{
                                                uri: comment.users.photo,
                                            }}
                                        />
                                    </>
                            }
                            <Text>
                                {comment.users.name}
                            </Text>
                        </TouchableOpacity>
                        <Text>
                            {comment.text}
                        </Text>
                    </View>
                ))
            }

        </ScrollView>
    )
}

export default CommentFeed
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, {  useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../../supabase';
import styles from '../../utils/styles/shadow';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
        <ScrollView className='space-y-1 mt-2 -mx-2 h-1/2'>
            {
                comments?.map((comment) => (
                    <View
                        key={comment.comment_id}
                        className='bg-gray-100 
                                    py-2 px-3  space-y-1'>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('profile',
                                { user_id: comment.users.id }
                            )}
                            className='flex  flex-row space-x-3 items-center '>

                            {
                                comment.users.photo === null ?
                                    <>
                                        <FontAwesome name="user-circle" size={31} color="black" />
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
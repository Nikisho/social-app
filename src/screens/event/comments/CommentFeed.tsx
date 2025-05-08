import { ScrollView } from 'react-native'
import React, {  useState } from 'react'
import { supabase } from '../../../../supabase';
import { useFocusEffect } from '@react-navigation/native';
import Comment from './Comment';

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
    parent_comment_id: number;
}
const CommentFeed: React.FC<CommentFeedProps> = ({ event_id }) => {

    const [comments, setComments] = useState<CommentsProps[]>();
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
        }, [event_id])
    );
    return (
        <ScrollView className='space-y-1 mt-2 -mx-2 h-1/2'>
            {
                comments?.map((comment) => (
                    <Comment 
                        comment={comment}
                        event_id={event_id}
                        //Warning this is the parent comment id of 
                        //the comment the current one replied to, the one in the navigate in Comment.tsx is set to comment_id 
                        //as we are replying to the current comment
                        parentCommentId={comment.parent_comment_id}
                        key={comment.comment_id}
                    />
                ))
            }

        </ScrollView>
    )
}

export default CommentFeed
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../../../supabase';

interface CommentProps {
    comment: {
        comment_id: number;
        text: string;
        users: {
            id: number,
            name: string
            photo: string;
        }
    }
    event_id: number;
    parentCommentId: number
};

const Comment: React.FC<CommentProps> = ({
    comment,
    event_id,
    parentCommentId
}) => {

    const navigation = useNavigation<RootStackNavigationProp>();
    const [parentCommentUser, setParentCommentUser] = useState<{id:number,name:string}>();
    const fetchParentCommentUser = async () => {
        if (!parentCommentId) return;
        const { data, error } = await supabase
            .from('comments')
            .select(`*,
            users(
                name,
                id
            )`)
            .eq('comment_id', parentCommentId)
            .single()
        if (data)
            setParentCommentUser(data.users);
        if (error) {
            console.error(error.message);
        }

    }

    useEffect(() => {
        fetchParentCommentUser()
    }, [])
    return (
        <View
            key={comment.comment_id}
            className='bg-gray-100 
                py-2 px-3  space-y-1'>
            <TouchableOpacity
                onPress={() => navigation.navigate('profile',
                    { user_id: comment.users.id }
                )}
                className='flex flex-row space-x-3 items-center '>

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
            <View 
                className='flex flex-row '>
                {
                    parentCommentId && (
                        <TouchableOpacity
                        onPress={() => navigation.navigate('profile', {user_id: parentCommentUser?.id!})}>

                        <Text className='text-blue-500'>
                            @{parentCommentUser?.name}
                        </Text>
                        </TouchableOpacity>
                    )
                }
                <Text>
                    {comment.text}
                </Text>
            </View>
            <TouchableOpacity
                style={{
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    paddingTop: 8
                }}
                onPress={() => navigation.navigate('comment',
                    {
                        event_id: event_id,
                        parent_comment_id: comment.comment_id,
                        parent_comment_user_name: comment.users.name
                    }
                )}
            >
                <Text
                    style={{
                        fontSize: 12,
                    }}
                >
                    Reply
                </Text>
            </TouchableOpacity>
        </View>

    )
}

export default Comment
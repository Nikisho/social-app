import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { TextInput } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import styles from '../../utils/styles/shadow';
import { supabase } from '../../../supabase';
import { CommentScreenRouteProp, RootStackNavigationProp } from '../../utils/types/types';

const SubmitCommentScreen = () => {
  const route = useRoute<CommentScreenRouteProp>();
  const { event_id } = route.params;
  const currentUser = useSelector(selectCurrentUser);
  const [comment, setComment] = useState<string>('');
  const navigation = useNavigation<RootStackNavigationProp>();

  const handleSubmit = async () => {
    if (comment === '' || comment === null) {
      Alert.alert('Please enter a message');
      return;
    }
    const { error } = await supabase
      .from('comments')
      .insert({
        user_id: currentUser.id,
        event_id: event_id,
        text: comment
      });
    if (error) {
      throw error.message;
    }
    navigation.navigate('event',
      { event_id: event_id }
    )

  };

  return (
    <View className='m-2 space-y-3'>
      <View className='flex flex-row justify-between items-center'>
        <Text className='text-lg font-semibold'>
          Comment
        </Text>

        <TouchableOpacity style={styles.shadow}
          onPress={handleSubmit}
          className='px-3 py-1 bg-white rounded-xl'>
          <Text className=' font-semibold'>
            Post
          </Text>
        </TouchableOpacity>
      </View>

      <View
        className='border-t '>
        <TextInput
          multiline={true} 
          maxLength={280}
          placeholder='Your comment'
          value={comment}
          onChangeText={(value) => { setComment(value) }}
        />

      </View>
    </View>
  )
}

export default SubmitCommentScreen
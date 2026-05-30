import { View, Text, Image, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RootStackNavigationProp } from '../../../utils/types/types';
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import styles from '../../../utils/styles/shadow';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import platformAlert from '../../../utils/functions/platformAlert';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import colours from '../../../utils/styles/colours';
import MembersModal from './MembersModal';
import { supabase } from '../../../../supabase';

interface ChatHeaderProps {
    user_id: number;
    organizer_id: number;
    chat_room_id: number;
    users: {
        name: string;
        photo: string;
    }
}

const GroupChatHeader: React.FC<ChatHeaderProps> = ({
    users,
    chat_room_id
}) => {

    const navigation = useNavigation<RootStackNavigationProp>();
    const blurb_message = `Use this group to interact with the community.`;
    const fadeAnim = useRef(new Animated.Value(0)).current; // start invisible
    const [membersModalVisible, setMembersModalVisible] = useState(false);
    const [members, setMembers] = useState<{ name: string; photo: string; id: number }[]>([]);
    const handleViewMembers = async () => {
        setMembersModalVisible(true);
    };

    const fetchMembers = async () => {
        const { data, error } = await supabase
            .from('participants')
            .select(`
                *,
                users (
                    name,
                    photo,
                    id
                )
            `)
            .eq('chat_room_id', chat_room_id);

        if (data) {
            const formattedMembers = data.map((participant) => ({
                name: participant.users.name,
                photo: participant.users.photo,
                id: participant.users.id
            }));
            setMembers(formattedMembers);
        }
        
        if (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500, // half a second fade in
            useNativeDriver: true,
        }).start();
        fetchMembers()
    }, []);

    return (
        <>
            <View className='flex flex-row justify-between items-center bg-gray-200'>

                <View
                    className='p-2 py-3 flex flex-row space-x-3 items-center'>
                    <TouchableOpacity className='mr-1' onPress={() => { navigation.goBack() }}>
                        <Ionicons name="chevron-back-circle-outline" size={30} color="black" />
                    </TouchableOpacity>


                    <TouchableOpacity
                        className='flex flex-row space-x-3 items-center'
                        onPress={handleViewMembers}
                    >

                        {
                            users.photo === null ?
                                <>
                                    <FontAwesome name="user-circle" size={40} color="black" />
                                </> :
                                <View>

                                    <Image
                                        className='w-12 h-12 rounded-full'
                                        source={{
                                            uri: users.photo,
                                        }}
                                    />
                                </View>
                        }

                        <View className='space-y-'>
                            <Text
                                numberOfLines={1} style={{ width: 300 }}
                                className='text-black text-lg font-semibold'>
                                {users.name}
                            </Text>

                            {/* <TouchableOpacity
                                onPress={handleViewMembers}
                                style={styles.shadow}
                                className='flex flex-row justify-center bg-white items-center space-x-2  rounded-full w-2/3 p-1 px-2'>
                                <MaterialIcons name="groups" size={24} color="black" />
                                <Text className='text- font-semibold'>View members</Text>
                            </TouchableOpacity> */}

                            <Text className='text-gray-500 text-sm italic'>
                                Community chat
                            </Text>
                        </View>

                    </TouchableOpacity>

                </View>

                {/* <TouchableOpacity onPress={() => setOpenDropDown(!openDropDown)}>
                <Entypo name="dots-three-vertical" size={24} color="black" />
            </TouchableOpacity> */}
                {/* {
                openDropDown &&
                <View className='w-full absolute right-5 flex flex-row justify-end'>
                    <TouchableOpacity
                        onPress={blockAndReportUser}
                        className=' p-3 bg-red-200 rounded-l-full flex justify-between flex-row mx-2' style={styles.shadowButtonStyle}>
                        <Text className='text-white font-semibold'>Block and report</Text>
                    </TouchableOpacity>
                </View>
            } */}
            </View>

            {/* blurb pin messages */}
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    borderTopWidth: 1,
                    borderColor: '#ccc',
                }}
                className="p-3 px-3 flex-row space-x-2 bg-gray-200"
            >
                <MaterialCommunityIcons name="pin" size={24} color="black" />
                <View className="flex-1">
                    <Text className="text-wrap">{blurb_message}</Text>
                </View>
            </Animated.View>
            <MembersModal
                modalVisible={membersModalVisible}
                setModalVisible={setMembersModalVisible}
                members={members}
                chat_room_id={chat_room_id}
                onClose={() => setMembersModalVisible(false)}

            />
        </>

    )
}

export default GroupChatHeader
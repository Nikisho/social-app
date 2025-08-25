import { View, Text, Image, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import Entypo from '@expo/vector-icons/Entypo';
import styles from '../../../utils/styles/shadow';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getColorFromName } from '../../../utils/functions/getColorFromName';
import { AntDesign } from '@expo/vector-icons';

interface ChatHeaderProps {
    name: string;
    photo: string;
    user_id: number;
    blockAndReportUser: () => void;
    onlineStatus: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    name,
    photo,
    user_id,
    blockAndReportUser,
    onlineStatus
}) => {

    const navigation = useNavigation<RootStackNavigationProp>();
    const [openDropDown, setOpenDropDown] = useState<boolean>(false);
    const blurb_message = `Welcome to Linkzy Support. This chat connects you directly with our team for assistance. Please describe your issue or question below, and we’ll respond as soon as possible.`;
    const fadeAnim = useRef(new Animated.Value(0)).current; // start invisible

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);
    return (
        <>
            <View className='flex flex-row justify-between items-center bg-gray-200'>

                <TouchableOpacity
                    onPress={() => navigation.navigate('profile',
                        { user_id: user_id }
                    )}
                    // style={{backgroundColor: colours.secondaryColour}}
                    className='p-2 py-3 flex  flex-row space-x-3 items-center '>
                    <TouchableOpacity className='mr-2' onPress={() => { navigation.goBack() }}>
                        <Ionicons name="chevron-back-circle-outline" size={30} color="black" />
                    </TouchableOpacity>
                    {
                        photo === null ?
                            <View
                                style={{
                                    backgroundColor: getColorFromName(name),
                                    width: 45,
                                    height: 45,
                                    borderRadius: 30,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 5,
                                    borderWidth: 1
                                }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                    {name.charAt(0).toUpperCase()}
                                </Text>
                            </View>

                            :
                            <>
                                <Image
                                    className='w-12 h-12 rounded-full'
                                    source={{
                                        uri: photo,
                                    }}
                                />
                            </>
                    }
                    <View>
                        <Text
                            numberOfLines={1} style={{ width: 200 }}
                            className='text-black text-lg'>
                            {name}
                        </Text>
                        {/* <Text>
                        {onlineStatus}
                    </Text> */}
                    </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpenDropDown(!openDropDown)}>
                    <Entypo name="dots-three-vertical" size={24} color="black" />
                </TouchableOpacity>
                {
                    openDropDown &&
                    <View className='w-full absolute right-5 flex flex-row justify-end'>
                        <TouchableOpacity
                            onPress={blockAndReportUser}
                            className=' p-3 bg-red-200 rounded-l-full flex justify-between flex-row mx-2' style={styles.shadowButtonStyle}>
                            <Text className='text-white font-semibold'>Block and report</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            {
                user_id === 386 && (
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            borderTopWidth: 1,
                            borderColor: '#ccc',
                        }}
                        className="p-3 px-3 flex-row space-x-3 bg-gray-200"
                    >
                        {/* <AntDesign name="pushpino" size={20} color="black" /> */}
                        <View className="flex-1">
                            <Text className="text-wrap">{blurb_message}</Text>
                        </View>
                    </Animated.View>
                )
            }
        </>


    )
}

export default ChatHeader
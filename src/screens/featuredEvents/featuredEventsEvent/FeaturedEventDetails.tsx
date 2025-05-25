import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Hyperlink from 'react-native-hyperlink'
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday'
import FastImage from 'react-native-fast-image'

interface EventDataProps {
    description: string;
    price: string;
    time: string;
    location: string;
    image_url: string;
    is_free: boolean;
    date: Date;

}
const FeaturedEventDetails: React.FC<EventDataProps> = ({
    image_url,
    location,
    description,
    date,
    time
}) => {
    const [textShown, setTextShown] = useState(false); //To show ur remaining Text
    const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
    const toggleNumberOfLines = () => { //To toggle the show text or hide it
        setTextShown(!textShown);
    };
    const onTextLayout = useCallback((e: any) => {
        setLengthMore(e.nativeEvent.lines.length >= 4);
    }, []);

    const url = `${image_url.split('?')[0]}?t=${Date.now()}`;
    
    return (
        <>
            <FastImage
                source={{
                    uri: image_url
                }}
                className='w-full h-80 oversize-hidden mt-3 rounded-xl'
            />

            <Text className='px-3 my-2 text-amber-800 text-lg font-semibold' >
                {
                    date && time && (formatDateShortWeekday(date) + ', ' + (time).slice(0, -3))
                }
            </Text>

            <View className='px-2'>

                <View className='mb-4 flex flex-row items-center'>
                    <Entypo name="location-pin" size={24} color="black" />

                    <Text className='text-lg'>
                        {location}
                    </Text>
                </View>

                <Text className='text-2xl font-bold mt-3 mb-2'>
                    Event info
                </Text>
                <Hyperlink
                    linkDefault={true}
                    linkStyle={{ color: "blue", textDecorationLine: 'underline' }}
                >

                    <Text
                        onTextLayout={onTextLayout}
                        numberOfLines={textShown ? undefined : 4}
                        style={{ lineHeight: 21, fontSize: 15 }}>
                        {description}
                    </Text>
                </Hyperlink>

                {
                    lengthMore ? <Text
                        onPress={toggleNumberOfLines}
                        style={{ lineHeight: 21, marginTop: 10, fontSize: 15 }}>{textShown ? 'Read less...' : 'Read more...'}</Text>
                        : null
                }
            </View>
        </>
    )
}

export default FeaturedEventDetails
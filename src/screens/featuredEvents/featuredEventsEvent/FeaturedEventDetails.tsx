import { View, Text, TouchableOpacity, Share } from 'react-native'
import React, { useCallback, useState } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Hyperlink from 'react-native-hyperlink'
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday'
import FastImage from 'react-native-fast-image'
import platformAlert from '../../../utils/functions/platformAlert';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from '../../../utils/styles/shadow';

interface EventDataProps {
    description: string;
    price: string;
    time: string;
    location: string;
    image_url: string;
    is_free: boolean;
    date: Date;
    featured_event_id: number;

}
const FeaturedEventDetails: React.FC<EventDataProps> = ({
    image_url,
    location,
    description,
    date,
    time,
    featured_event_id
}) => {
    const { t } = useTranslation();
    const [textShown, setTextShown] = useState(false); //To show ur remaining Text
    const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
    const toggleNumberOfLines = () => { //To toggle the show text or hide it
        setTextShown(!textShown);
    };
    const onTextLayout = useCallback((e: any) => {
        setLengthMore(e.nativeEvent.lines.length >= 4);
    }, []);

    const handleShareEventLink = async () => {
        try {

            const result = await Share.share({
                message: `https://linkzyapp.com/event.html?featured_event_id=${featured_event_id}`
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }

        } catch (error: any) {
            platformAlert(error.message);
        }
    };

    return (
        <>
            <FastImage
                source={{
                    uri: image_url
                }}
                className='
                    flex items-end
                    justify-end
                    w-full h-80 oversize-hidden mt-3 rounded-xl'
            >
                <TouchableOpacity 
                    onPress={() => handleShareEventLink()}
                    style={styles.shadowButtonStyle}
                    className='bg-black p-3 m-5 rounded-full justify-center flex'>
                    <Ionicons name="share-social-outline" size={25} color="white" />
                </TouchableOpacity>
            </FastImage>

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
                    {t('featured_event_screen.event_info')}
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
                        style={{ lineHeight: 21, marginTop: 10, fontSize: 15 }}>{textShown ? `${t('featured_event_screen.read_less')}...` :` ${t('featured_event_screen.read_more')}...`}</Text>
                        : null
                }
            </View>
        </>
    )
}

export default FeaturedEventDetails
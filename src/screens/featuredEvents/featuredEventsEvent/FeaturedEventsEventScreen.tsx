import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import SecondaryHeader from '../../../components/SecondaryHeader'
import { ScrollView } from 'react-native-gesture-handler'
import colours from '../../../utils/styles/colours'
import Entypo from '@expo/vector-icons/Entypo';
import Hyperlink from 'react-native-hyperlink'

const FeaturedEventsEventScreen = () => {
    const [textShown, setTextShown] = useState(false); //To show ur remaining Text
    const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
    const toggleNumberOfLines = () => { //To toggle the show text or hide it
        setTextShown(!textShown);
    }

    const onTextLayout = useCallback((e: any) => {
        setLengthMore(e.nativeEvent.lines.length >= 4);
    }, []);
    const data = {
        id: 2,
        image: 'https://dice-media.imgix.net/attachments/2025-04-11/e0eaae14-607c-478e-9369-1d237abf199d.jpg?rect=0%2C0%2C1080%2C1080&auto=format%2Ccompress&q=80&w=204&h=204&fit=crop&crop=faces%2Ccenter&dpr=1',
        title: 'Yaeji',
        date: 'Thu, 23 Oct',
        location: 'Alexandra Palace',
        price: '£36.23',
        description: `This event will take place in EartH Hall.

*This will be a DJ set*

Last Entry 1am

"Instead of trying to scrape the wallflowers from the club’s dark corners, Yaeji tends to their vines and blooms."

After her 2017 breakthrough with tracks like ‘Raingurl’ and ‘Drink I’m Sipping On’, Yaeji went on to collaborate with stars such as Robyn and, most recently, Teddy Geiger on the sensitive ‘Pink Ponies’. Last year saw the arrival of ‘booboo’, a quintessential Yaeji banger—introspective and soothing, yet playful and irresistibly club-ready.

This is a rare opportunity to catch a Yaeji headline show in London within the state of the art surroundings of Earth Hall, the basement of an iconic Art Deco theatre in Dalston.

Last entry is 1am, but be sure to arrive early; trust us!

For more information on access at EartH, please see our FAQs here: https://bit.ly/44dzl75 or contact us at access@earthackney.co.uk

EartH is a social enterprise committed to supporting new musicians, with music studios in the venue that are completely free for young artists in Hackney to use. Find out more here (https://earthackney.co.uk/about/studio-36/).
        `
    }
    return (
        <>
            <View className='p-2'>
                <ScrollView className='h-[84%]'>
                    <SecondaryHeader
                        displayText={data.title}
                    />

                    <Image
                        source={{
                            uri: data.image
                        }}
                        className='w-full h-80 oversize-hidden mt-3 rounded-xl'
                    />

                    <Text className='px-2 mt-2 text-amber-800 text-lg font-semibold' >
                        {data.date}
                    </Text>

                    <View className='px-2'>

                        <View className='mb-4 flex flex-row items-center'>
                            <Entypo name="location-pin" size={24} color="black" />

                            <Text className='text-lg'>
                                {data.location}
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
                                {data.description}
                            </Text>
                        </Hyperlink>

                        {
                            lengthMore ? <Text
                                onPress={toggleNumberOfLines}
                                style={{ lineHeight: 21, marginTop: 10, fontSize: 15 }}>{textShown ? 'Read less...' : 'Read more...'}</Text>
                                : null
                        }
                    </View>
                </ScrollView>
            </View>
            <View
                style={{
                    backgroundColor: colours.secondaryColour,

                }}
                className='absolute inset-x-0 bottom-0 h-[15%] flex justify-between flex-row items-center px-4'>
                <TouchableOpacity className='p-3 rounded-full bg-white w-1/4'
                >
                    <Text className='text-center font-bold'>
                        BOOK
                    </Text>
                </TouchableOpacity>
                <Text className='text-3xl text-white font-bold'>
                    {data.price}
                </Text>
            </View>
        </>
    )
}

export default FeaturedEventsEventScreen
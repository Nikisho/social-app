import { View, Text, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native'
import React from 'react'
import styles from '../../../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';


interface FeaturedEventCard {
    image: string;
    id: number;
    title: string;
    price: string;
    location: string;
    date: string;
}

const FeaturedEventsFeed = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const data = [
        {
            id: 1,
            image: 'https://dice-media.imgix.net/attachments/2025-04-11/e0eaae14-607c-478e-9369-1d237abf199d.jpg?rect=0%2C0%2C1080%2C1080&auto=format%2Ccompress&q=80&w=204&h=204&fit=crop&crop=faces%2Ccenter&dpr=1',
            title: 'Tennis',
            date: 'Thu, 23 Oct',
            location: 'Roundhouse',
            price: '£36.23'
        },
        {
            id: 2,
            image: 'https://dice-media.imgix.net/attachments/2025-04-11/e0eaae14-607c-478e-9369-1d237abf199d.jpg?rect=0%2C0%2C1080%2C1080&auto=format%2Ccompress&q=80&w=204&h=204&fit=crop&crop=faces%2Ccenter&dpr=1',
            title: 'Yaeji',
            date: 'Thu, 23 Oct',
            location: 'Alexandra Palace',
            price: '£36.23'
        },
        {
            id: 3,
            image: 'https://dice-media.imgix.net/attachments/2025-04-29/56212635-403f-4453-b7e4-e6c36574e9cf.jpg?rect=0%2C0%2C1080%2C1080&auto=format%2Ccompress&q=80&w=204&h=204&fit=crop&crop=faces%2Ccenter&dpr=1',
            title: 'Wilkinson',
            date: 'Thu, 23 Oct',
            location: 'Islington',
            price: '£36.23'
        },
        {
            id: 4,
            image: 'https://dice-media.imgix.net/attachments/2025-04-29/56212635-403f-4453-b7e4-e6c36574e9cf.jpg?rect=0%2C0%2C1080%2C1080&auto=format%2Ccompress&q=80&w=204&h=204&fit=crop&crop=faces%2Ccenter&dpr=1',
            title: 'Cameron Winter',
            date: 'Thu, 23 Oct',
            price: '£36.23',
            location: 'London'
        },
        {
            id: 5,
            image: 'https://dice-media.imgix.net/attachments/2025-04-10/e01153ae-7345-426c-b866-f191f34b046a.jpg?rect=0%2C0%2C780%2C780&auto=format%2Ccompress&q=80&w=204&h=204&fit=crop&crop=faces%2Ccenter&dpr=1',
            title: 'Calm Chemical Club With DRIAA',
            date: 'Thu, 23 Oct',
            location: 'Union Chapel',
            price: '£36.23'
        },
    ]


    const renderItem = ({ item }: { item: FeaturedEventCard }) => {
        return (
            <TouchableOpacity
                className='my-2
                    rounded-xl border bg-white p-2
                '
                onPress={() => navigation.navigate('featuredEventsEvent')}
            >
                <ImageBackground
                    source={{ uri: item.image }}
                    className="w-full h-80 rounded-xl overflow-hidden justify-end"
                >
                    <View className="p-2 bg-black w-20 text-center mx-2 my-4 rounded-lg">
                        <Text className="text-lg text-center text-white">
                            {item.price}
                        </Text>
                    </View>
                </ImageBackground>
                <Text
                    className='text-3xl font-bold my-2'
                >
                    {item.title}
                </Text>
                <Text className='text-amber-800'>
                    {item.date}
                </Text>
                <Text>
                    {item.location}
                </Text>
            </TouchableOpacity>
        )
    };
    return (
        <View className='p-2 px-4
                h-[88%]
                mx-[-8]
                space-y-2
        '>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    )
}

export default FeaturedEventsFeed
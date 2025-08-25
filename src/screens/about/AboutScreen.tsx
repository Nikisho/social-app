import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import SecondaryHeader from '../../components/SecondaryHeader'

const AboutScreen = () => {
    const logoUrl = 'https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/app_assets/logo.png';
    return (
        <View className='h-full'>
            <SecondaryHeader displayText='About Linkzy' />
            <ScrollView className="flex-1 p-4">
                {/* Brand Logo */}
                <View className="items-center mb-6">
                    <Image
                        source={{
                            uri: logoUrl
                        }} 
                        className="w-40 h-40 mb-2"
                        resizeMode="contain"
                    />
                    <Text className="text-gray-500 italic">
                        Linkzy - Turn clicks into connections
                    </Text>
                </View>
                <Text className="text-xl font-semibold mb-2">Our Mission</Text>
                <Text className="text-gray-700 mb-6 leading-relaxed">
                    Linkzy was created to make discovering and joining community-driven
                    experiences simple, fun, and meaningful.
                    {"\n\n"}
                    We believe that social connections grow best in smaller, friendlier
                    spaces, whether that’s trying a new hobby, networking with like-minded
                    people, or enjoying casual get-togethers.
                    {"\n\n"}
                    Our mission is to empower creators and hosts to bring people together,
                    while giving attendees an easy way to find events that matter to them.
                </Text>

                <Text className="text-xl font-semibold mb-2">Key Features</Text>
                <View className="mb-10">
                    <Text className="text-gray-700 mb-2">• Discover events curated by local hosts</Text>
                    <Text className="text-gray-700 mb-2">• Buy tickets easily with secure payments</Text>
                    <Text className="text-gray-700 mb-2">• Chat with attendees before and after events</Text>
                    <Text className="text-gray-700 mb-2">• Filter by interests to find events you’ll love</Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default AboutScreen
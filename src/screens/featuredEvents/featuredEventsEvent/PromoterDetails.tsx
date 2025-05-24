import { View, Text, Image } from 'react-native'
import React from 'react'

interface PromoterDetailsProps {
    organizers : {
        users : {
            photo:string;
            name:string;
        }
    }
}
const PromoterDetails:React.FC<PromoterDetailsProps> = ({
    organizers,
}) => {
    return (
        <View className='p-2'>
            <Text className='text-xl font-bold'>
                Promoter
            </Text>
            <View className='flex flex-row border items-center  space-x-5 rounded-xl p-2 my-3'>
                <Image
                    className='w-10 h-10 rounded-full'
                    source={{
                        uri: organizers?.users.photo
                    }}
                />
                <Text className='text-xl'>
                    {organizers?.users.name}
                </Text>
            </View>
        </View>
    )
}

export default PromoterDetails
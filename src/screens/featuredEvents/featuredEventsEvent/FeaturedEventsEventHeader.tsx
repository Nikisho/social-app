import { View } from 'react-native'
import React from 'react'
import SecondaryHeader from '../../../components/SecondaryHeader';

interface FeaturedEventsEventHeaderProps {
    title: string;
}

const FeaturedEventsEventHeader: React.FC<FeaturedEventsEventHeaderProps> = ({
    title
}) => {
    return (
        <View className=''>
            <SecondaryHeader
                displayText={title!}
            />
        </View>
    )
}

export default FeaturedEventsEventHeader
import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import SimpleCheckbox from '../../components/SimpleCheckbox';

interface CompletionTrackerProps {
    bio: string;
    photo: string;
    interests: any
}

const CompletionTracker: React.FC<CompletionTrackerProps> = ({
    bio,
    photo,
    interests
}) => {
    const [progress, setProgress] = useState<number>(0);
    const progressPercentage = Math.round(progress);
    useEffect(() => {
        let completed = 0;

        if (bio) completed += 1;
        if (photo) completed += 1;
        if (interests?.length >= 3) completed += 1;

        setProgress((completed / 3) * 100);
    }, [bio, photo, interests]);

    return (
        <>
            {
                progressPercentage !== 100 &&
                <>
                    <Text className="text-lg mb-2 font-semibold">Complete your profile</Text>
                    <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </View>
                    <Text className="mt-2 text-sm text-gray-600">{progressPercentage}% complete</Text>
                    <View className='mt-2'>
                        <View className='flex flex-row'>
                            <SimpleCheckbox
                                label='Write a description'
                                checked={bio !== null}
                            />
                        </View>
                        <View className='flex flex-row'>
                            <SimpleCheckbox
                                label='Select 3 interests'
                                checked={interests?.length > 3}
                            />
                        </View>
                        <View className='flex flex-row'>
                            <SimpleCheckbox
                                label='Add a photo'
                                checked={photo !== null}
                            />
                        </View>
                    </View>
                </>
            }
        </>
    )
}

export default CompletionTracker;
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { UpdateInterestsScreenRouteProps } from '../../utils/types/types'
import { useNavigation, useRoute } from '@react-navigation/native'
import ProfileInterestsSelector from '../../components/ProfileInterestsSelector'
import { supabase } from '../../../supabase'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../context/navSlice'
import LoadingScreen from '../loading/LoadingScreen'
import platformAlert from '../../utils/functions/platformAlert'


interface InterestsProps {
    interestCode: number;
    interestGroupCode: number
};

const UpdateInterestsScreen = () => {
    const route = useRoute<UpdateInterestsScreenRouteProps>();
    const [loading, setLoading] = useState<boolean>();
    const currentUser = useSelector(selectCurrentUser);
    const navigation = useNavigation();
    const { user_interests } = route.params;
    const mappedInterests = user_interests.map(item => ({
        interestCode: item.interest_code,
        interestGroupCode: item.interest_group_code
    }));


    // have to code it this way because we are reusing the sign up component
    const [ userDetails, setUserDetails ] = useState({
        userInterests: mappedInterests
    })
    function updateFields(fields: Partial<any>) {
        setUserDetails((prev: any) => {
            return { ...prev, ...fields }
        })
    };

    const updateinterests = async () => {
        setLoading(true);
        const { error:clearInterestsError } = await supabase
            .from('user_interests')
            .delete()
            .eq('user_id', currentUser.id)
        if (clearInterestsError) {
            console.error(clearInterestsError.message);
        }
        const userInterestsData = userDetails.userInterests.map((interest) => ({
            user_id: currentUser.id,
            interest_code: interest.interestCode,
            interest_group_code: interest.interestGroupCode,
        }));
        const { error } = await supabase
            .from('user_interests')
            .insert(userInterestsData)
        if (error) { console.error(error.message) }
        setLoading(false);
        navigation.goBack();
        platformAlert('Interests updated successfully.');
    };

    if (loading) {
        return <LoadingScreen
                    displayText='Saving interests'
                />
    }
    return (
        <View>
            <View className='w-full py-5 flex flex items-center my-3'>
                <Text className='text-2xl font-semibold '>
                    Update your interests
                </Text>
                <Text className='my-2'>
                    Choose up to five options!
                </Text>
            </View>
            <ProfileInterestsSelector
                userInterests={userDetails.userInterests}
                updateFields={updateFields}
            />
            <View className='flex flex-row w-full py-10 justify-center space-x-20'>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className='bg-red-400 rounded-full  p-3 w-1/3'>
                    <Text className='font-bold text-center'>
                        Cancel
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={updateinterests}
                    className='bg-blue-400 rounded-full p-3 w-1/3'>
                    <Text className='text-center font-bold'>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default UpdateInterestsScreen
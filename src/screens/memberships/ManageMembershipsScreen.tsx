import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import SecondaryHeader from '../../components/SecondaryHeader'
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';

const ManageMembershipsScreen = () => {
    const [membershipLevels, setMembershipLevels] = useState([]);
    const navigation = useNavigation<RootStackNavigationProp>();

    const fetchMembershipLevels = async () => {
        // console.log('hi')
    };

    useEffect(() => {
        fetchMembershipLevels();
    },)

    return (
        <View className='h-4/5'>
            <SecondaryHeader
                displayText='Memberships'
            />

            {
                membershipLevels?.length === 0 ?
                    <View className="bg-red-20 flex-1 justify-center items-center p-6">
                        <Text className="text-xl font-semibold text-gray-800 text-center">
                            No memberships found
                        </Text>
                        <Text className="mt-3 text-center text-gray-500 text-base leading-relaxed">
                            Add up to 3 membership tiers for your club. Give each a name, describe the perks,
                            and set a monthly or yearly price. Members will get access to exclusive benefits
                            and event discounts. 🚀
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("createmembership")}
                            className="mt-6 px-6 py-3 bg-black rounded-xl"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white text-lg font-medium text-center">
                                Create Membership Plans ✨
                            </Text>
                        </TouchableOpacity>
                    </View> :
                    <>
                    </>
            }
        </View>
    )
}

export default ManageMembershipsScreen
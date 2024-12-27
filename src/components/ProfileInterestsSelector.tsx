import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import LoadingView from './InterestsLoader';

interface UserDataProps {
    userInterests: {
        interestCode: number;
        interestGroupCode: number
    }[];
};
interface Interest {
    description: string;
    code: number;
}
  
  interface InterestGroup {
    name: string;
    code: number;
    interests: Interest[];
}
interface ProfileInterestsSelectorProps extends UserDataProps {
    updateFields: (fields: Partial<UserDataProps>) => void;
}
const ProfileInterestsSelector:React.FC<ProfileInterestsSelectorProps> = ({
    userInterests,
    updateFields
}) => {
    const [interestGroups, setInterestGroups] = useState< InterestGroup[] | null>();
    const maxNumberOfInterests = 10;
    const [loading, setLoading] = useState<boolean>(false);
    const fetchInterests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('interests')
            .select(`
          *,
          interest_groups (
            interest_group_description,
            interest_group_code
          )
        `);

        if (data) {
            const interestGroups = data.reduce((acc, interest) => {  
                const groupCode = interest.interest_groups.interest_group_code;
                const groupName = interest.interest_groups.interest_group_description;
                const interestCode = interest.interest_code;
                const interestDescription = interest.description;
              
                // Find the group by code or create a new one
                let group = acc.find((g: {code: number}) => g.code === groupCode);
                if (!group) {
                  group = { name: groupName, code: groupCode, interests: [] };
                  acc.push(group);
                }
              
                // Add the interest to the group
                group.interests.push({ description: interestDescription, code: interestCode });
              
                return acc;
              }, []);
            setInterestGroups(interestGroups)
            setLoading(false);
        }
        if (error) throw error.message;
        setLoading(false);
    };

    const selectInterests = async (interest: { description: string; code: number }, interestGroup: any) => {
        // Check if the maximum number of interests has been reached
        if (userInterests && userInterests.length >= maxNumberOfInterests && !userInterests?.some((item: any) => item.interestCode === interest.code)) {
            return;
        }
        const interestObject = {
            interestCode: interest.code,
            interestGroupCode: interestGroup.code,
        };
        const isSelected = userInterests?.some((item: any) => item.interestCode === interest.code);
        if (isSelected) {
            // If selected, remove it from the interests
            const updatedInterests = userInterests.filter(item => item.interestCode !== interest.code);
            updateFields({ userInterests: updatedInterests });
        } else {
            // Check if the maximum number of interests has been reached
            if (userInterests.length < maxNumberOfInterests) {
                // If not selected, add it to the interests
                updateFields({ userInterests: [...userInterests, interestObject] });
            }
        }
    };

    useEffect(() => {
        fetchInterests();
    }, []);

    if (loading) {

       return (
            <View className='h-[65%]'>
                <LoadingView/>
            </View>
       )
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            style={styles.scrollView}
        >
            {interestGroups?.map((interestGroup) => (
                <View key={interestGroup.name} style={styles.groupContainer}>
                    <Text style={styles.groupTitle}>{interestGroup.name}</Text>

                    <View style={styles.interestsContainer}>
                        {interestGroup.interests.map((interest) => {
                            // Check if the interest is selected
                            const isSelected = userInterests?.some((item: any) => item.interestCode === interest.code);
                            return (
                                <TouchableOpacity
                                    key={interest.code} // Add a unique key here
                                    onPress={() => selectInterests(interest, interestGroup)}
                                    style={[styles.interestButton, isSelected && styles.selectedInterest]}
                                >
                                    <Text style={styles.interestText}>
                                        {interest.description}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}

export default ProfileInterestsSelector

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10, // You can adjust this value to reduce space
    },
    headerContainer: {
        marginLeft: 8,
        width: '80%',
        marginBottom: 0,
        flex: 1,
        marginTop: 20, // Adjust this value to reduce the space between header and ScrollView
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subHeaderText: {
        paddingVertical: 8,
    },
    scrollContainer: {
        paddingHorizontal: 12,
        flexGrow: 1,
    },
    groupContainer: {
        marginBottom: 24,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 0,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    interestButton: {
        backgroundColor: '#f0f0f0',
        padding: 8,
        margin: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    selectedInterest: {
        backgroundColor: '#1E90FF', // Highlighted background color for selected interests
        borderColor: '#388e3c',
    },
    interestText: {
        color: '#000',
    },
    scrollView: {
        width: '100%',
        height: '60%',
    },
});

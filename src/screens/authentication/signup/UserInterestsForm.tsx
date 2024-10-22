import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import ProfileInterestsSelector from '../../../components/ProfileInterestsSelector';

interface UserDataProps {
    userInterests: {
        interestCode: number;
        interestGroupCode: number
    }[];
};

interface UserPhotoFormProps extends UserDataProps {
    updateFields: (fields: Partial<UserDataProps>) => void;
};
const UserInterestsForm: React.FC<UserPhotoFormProps> = ({
    userInterests,
    updateFields
}) => {
    return (
        <View style={styles.container}>
            <View className='flex mt-14 mb-6'>
                <Text style={styles.headerText}>
                    Help us match you with the right experiences!
                </Text>
                <Text style={styles.subHeaderText}>
                    Select five interests to personalise your journey.
                </Text>
            </View>
            <ProfileInterestsSelector 
                userInterests={userInterests}
                updateFields={updateFields}
            />
        </View>
    );
};

export default UserInterestsForm;

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

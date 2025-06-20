import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackNavigationProp } from '../../utils/types/types';

const NoMessagesView = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const handleConnect = () => {
        navigation.navigate('featuredEvents');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.message}>
                You haven't received any messages yet.
            </Text>
            <Text style={styles.subMessage}>
                Start connecting with others to receive messages!
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleConnect}>
                <Text style={styles.buttonText}>Start Connecting</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NoMessagesView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#f4f4f4', // Light background color
        padding: 20,
    },
    message: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black', 
        textAlign: 'center',
        marginBottom: 8,
    },
    subMessage: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#000000', // Bright action color
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff', // White text for contrast
        fontWeight: 'bold',
        fontSize: 16,
    },
});

import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet, Easing } from 'react-native'; // Import Easing separately
import colours from '../../utils/styles/colours';

interface LoadingScreenProps {
    displayText: string;
}
const LoadingScreen:React.FC<LoadingScreenProps> = ({
    displayText
}) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const pulse = () => {
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15, // Slightly increase size
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1, // Return to normal size
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ]).start(() => pulse()); // Repeat animation
        };

        const rotate = () => {
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 5000, // Slow rotation
                    useNativeDriver: true,
                    easing: Easing.linear, // Corrected Easing import
                })
            ).start();
        };

        pulse();
        rotate();
    }, [pulseAnim, rotateAnim]);

    const rotateInterpolation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View 
                style={[
                    styles.pulseCircle, 
                    { 
                        transform: [
                            { scale: pulseAnim },
                            { rotate: rotateInterpolation },
                        ]
                    }
                ]}
            />
            <Text style={styles.loadingText}>{displayText}</Text>
        </View>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4', // Light, minimal background
    },
    pulseCircle: {
        width: 120,
        height: 120,
        borderRadius: 60, // Circular shape
        // backgroundColor: 'rgba(71, 107, 125, 0.2)', // Light theme color with transparency
        backgroundColor: colours.primaryColour, // Light theme color with transparency
        shadowColor: '#476b7d',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#476b7d', // Theme color for text
        fontWeight: '500',
    },
});

import { View, Text, StyleSheet, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'

const LoadingScreen = () => {
    const dot1Anim = useRef(new Animated.Value(0)).current;
    const dot2Anim = useRef(new Animated.Value(0)).current;
    const dot3Anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateDot = (dotAnim:any, delay:any) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(dotAnim, {
                        toValue: -10, // Move up
                        duration: 300,
                        delay: delay,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dotAnim, {
                        toValue: 0, // Move down to original position
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        animateDot(dot1Anim, 0);
        animateDot(dot2Anim, 500);
        animateDot(dot3Anim, 1000);
    }, [dot1Anim, dot2Anim, dot3Anim]);
    return (
        <View className='h-full flex items-center justify-center'>
            <View style={styles.container}>
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot1Anim }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot2Anim }] }]} />
                <Animated.View style={[styles.dot, { transform: [{ translateY: dot3Anim }] }]} />
                
            </View>
        </View>
    )
}

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dot: {
      width: 15,
      height: 15,
      borderRadius: 10,
      backgroundColor: '#000',
      marginHorizontal: 5,
    },
  });
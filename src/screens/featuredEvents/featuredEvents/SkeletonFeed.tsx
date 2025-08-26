import { View, Animated, Easing, FlatList } from 'react-native';
import { useEffect, useRef } from 'react';

const SkeletonCard = () => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-300, 300], // adjust based on card width
  });

  return (
    <View className="my-2 rounded-xl border bg-white p-2 overflow-hidden">
      {/* Image */}
      <View className="w-full h-80 rounded-xl bg-gray-300 overflow-hidden relative">
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '30%',
            backgroundColor: '#e0e0e0',
            transform: [{ translateX }],
            opacity: 0.5,
          }}
        />
      </View>

      {/* Text content */}
      <View className="p-1">
        <View className="h-8 w-3/4 my-2 rounded-lg bg-gray-300" />
        <View className="h-4 w-1/2 mb-1 rounded-lg bg-gray-300" />
        <View className="h-4 w-2/3 rounded-lg mb-2 bg-gray-300" />
        <View className="h-6 w-2/3 mt-2 rounded-full bg-gray-300" />
      </View>
    </View>
  );
};

export const SkeletonFeed = () => {
  return (
    <FlatList
      data={[...Array(5)]} // number of skeleton cards
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => <SkeletonCard />}
    />
  );
};

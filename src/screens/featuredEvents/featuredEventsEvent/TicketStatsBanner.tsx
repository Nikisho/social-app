import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../../utils/styles/shadow';

type TicketStatsBannerProps = {
  sold: number;
  max: number;
};

const TicketStatsBanner: React.FC<TicketStatsBannerProps> = ({ sold, max }) => {
  const percentage = Math.round((sold / max) * 100);

  return (
    <View 
        style={styles.shadow}
        className="bg-white/80 mx- mt-4 rounded-2xl p-4 flex-row items-center justify-between">
      <View>
        <Text className="text-black/70 text-base font-semibold">Tickets Sold</Text>
        <Text className="text-black text-lg font-bold">
          {sold} / {max}
        </Text>
      </View>
      <View className="bg-black/10 rounded-full px-3 py-1">
        <Text className="text-black font-semibold text-sm">{percentage}% full</Text>
      </View>
    </View>
  );
};

export default TicketStatsBanner

import { StatusBar } from 'expo-status-bar';
import {  Text, View } from 'react-native';
import Navbar from './src/components/Navbar';

export default function App() {
  return (
    <View className="flex  h-full">
      <Navbar/>
    </View>
  );
}

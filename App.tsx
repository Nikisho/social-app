import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from './src/components/Navbar';
import HomeScreen from './src/screens/home/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider className="">
      <SafeAreaView className='flex h-full bg-yellow-200'>
        <HomeScreen />
        <Navbar />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from './src/components/Navbar';
import HomeScreen from './src/screens/home/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import ProfileScreen from './src/screens/profile/ProfileScreen';


const Stack = createStackNavigator();
const mainTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF59D'
  },
};
export default function App() {
  return (
    <SafeAreaProvider className="">
      <SafeAreaView className='flex h-full bg-yellow-200'>
        <NavigationContainer theme={mainTheme} >
          <Stack.Navigator screenOptions={{
            headerShown: false
          }} >
            <Stack.Screen name="home" component={HomeScreen} />
            <Stack.Screen name="profile" component={ProfileScreen} />
          </Stack.Navigator>
          <Navbar />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from './src/components/Navbar';
import HomeScreen from './src/screens/home/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import LoginScreen from './src/screens/login/LoginScreen';
import { Provider,  useSelector } from 'react-redux';
import { selectCurrentUser  } from './src/context/navSlice';
import { store } from './src/context/store';
import SubmitScreen from './src/screens/submit/SubmitScreen';

const Stack = createStackNavigator();
const mainTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FEF08A'
  },
};
export default function AppWrapper() {
  return (
    <Provider store={store}> 
      <App /> 
    </Provider>
  )
}

function App() {
  const currentUser = useSelector(selectCurrentUser);
  return (
      <SafeAreaProvider className=''>
        <SafeAreaView className='flex h-full p-2 bg-yellow-200'>
          <NavigationContainer theme={mainTheme} >
            <Stack.Navigator screenOptions={{
              headerShown: false
            }} >
              {currentUser === null ?
                (
                  <Stack.Screen name="signin" component={LoginScreen} />
                ) : (
                  <>
                    <Stack.Screen name="home" component={HomeScreen} />
                    <Stack.Screen name="profile" component={ProfileScreen} />
                    <Stack.Screen name="submit" component={SubmitScreen} />
                  </>
                )
              }
            </Stack.Navigator>
            {
              currentUser &&
              <Navbar />
            }
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
  );
}

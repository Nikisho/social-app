import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from './src/components/Navbar';
import HomeScreen from './src/screens/home/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import { Provider, useSelector } from 'react-redux';
import { selectCurrentUser } from './src/context/navSlice';
import { store } from './src/context/store';
import SubmitScreen from './src/screens/submit/SubmitScreen';
import SignUpScreen from './src/screens/authentication/SignUpScreen';
import SignInScreen from './src/screens/authentication/SignInScreen';

const Stack = createStackNavigator();
const mainTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#a7f3d0'
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
      <SafeAreaView className='flex h-full  bg-emerald-200'>
        <NavigationContainer theme={mainTheme} >
          <Stack.Navigator screenOptions={{
            headerShown: false
          }} >
            {currentUser.id === null ?
              (
                <>
                  <Stack.Screen name="signup" component={SignUpScreen} />
                  <Stack.Screen name="signin" component={SignInScreen} />
                </>

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
            currentUser.id &&
            <Navbar />
          }
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

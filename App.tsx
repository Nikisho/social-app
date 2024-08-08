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
import SignUpScreen from './src/screens/authentication/signup/SignUpScreen';
import SignInScreen from './src/screens/authentication/signin/SignInScreen';
import EventScreen from './src/screens/event/EventScreen';
import colours from './src/utils/styles/colours';
import { Keyboard, View } from 'react-native';
import SubmitCommentScreen from './src/screens/comments/SubmitCommentScreen';
import { useEffect, useState } from 'react';
import ChatListScreen from './src/screens/chats/ChatListScreen';
import ChatScreen from './src/screens/chats/ChatScreen';

const Stack = createStackNavigator();
const mainTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colours.primaryColour
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

  //check keyboard listener to ensure the navbar is hidden when the keyboard is up
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    // <SafeAreaProvider className=''>
    <View className='flex h-full' style={{ backgroundColor: colours.primaryColour }}>
      <NavigationContainer theme={mainTheme}  >
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
                <Stack.Screen name="event" component={EventScreen} />
                <Stack.Screen name="comment" component={SubmitCommentScreen} />
                <Stack.Screen name="chatlist" component={ChatListScreen} />
                <Stack.Screen name="chat" component={ChatScreen} />
              </>
            )
          }
        </Stack.Navigator>
        {
          currentUser.id && !isKeyboardVisible &&
          <Navbar />
        }
      </NavigationContainer>
    </View>
    // </SafeAreaProvider>
  );
}

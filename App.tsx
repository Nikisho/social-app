import 'react-native-gesture-handler';
import Navbar from './src/components/Navbar';
import HomeScreen from './src/screens/home/HomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer, useNavigationState } from '@react-navigation/native';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import { Provider, useSelector } from 'react-redux';
import { selectCurrentUser } from './src/context/navSlice';
import { store } from './src/context/store';
import SubmitScreen from './src/screens/submit/SubmitScreen';
import SignUpScreen from './src/screens/authentication/signup/SignUpScreen';
import SignInScreen from './src/screens/authentication/signin/SignInScreen';
import EventScreen from './src/screens/event/EventScreen';
import colours from './src/utils/styles/colours';
import { Keyboard, SafeAreaView, View } from 'react-native';
import SubmitCommentScreen from './src/screens/comments/SubmitCommentScreen';
import { useEffect, useState } from 'react';
import ChatListScreen from './src/screens/chats/ChatListScreen';
import ChatScreen from './src/screens/chats/ChatScreen';
import EmailSignUp from './src/screens/authentication/signup/EmailSignUp';
import EmailSignIn from './src/screens/authentication/signin/EmailSignIn';
import SearchScreen from './src/screens/search/SearchScreen';
import { usePushNotifications } from './src/utils/functions/usePushNotifications';
import { supabase } from './supabase';

const Stack = createStackNavigator();
const mainTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colours.primaryColour
  },
};

// fix provider bug for redux
export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

function App() {
  const currentUser = useSelector(selectCurrentUser);
  const { expoPushToken } = usePushNotifications();
  const updateExpoPushToken = async () => {
    if (currentUser.id === null) {
      return;
    }
    const { error } = await supabase
      .from('users')
      .update({
        expo_push_token: expoPushToken?.data
      })
      .eq('id', currentUser.id)
    if (error) { console.error(error.message); }

  };

  useEffect(() => {
    updateExpoPushToken();
  }, []);

  return (
    <SafeAreaView className='h-full' style={{ backgroundColor: colours.primaryColour }}>
      <NavigationContainer theme={mainTheme}  >
        <Stack.Navigator screenOptions={{
          headerShown: false
        }} >
          {currentUser.id === null ?
            (
              <>
                <Stack.Screen name="signup" component={SignUpScreen} />
                <Stack.Screen name="signin" component={SignInScreen} />
                <Stack.Screen name="emailsignup" component={EmailSignUp} />
                <Stack.Screen name="emailsignin" component={EmailSignIn} />

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
                <Stack.Screen name="search" component={SearchScreen} />
              </>
            )
          }
        </Stack.Navigator>

        {/* Only show the conditional navbar if the user is logged in */}
        {
          currentUser.id &&
          <ConditionalNavbar />
        }
      </NavigationContainer>
    </SafeAreaView>
  );
}

const ConditionalNavbar = () => {

  //Hide the navbar if the kayboard is up and if we're pn the chat screeen.
  const currentRouteName = useNavigationState(state => state?.routes[state.index]?.name);

  // Determine whether to show the Navbar
  const showNavbar = currentRouteName !== 'chat';
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
    <>
      {showNavbar &&
        !isKeyboardVisible &&
        <Navbar />}
    </>
  );
};
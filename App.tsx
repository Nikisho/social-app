import 'react-native-gesture-handler';
import Navbar from './src/components/Navbar';
import HomeScreen from './src/screens/home/HomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer, useNavigationState } from '@react-navigation/native';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, setCurrentUser } from './src/context/navSlice';
import { store } from './src/context/store';
import SubmitScreen from './src/screens/submit/SubmitScreen';
import SignUpScreen from './src/screens/authentication/signup/SignUpScreen';
import SignInScreen from './src/screens/authentication/signin/SignInScreen';
import EventScreen from './src/screens/event/EventScreen';
import colours from './src/utils/styles/colours';
import { Keyboard, Platform, SafeAreaView, View } from 'react-native';
import SubmitCommentScreen from './src/screens/comments/SubmitCommentScreen';
import { useCallback, useEffect, useState } from 'react';
import ChatListScreen from './src/screens/chats/ChatListScreen';
import ChatScreen from './src/screens/chats/ChatScreen';
import EmailSignUp from './src/screens/authentication/signup/EmailSignUp';
import EmailSignIn from './src/screens/authentication/signin/EmailSignIn';
import SearchScreen from './src/screens/search/SearchScreen';
import { supabase } from './supabase';
import EditEventScreen from './src/screens/event/EditEventScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './src/screens/loading/LoadingScreen';
import EulaScreen from './src/screens/eula/EulaScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import SendResetLinkScreen from './src/screens/authentication/passwordReset/SendResetLinkScreen';
import ResetPasswordScreen from './src/screens/authentication/passwordReset/ResetPasswordScreen';
import UserDetailsScreen from './src/screens/authentication/signup/UserDetailsScreen';
import UpdateInterestsScreen from './src/screens/profile/UpdateInterestsScreen';
import * as Linking from 'expo-linking';
import React from 'react';
import Constants from 'expo-constants';
import LeaderboardScreen from './src/screens/leaderboard/LeaderboardScreen';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

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
		<StripeProvider
			publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
			merchantIdentifier="merchant.com.linkzy" // required for Apple Pay
			urlScheme="com.linkzy" // required for 3D Secure and bank redirects
		>
			<Provider store={store}>
				<App />
			</Provider>
		</StripeProvider>
	)
}

function App() {

	const currentUser = useSelector(selectCurrentUser);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState<boolean>(true);
	const [inCompleteSignUp, setIncompleteSignUp] = useState<boolean>(false);
	const setSession = async () => {
		const accessToken = await AsyncStorage.getItem('userAccessToken');
		const refreshToken = await AsyncStorage.getItem('userRefreshToken');

		if (accessToken && refreshToken) {
			await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
		} else {
			setLoading(false);
		}
	};

	const fetchSession = async () => {
		await setSession();
		const { data: { session: user } } = await supabase.auth.getSession();
		if (!user) {
			setLoading(false);
			return
		};
		const { data, error } = await supabase
			.from('users')
			.select()
			.eq('uid', user.user.id);

		if (error) throw error.message;

		if (data && data.length > 0) {
			dispatch(setCurrentUser({
				name: data[0].name,
				email: data[0].email,
				photo: data[0].photo,
				id: data[0].id,
				sex: data[0].sex,
				gemCount: data[0].gem_count
			}))
			if (data.length === 0) {
				setIncompleteSignUp(true);
				setLoading(false);
			};
		}
		setLoading(false);
	};

	// const handleDeepLink = useCallback(
	//   async (url: string | null) => {
	// 	if (url) {
	// 	  const stripeHandled = await handleURLCallback(url);
	// 	  if (stripeHandled) {
	// 		// This was a Stripe URL - you can return or add extra handling here as you see fit
	// 	  } else {
	// 		// This was NOT a Stripe URL – handle as you normally would
	// 	  }
	// 	}
	//   },
	//   [handleURLCallback]
	// );

	useEffect(() => {
		fetchSession();
	}, []);

	const linking = {
		prefixes: ['com.linkzy://', 'https://com.linkzy'],
		config: {
			screens: {
				resetpassword: 'resetpassword'
			},
		},
	};

	if (loading) {
		return <LoadingScreen displayText='Loading...' />
	}

	return (
		<SafeAreaView className='h-full' style={{ backgroundColor: colours.primaryColour }}>
			<NavigationContainer theme={mainTheme} linking={linking} >
				<Stack.Navigator screenOptions={{
					headerShown: false
				}} >
					{currentUser.id === null ?
						(
							<>
								{
									inCompleteSignUp ? (
										<Stack.Screen name="userdetailsscreen" component={UserDetailsScreen} />
									) :
										<>
											<Stack.Screen name="signup" component={SignUpScreen} />
											<Stack.Screen name="signin" component={SignInScreen} />
											<Stack.Screen name="emailsignup" component={EmailSignUp} />
											<Stack.Screen name="emailsignin" component={EmailSignIn} />
											<Stack.Screen name="userdetailsscreen" component={UserDetailsScreen} />
											<Stack.Screen name="eula" component={EulaScreen} />
											<Stack.Screen name="sendresetlink" component={SendResetLinkScreen} />
											<Stack.Screen name="resetpassword" component={ResetPasswordScreen} />
										</>
								}

							</>
						) : (
							<>
								<Stack.Screen name="home" component={HomeScreen} />
								<Stack.Screen name="profile" component={ProfileScreen} />
								<Stack.Screen name="submit" component={SubmitScreen} />
								<Stack.Screen name="event" component={EventScreen} />
								<Stack.Screen name="editevent" component={EditEventScreen} />
								<Stack.Screen name="comment" component={SubmitCommentScreen} />
								<Stack.Screen name="chatlist" component={ChatListScreen} />
								<Stack.Screen name="chat" component={ChatScreen} />
								<Stack.Screen name="search" component={SearchScreen} />
								<Stack.Screen name="eula" component={EulaScreen} />
								<Stack.Screen name="settings" component={SettingsScreen} />
								<Stack.Screen name="updateinterests" component={UpdateInterestsScreen} />
								<Stack.Screen name="leaderboard" component={LeaderboardScreen} />
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
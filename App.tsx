import 'react-native-gesture-handler';
import Navbar from './src/components/Navbar';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, NavigationContainer, useNavigationState } from '@react-navigation/native';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from './src/context/navSlice';
import { store } from './src/context/store';
import SignUpScreen from './src/screens/authentication/signup/SignUpScreen';
import SignInScreen from './src/screens/authentication/signin/SignInScreen';
import colours from './src/utils/styles/colours';
import { Keyboard, Platform, View } from 'react-native';
import { useEffect, useState } from 'react';
import ChatListScreen from './src/screens/chats/ChatListScreen';
import ChatScreen from './src/screens/chats/private/ChatScreen';
import EmailSignUp from './src/screens/authentication/signup/EmailSignUp';
import EmailSignIn from './src/screens/authentication/signin/EmailSignIn';
import { supabase } from './supabase';
import LoadingScreen from './src/screens/loading/LoadingScreen';
import EulaScreen from './src/screens/eula/EulaScreen';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import SendResetLinkScreen from './src/screens/authentication/passwordReset/SendResetLinkScreen';
import ResetPasswordScreen from './src/screens/authentication/passwordReset/ResetPasswordScreen';
import UserDetailsScreen from './src/screens/authentication/signup/UserDetailsScreen';
import UpdateInterestsScreen from './src/screens/profile/UpdateInterestsScreen';
import React from 'react';
import { navigationRef } from './src/utils/functions/navigationRef';
import FeaturedEventsScreen from './src/screens/featuredEvents/featuredEvents/FeaturedEventsScreen';
import FeaturedEventsEventScreen from './src/screens/featuredEvents/featuredEventsEvent/FeaturedEventsEventScreen';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import FeaturedEventsSubmitScreen from './src/screens/featuredEvents/featuredEventsSubmit/FeaturedEventsSubmitScreen';
import OrganizerOnboardingScreen from './src/screens/organizerOnboarding/OrganizerOnboardingScreen';
import { StripeProvider } from '@stripe/stripe-react-native';
import TicketScreen from './src/screens/featuredEvents/ticket/TicketScreen';
import TicketFeedScreen from './src/screens/featuredEvents/ticket/TicketFeedScreen';
import EditFeaturedEventScreen from './src/screens/featuredEvents/featuredEventsEvent/EditFeaturedEventScreen';
import { StatusBar } from 'react-native';
import AttendeeListScreen from './src/screens/featuredEvents/featuredEventsEvent/AttendeeListScreen';
import GroupChatScreen from './src/screens/chats/group/GroupChatScreen';
import DashboardScreen from './src/screens/featuredEvents/dashboard/DashboardScreen';
import { updateCurrentUser } from './src/utils/functions/updateCurrentUser';
import PrivacyPolicyScreen from './src/screens/privacypolicy/PrivacyPolicyScreen';
import AboutScreen from './src/screens/about/AboutScreen';

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
			publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD!}
			merchantIdentifier="merchant.com.linkzy" // required for Apple Pay
			urlScheme="com.linkzy" // required for 3D Secure and bank redirects
		>
			<Provider store={store}>
				<App />
			</Provider>
		</StripeProvider>
	)
}

function AppSafeAreaWrapper() {

	const insets = useSafeAreaInsets();
	const currentUser = useSelector(selectCurrentUser);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState<boolean>(true);
	const [inCompleteSignUp, setIncompleteSignUp] = useState<boolean>(false);

	const fetchSession = async () => {
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
			updateCurrentUser(dispatch, data[0]);
			if (data.length === 0) {
				setIncompleteSignUp(true);
				setLoading(false);
			};
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchSession();
	}, []);

	const linking = {
		prefixes: ['com.linkzy://', 'https://com.linkzy'],
		config: {
			screens: {
				resetpassword: 'resetpassword',
				featuredeventsevent: {
					path: 'featuredeventsevent',
					parse: {
						featured_event_id: (id: number) => `${id}`,
					},
				},
			},
		},
	};

	if (loading) {
		return <LoadingScreen displayText='Loading...' />
	}

	return (

		<View
			className={`${Platform.OS === 'android' && insets.bottom > 20 ? 'h-[95%]' : 'h-full'}`}
			style={{ backgroundColor: colours.primaryColour }}>
			<StatusBar hidden={false} barStyle="dark-content" translucent={false} />
			<NavigationContainer theme={mainTheme} linking={linking} ref={navigationRef} >
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
								<Stack.Screen name="featuredEvents" component={FeaturedEventsScreen} />
								<Stack.Screen name="featuredeventsevent" component={FeaturedEventsEventScreen} />
								<Stack.Screen name="featuredEventsSubmit" component={FeaturedEventsSubmitScreen} />
								<Stack.Screen name="editfeaturedevent" component={EditFeaturedEventScreen} />
								<Stack.Screen name="organizerOnboarding" component={OrganizerOnboardingScreen} />
								<Stack.Screen name="ticketfeed" component={TicketFeedScreen} />
								<Stack.Screen name="ticket" component={TicketScreen} />
								<Stack.Screen name="dashboard" component={DashboardScreen} />
								<Stack.Screen name="profile" component={ProfileScreen} />
								<Stack.Screen name="attendeelist" component={AttendeeListScreen} />
								<Stack.Screen name="chatlist" component={ChatListScreen} />
								<Stack.Screen name="chat" component={ChatScreen} />
								<Stack.Screen name="groupchat" component={GroupChatScreen} />
								<Stack.Screen name="eula" component={EulaScreen} />
								<Stack.Screen name="privacypolicy" component={PrivacyPolicyScreen} />
								<Stack.Screen name="about" component={AboutScreen} />
								<Stack.Screen name="settings" component={SettingsScreen} />
								<Stack.Screen name="updateinterests" component={UpdateInterestsScreen} />
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
		</View>
	);
}

function App() {
	return (
		<SafeAreaProvider>
			<SafeAreaView
				edges={['top']}
				className='h-full' style={{ backgroundColor: colours.primaryColour }}>
				<StatusBar hidden={false} barStyle="dark-content" translucent={false} />
				<AppSafeAreaWrapper />
			</SafeAreaView>
		</SafeAreaProvider>

	)
};

const ConditionalNavbar = () => {

	//Hide the navbar if the kayboard is up and if we're pn the chat screeen.
	const currentRouteName = useNavigationState(state => state?.routes[state.index]?.name);

	// Determine whether to show the Navbar
	const showNavbar = currentRouteName !== 'chat'
		// && currentRouteName !== 'featuredeventsevent'
		&& currentRouteName !== 'groupchat';
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
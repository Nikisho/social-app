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
import { Keyboard, SafeAreaView } from 'react-native';
import SubmitCommentScreen from './src/screens/comments/SubmitCommentScreen';
import { useEffect, useState } from 'react';
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
		console.log(user)
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
			console.log(data)
			dispatch(setCurrentUser({
				name: data[0].name,
				email: data[0].email,
				photo: data[0].photo,
				id: data[0].id
			}))
		} else {
			setIncompleteSignUp(!inCompleteSignUp);
			setLoading(false);

		}
		setLoading(false);
	};

	useEffect(() => {
		fetchSession();
	}, []);

	const linking = {
		prefixes: ['com.linkzy://', 'https://com.linkzy'], // Your app's scheme and web URL
		config: {
			screens: {
				resetpassword: 'resetpassword'// This should match the Stack.Screen name
			},
		},
	};



	if (loading) {
		return <LoadingScreen />
	}
	if (inCompleteSignUp) {
		return <UserDetailsScreen/>
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
								<Stack.Screen name="signup" component={SignUpScreen} />
								<Stack.Screen name="signin" component={SignInScreen} />
								<Stack.Screen name="emailsignup" component={EmailSignUp} />
								<Stack.Screen name="emailsignin" component={EmailSignIn} />
								<Stack.Screen name="userdetailsscreen" component={UserDetailsScreen} />
								<Stack.Screen name="eula" component={EulaScreen} />
								<Stack.Screen name="sendresetlink" component={SendResetLinkScreen} />
								<Stack.Screen name="resetpassword" component={ResetPasswordScreen} />

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
import { Text, Alert, ToastAndroid, Platform, View } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../../../supabase';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, setCurrentUser } from '../../context/navSlice';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { ProfileScreenRouteProp, RootStackNavigationProp } from '../../utils/types/types';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import UserDetails from './UserDetails';
import UserInterests from './UserInterests';
import UpdateBioModal from './UpdateBioModal';
import ProfilePictureModal from './ProfilePictureModal';
import platformAlert from '../../utils/functions/platformAlert';
import FeaturedEventsUser from './FeaturedEventsUser';
import SecondaryHeader from '../../components/SecondaryHeader';
import { useTranslation } from 'react-i18next';
import getAge from '../../utils/functions/getAge';
import CompletionTracker from './CompletionTracker';

interface UserDataProps {
	name: string;
	date_of_birth: Date | null;
	photo: string;
	bio: string;
	sex: number | null
	is_organizer: boolean | null

}
interface Interests {
	interest_code: number;
	interest_group_code: number;
	interests: {
		description: string;
	}
}

const ProfileScreen = () => {
	const route = useRoute<ProfileScreenRouteProp>();
	const { user_id } = route.params;
	const [userData, setUserData] = useState<UserDataProps>({
		date_of_birth: null,
		bio: '',
		photo: '',
		name: '',
		sex: null,
		is_organizer: null
	});
	const currentUser = useSelector(selectCurrentUser);
	const navigation = useNavigation<RootStackNavigationProp>();
	const isCurrentUserProfile = user_id === currentUser.id;
	const [modalVisible, setModalVisible] = useState(false);
	const [profilePictureModalVisible, setProfilePictureModalVisible] = useState(false);
	const [originalBio, setOriginalBio] = useState('');
	const [userInterests, setUserInterests] = useState<Interests[]>();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const genderColour = userData.sex === 0 ? 'bg-green-400' : (userData.sex === 1 ? 'bg-sky-600' : 'bg-red-300')
	const fetchUserData = async () => {
		const { error, data } = await supabase
			.from('users')
			.select()
			.eq('id', user_id)
		if (data) {
			setUserData(data[0]);
			setOriginalBio(data[0].bio!);
		};
		if (error) {
			throw error;
		}
	};
	const handlePressChat = () => {
		navigation.navigate('chat',
			{ user_id: user_id }
		);
	};

	const updateProfilePictureInStorageBucket = async (file: string) => {
		const arrayBuffer = decode(file)
		try {
			const { error } = await supabase
				.storage
				.from('users')
				.upload(`${currentUser.id}/profile_picture.jpg`, arrayBuffer, {
					contentType: 'image/png',
					upsert: true,
				});

			if (error) {
				console.error('Upload error:', error.message);
			}
		} catch (error) {
			console.error('Conversion or upload error:', error);
		}
	}


	const updateUserDescription = async () => {
		if (!userData?.bio || userData.bio === '') {
			return;
		}

		const { error } = await supabase
			.from('users')
			.update({
				bio: userData.bio
			})
			.eq('id', currentUser.id);
		if (error) { console.error(error.message); }
		setModalVisible(!modalVisible);
		Platform.OS === 'android' ? ToastAndroid.show('Description changed successfully', ToastAndroid.SHORT) : Alert.alert('Description changed successfully')
	}

	const closeModal = () => {
		setUserData((prevData: UserDataProps) => ({
			...prevData,
			bio: originalBio
		}));
		setModalVisible(!modalVisible);
	}

	const pickImage = async () => {
		if (!isCurrentUserProfile) {
			return;
		}

		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert(
				'Permission Required',
				'We need access to your gallery to let you select images.',
				[{ text: 'OK' }]
			);
		}
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			base64: true,
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.canceled) {
			setUserData((prevData: UserDataProps) => ({
				...prevData,
				photo: result.assets[0].uri
			}))
			updateProfilePictureInStorageBucket(result.assets[0].base64!);
			const photoUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/users/${currentUser.id}/profile_picture.jpg?v=${new Date().getTime()}`
			const { error } = await supabase
				.from('users')
				.update({
					photo: photoUrl,
				})
				.eq('id', currentUser.id);
			if (error) { console.error(error.message); }

			dispatch(setCurrentUser({
				...currentUser,
				photo: photoUrl
			}))
			platformAlert('Profile picture changed successfully')
		}
	}

	const clearImage = async () => {
		if (currentUser.id !== user_id || currentUser.photo === null) {
			return;
		}
		const { error } = await supabase
			.from('users')
			.update({
				photo: null,
			})
			.eq('id', currentUser.id);

		if (error) (console.error(error.message));

		dispatch(setCurrentUser({
			...currentUser,
			photo: null,
		}));
		platformAlert('Image cleared successfully.')
	};


	const fetchInterests = async () => {
		const { error, data } = await supabase
			.from('user_interests')
			.select(`*,
            interests (
                interest_code,
                description
            )
            `)
			.eq('user_id', user_id)
		if (data) {
			setUserInterests(data)
		}
		if (error) console.error(error.message);
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchUserData();
			fetchInterests();
		}, [user_id])
	);

	return (
		<>
			{
				userData && userInterests && (
					<>
						<View className='flex flex-row items-center'>
							<SecondaryHeader
								displayText={userData.name}
							/>
							{
								userData?.date_of_birth && (
									<View
										// style={{ backgroundColor: colours.secondaryColour }}
										className={` flex flex-row rounded-lg px-2 h-7 space-x-2 ${genderColour}`}
									>

										{userData.sex !== 0 && (
											<Text className="text-lg font-semibold  text-white">
												{userData.sex === 1 ? "♂" : "♀"}
											</Text>
										)}

										<Text
											className='text-lg font-semibold text-white'>
											{getAge(userData.date_of_birth)}
										</Text>
									</View>
								)
							}
						</View>

						<FeaturedEventsUser
							HeaderContent={
								<>
									{
										isCurrentUserProfile &&
										<CompletionTracker
											{...userData}
											interests={userInterests}
										/>
									}
									<UserDetails
										name={userData.name}
										dateOfBirth={userData.date_of_birth}
										photo={currentUser.id === user_id ? currentUser.photo : userData.photo}
										bio={userData.bio}
										sex={userData.sex}
										isOrganizer={userData.is_organizer}
										handlePressChat={handlePressChat}
										setModalVisible={setModalVisible}
										isCurrentUserProfile={isCurrentUserProfile}
										user_id={user_id}
										modalVisible={modalVisible}
										setProfilePictureModalVisible={setProfilePictureModalVisible}
										profilePictureModalVisible={profilePictureModalVisible}
									/>
									<UserInterests
										user_id={user_id}
										userInterests={userInterests!}
										isCurrentUserProfile={isCurrentUserProfile}

									/>
									{userData?.is_organizer &&
										<Text className='text-lg font-semibold mb-2'> {t('profile_screen.events')} </Text>
									}
								</>

							}
							user_id={user_id}
						/>
						<UpdateBioModal
							setModalVisible={setModalVisible}
							closeModal={closeModal}
							userData={userData}
							setUserData={setUserData}
							modalVisible={modalVisible}
							updateUserDescription={updateUserDescription}
						/>
						<ProfilePictureModal
							setModalVisible={setProfilePictureModalVisible}
							modalVisible={profilePictureModalVisible}
							photo={isCurrentUserProfile ? currentUser.photo : userData.photo}
							user_id={user_id}
							pickImage={pickImage}
							clearImage={clearImage}
						/>
					</>
				)
			}
		</>

	)
}
export default ProfileScreen
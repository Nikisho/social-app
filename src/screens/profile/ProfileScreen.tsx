import { View, Text, Image, Alert, TouchableOpacity, ToastAndroid, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import UserEvents from './UserEvents';
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

interface UserDataProps {
	name: string;
	age: string;
	photo: string;
	bio: string

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
		age: '',
		bio: '',
		photo: '',
		name: ''
	});
	const currentUser = useSelector(selectCurrentUser);
	const navigation = useNavigation<RootStackNavigationProp>();
	const isCurrentUserProfile = user_id === currentUser.id;
	const [modalVisible, setModalVisible] = useState(false);
	const [originalBio, setOriginalBio] = useState('');
	const [userInterests, setUserInterests] = useState<Interests[]>();

	const dispatch = useDispatch();

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
				name: currentUser.name,
				photo: photoUrl,
				id: currentUser.id

			}))
			Platform.OS === 'android' ? ToastAndroid.show('Profile picture saved successfully', ToastAndroid.SHORT) : Alert.alert('Profile picture changed successfully');
		}
	}
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
			console.log(data)
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
		<View className='mx-2 h-[92%]'>
			{
				userData && (
					<UserDetails
						name={userData.name}
						age={userData.age}
						photo={userData.photo}
						bio={userData.bio}
						handlePressChat={handlePressChat}
						setModalVisible={setModalVisible}
						pickImage={pickImage}
						isCurrentUserProfile={isCurrentUserProfile}
						user_id={user_id}
						modalVisible={modalVisible}
					/>
				)
			}
			<UpdateBioModal
				setModalVisible={setModalVisible}
				closeModal={closeModal}
				userData={userData}
				setUserData={setUserData}
				modalVisible={modalVisible}
				updateUserDescription={updateUserDescription}
			/>
			<UserInterests
				user_id={user_id}
				userInterests={userInterests!}
				isCurrentUserProfile={isCurrentUserProfile}
			/>
			<UserEvents
				user_id={user_id}
			/>
		</View>
	)
}
export default ProfileScreen
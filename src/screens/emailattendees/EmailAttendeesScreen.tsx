import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SecondaryHeader from '../../components/SecondaryHeader'
import { EditFeaturedEventScreenRouteProps, RootStackNavigationProp } from '../../utils/types/types'
import { useNavigation, useRoute } from '@react-navigation/native'
import styles from '../../utils/styles/shadow'
import LoadingScreen from '../loading/LoadingScreen'
import { supabase } from '../../../supabase'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../context/navSlice'
import platformAlert from '../../utils/functions/platformAlert'

const EmailAttendeesScreen = () => {
    const route = useRoute<EditFeaturedEventScreenRouteProps>();
    const currentUser = useSelector(selectCurrentUser);
    const { featured_event_id } = route.params;
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<RootStackNavigationProp>();
    const [email, setEmail] = useState({
        subject: '',
        body: ''
    })
    const isDisabled = email.subject === '' || email.body === '';
    const handleSubmit = async () => {
        setLoading(true);
        if (isDisabled) {
            platformAlert('Please add subject and body to the email.');
            return;
        }
        try {
            //
            const { data, error } = await supabase.functions.invoke(
                "email-attendees", {
                body: {
                    featured_event_id: featured_event_id,
                    email : {
                        subject: email.subject,
                        body: email.body
                    },
                    user: {
                        name: currentUser.name,
                        email: currentUser.email,
                        photo: currentUser.photo
                    }
                },
            });
            if (error) console.error(error.message);

            setEmail({
                subject: '',
                body: ''
            });
            navigation.navigate('featuredEvents', {})
        } catch (error) {
            console.error('Error sending email to participants :', error)
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingScreen displayText='Sending your email' />
    }
    return (
        <View className='px-3 space-y-5'>
            <SecondaryHeader displayText='Email attendees' />

            <View>
                <TextInput
                    value={email.subject}
                    placeholder="Subject"
                    onChangeText={(value) =>
                        setEmail((prev) => prev! && { ...prev, subject: value })
                    }
                    className="border rounded-xl h- p-5"
                />
            </View>


            {/* <View> */}
            <TextInput
                value={email.body}
                multiline
                placeholder="Body"
                onChangeText={(value) =>
                    setEmail((prev) => prev! && { ...prev, body: value })
                }
                className="border rounded-xl h-1/2 p-5"
            />
            {/* </View> */}


            <TouchableOpacity
                style={styles.shadow}
                disabled={isDisabled}
                className={`bg-black rounded-lg p-3 ${isDisabled ? 'opacity-60' : ''} `}
                onPress={handleSubmit}
            >
                <Text className='text-white text-center text-lg font-bold'>
                    Send
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default EmailAttendeesScreen
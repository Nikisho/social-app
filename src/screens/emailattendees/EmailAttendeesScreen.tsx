import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native'
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
import ConfirmEmailModal from './ConfirmEmailModal'
import AsyncStorage from '@react-native-async-storage/async-storage'

const EmailAttendeesScreen = () => {
    const route = useRoute<EditFeaturedEventScreenRouteProps>();
    const currentUser = useSelector(selectCurrentUser);
    const { featured_event_id } = route.params;
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation<RootStackNavigationProp>();
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [email, setEmail] = useState({
        subject: '',
        body: ''
    });

    async function fetchEmailDraft() {
        try {
            const draft = await AsyncStorage.getItem(`email_draft_${featured_event_id}`);
            if (draft) {
                setEmail(JSON.parse(draft));
            } else {
                setEmail({
                    subject: '',
                    body: ''
                });
            }
        } catch (error) {
            console.error('Error fetching email draft:', error);
        }
    }
    React.useEffect(() => {
        fetchEmailDraft();
    }, [featured_event_id]);

    const isDisabled = email.subject === '' || email.body === '';
    const handleSubmit = async () => {
        setLoading(true);
        setConfirmModalVisible(false);
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
                    email: {
                        subject: email.subject.replace(/=\?utf-8\?Q\?.*\?=/i, "").trim(),
                        body: email.body.replace(/=\?utf-8\?Q\?.*\?=/i, "").trim()
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

    const handleSaveDraft = () => {
        AsyncStorage.setItem(`email_draft_${featured_event_id}`, JSON.stringify(email))
            .then(() => {
                platformAlert('Draft saved successfully!');
                setConfirmModalVisible(false);
            })
            .catch((error) => {
                console.error('Error saving draft:', error);
                platformAlert('Failed to save draft. Please try again.');
            }); 

    };

    if (loading) {
        return <LoadingScreen displayText='Sending your email' />
    }
    return (
        <View className="flex-1 bg-white px-4">
            <SecondaryHeader displayText="Email attendees" />

            <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
                <Text className="font-semibold text-base">
                    Contact everyone attending this event
                </Text>

                <Text className="text-gray-600 mt-1">
                    Use this to share updates, reminders, venue changes or important information.
                </Text>
            </View>

            <View className="space-y-4 flex-1">

                <View>
                    <Text className="text-gray-500 mb-2 font-medium">
                        Subject
                    </Text>

                    <TextInput
                        value={email.subject}
                        placeholder="e.g. Venue update for tonight"
                        onChangeText={(value) =>
                            setEmail((prev) => prev && {
                                ...prev,
                                subject: value,
                            })
                        }
                        className="border border-gray-200 rounded-2xl p-4 text-base bg-white"
                    />
                </View>

                <View className="h-1/2">
                    <Text className="text-gray-500 mb-2 font-medium">
                        Message
                    </Text>

                    <TextInput
                        value={email.body}
                        multiline
                        textAlignVertical="top"
                        placeholder="Write your message..."
                        onChangeText={(value) =>
                            setEmail((prev) => prev && {
                                ...prev,
                                body: value,
                            })
                        }
                        className="border border-gray-200 rounded-2xl p-4 flex-1 min-h-[250px]"
                    />
                </View>

                <TouchableOpacity
                    style={styles.shadow}
                    disabled={isDisabled}
                    onPress={() => setConfirmModalVisible(true)}
                    className={`rounded-2xl py-4 bg-black ${isDisabled ? "opacity-50" : ""
                        }`}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Send email
                    </Text>
                </TouchableOpacity>

            </View>

            <ConfirmEmailModal
                visible={confirmModalVisible}
                setConfirmModalVisible={() => setConfirmModalVisible(false)}
                email={email}
                handleSubmit={handleSubmit} 
                handleSaveDraft={handleSaveDraft}
            />
        </View>
    )
}

export default EmailAttendeesScreen
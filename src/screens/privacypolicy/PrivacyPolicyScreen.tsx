import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import SecondaryHeader from '../../components/SecondaryHeader'

const PrivacyPolicyScreen = () => {
    return (
        <View className='h-full'>
            <SecondaryHeader
                displayText='Privacy policy'
            />
            <ScrollView 
                contentContainerStyle={{paddingBottom: 200}}
                className="flex-1 bg-white p-4">
                <Text className="text-2xl font-bold mb-4">Privacy Policy</Text>
                <Text className="text-gray-700 mb-4">
                    This privacy policy applies to the Linkzy app (hereby referred to as
                    "Application") for mobile devices that was created by Nicolas (hereby
                    referred to as "Service Provider") as a Free service. This service is
                    intended for use "AS IS".
                </Text>

                <Text className="text-xl font-semibold mt-4 mb-2">
                    Information Collection and Use
                </Text>
                <Text className="text-gray-700 mb-4">
                    The Application collects information when you download and use it. This
                    may include:
                    {"\n"}• Your device's IP address
                    {"\n"}• Pages visited, date/time, and duration
                    {"\n"}• Operating system in use
                    {"\n\n"}
                    The Application does not gather precise location data.
                </Text>

                <Text className="text-xl font-semibold mt-4 mb-2">Third Party Access</Text>
                <Text className="text-gray-700 mb-4">
                    Only aggregated, anonymized data may be shared. Third-party services
                    with their own Privacy Policy include:
                    {"\n"}• Google Play Services
                    {"\n"}• Expo
                </Text>

                <Text className="text-xl font-semibold mt-4 mb-2">Opt-Out Rights</Text>
                <Text className="text-gray-700 mb-4">
                    You can stop all collection of information by uninstalling the
                    Application at any time.
                </Text>

                <Text className="text-xl font-semibold mt-4 mb-2">
                    Data Retention Policy
                </Text>
                <Text className="text-gray-700 mb-4">
                    Data is retained as long as you use the Application. To request deletion
                    of your data, contact{" "}
                    <Text className="font-semibold">support@linkzyapp.com</Text>.
                </Text>

                <Text className="text-xl font-semibold mt-4 mb-2">Children</Text>
                <Text className="text-gray-700 mb-4">
                    The Application does not address anyone under 18, and no personal data
                    is knowingly collected from children.
                </Text>

                <Text className="text-xl font-semibold mt-4 mb-2">
                    Commitment to Safety and Preventing Exploitation
                </Text>
                <Text className="text-gray-700 mb-4">
                    The Service Provider has a strict zero-tolerance policy against CSAE.
                    Any content or activity promoting CSAE is strictly prohibited, will
                    result in a permanent ban, and may be reported to authorities. Report
                    any such activity immediately at{" "}
                    <Text className="font-semibold">support@linkzyapp.com</Text>.
                </Text>

                <Text className="text-xl font-semibold mt-4 mb-2">Security</Text>
                <Text className="text-gray-700 mb-4">
                    The Service Provider uses physical, electronic, and procedural
                    safeguards to protect your information.
                </Text>

                <Text className="text-xl font-semibold mt-4 mb-2">Changes</Text>
                <Text className="text-gray-700 mb-4">
                    This Privacy Policy may be updated from time to time. Updates will be
                    posted here, and continued use of the Application indicates acceptance
                    of changes.
                </Text>

                <Text className="text-xl font-semibold mt-4 mb-2">Your Consent</Text>
                <Text className="text-gray-700 mb-4">
                    By using the Application, you consent to the processing of your
                    information as described in this Privacy Policy.
                </Text>

                <Text className="text-xl font-semibold mt-4 mb-2">Contact Us</Text>
                <Text className="text-gray-700 mb-10">
                    If you have any questions, contact us at{" "}
                    <Text className="font-semibold">support@linkzyapp.com</Text>.
                </Text>
            </ScrollView>
        </View>
    )
}

export default PrivacyPolicyScreen
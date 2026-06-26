import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import platformAlert from "../../utils/functions/platformAlert";

interface Props {
    attachments: {uri: string}[];
    setAttachments: React.Dispatch<
        React.SetStateAction<string[]>
    >;
}

const EmailAttachments: React.FC<Props> = ({
    attachments,
    setAttachments,
}) => {
    const MAX_ATTACHMENTS:number = 4;
    const pickImages = async () => {
        if (attachments?.length >= MAX_ATTACHMENTS) {
            platformAlert('Maximum number of attachments is 4')
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            aspect: [4, 3],
            quality: 1,
        });
        if (result.canceled) return;

        setAttachments((prev: any) => [
            ...prev,
            ...result.assets.map((a) => ({
                uri: a.uri,
                base64: a.base64,
                fileName: `email-${Date.now()}-${Math.random().toString(36)}`,
            })),
        ]);
    };
    const removeImage = (uri: string) => {
        setAttachments((prev: any[]) =>
            prev.filter((item) => item?.uri !== uri)
        );
    };

    return (
        <View className="mt-5">

            <View className="flex-row justify-between items-center mb-3">

                <Text className="font-semibold text-base">
                    Attachments
                </Text>

                <TouchableOpacity
                    onPress={pickImages}
                    className="
                        bg-black
                        px-4
                        py-2
                        rounded-full
                    "
                >
                    <Text className="text-white">
                        + Add image
                    </Text>
                </TouchableOpacity>

            </View>

            {
                attachments.length > 0 && (

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >

                        {
                            attachments.map(
                                (attachment) => (

                                    <View
                                        key={attachment.uri}
                                        className="
                                            relative
                                            mr-3
                                        "
                                    >

                                        <Image
                                            source={{
                                                uri: attachment.uri
                                            }}
                                            className="
                                                w-28
                                                h-28
                                                rounded-2xl
                                            "
                                        />

                                        <TouchableOpacity
                                            onPress={() =>
                                                removeImage(
                                                    attachment.uri
                                                )
                                            }
                                            className="
                                                absolute
                                                top-2
                                                right-2
                                                bg-black
                                                rounded-full
                                                p-1
                                            "
                                        >
                                            <Ionicons
                                                name="close"
                                                size={14}
                                                color="white"
                                            />
                                        </TouchableOpacity>

                                    </View>

                                )
                            )
                        }

                    </ScrollView>

                )
            }

            {
                attachments.length === 0 && (

                    <Text className="text-gray-500">
                        Attach posters, schedules or updates.
                    </Text>

                )
            }

        </View>
    );
};

export default EmailAttachments;
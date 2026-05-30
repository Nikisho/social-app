import React from "react";
import {
    Modal,
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getColorFromName } from "../../../utils/functions/getColorFromName";
import { RootStackNavigationProp } from "../../../utils/types/types";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../../../supabase";
import { selectCurrentUser } from "../../../context/navSlice";
import { useSelector } from "react-redux";
import platformAlert from "../../../utils/functions/platformAlert";

type Member = {
    id: number;
    name: string;
    photo?: string | null;
};

type Props = {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    members: Member[];
    chat_room_id: number;
    onClose: () => void;
};

const MembersModal = ({ modalVisible, setModalVisible, members, chat_room_id, onClose }: Props) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    const handleNavigateToProfile = (user_id: number) => {
        setModalVisible(false);
        navigation.navigate('profile', { user_id });
    }
    const handleLeaveGroup = async () => {
        const { error } = await supabase
            .from('participants')
            .delete()
            .eq('chat_room_id', chat_room_id)
            .eq('user_id', currentUser.id);

        if (error) {
            console.error(error.message);
            return;
        }
        setModalVisible(false);
        navigation.goBack();
        platformAlert("You have left the group chat");
    };

    const renderItem = ({ item }: { item: Member }) => (
        <TouchableOpacity
            onPress={() => {
                // Handle member item press, e.g., navigate to profile
                handleNavigateToProfile(item.id);
            }}
            className="flex-row items-center py-3">
            {item.photo ?
                <Image
                    source={{ uri: item.photo || "https://via.placeholder.com/100" }}
                    className="w-11 h-11 rounded-full bg-gray-200"
                /> :
                <View
                    style={{
                        backgroundColor: item.name ? getColorFromName(item.name) : 'gray',
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 2,
                        borderWidth: 1
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
                        {item.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
            }

            <View className="ml-3 flex-1">
                <Text className="font-semibold text-base">
                    {item.name}
                </Text>

            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/40">
                <View className="bg-white rounded-t-3xl px-5 pt-4 pb-8 max-h-[75%]">
                    <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl font-bold">
                            Members
                        </Text>

                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="bg-gray-100 p-2 rounded-full"
                        >
                            <Ionicons name="close" size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={members}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="items-center mt-10">
                                <Text className="text-gray-500">
                                    No members yet
                                </Text>
                            </View>
                        }
                    />
                    <TouchableOpacity
                        onPress={handleLeaveGroup}
                        className="mt-5 border border-red-200 bg-red-50 py-4 rounded-2xl flex-row items-center justify-center"
                    >
                        <Ionicons name="exit-outline" size={20} color="#dc2626" />

                        <Text className="text-red-600 font-semibold ml-2">
                            Leave group chat
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default MembersModal;
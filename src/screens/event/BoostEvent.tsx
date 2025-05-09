import { View, Text, TouchableOpacity } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import styles from '../../utils/styles/shadow'
import BoostEventModal from './BoostEventModal'
import { supabase } from '../../../supabase'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, setCurrentUser } from '../../context/navSlice'
import platformAlert from '../../utils/functions/platformAlert'
import BuyGemsModal from '../../components/BuyGemsModal'



interface EventDataProps {
    name: string
    key: number
    event_id: number
    event_description: string
    event_title: string
    event_date: string
    event_time: string
    event_type: string
    photo: string
    user_id: string;
    users: {
        name: string
        id: number
        photo: string
    }
    hubs: {
        hub_name: string;
        hub_code: number;
    }
    boost_expires_at: Date

};
interface BoostEventProps {
    event_id: number;
    eventData:EventDataProps
    setEventData: Dispatch<EventDataProps| undefined>
}

const BoostEvent: React.FC<BoostEventProps> = ({
    event_id,
    eventData,
    setEventData
}) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const [buyGemsModalVisible, setBuyGemsModalVisible] = useState<boolean>(false);

    const boostEvent = async () => {

        if (currentUser.gemCount < 50) {
            setModalVisible(false);
            setBuyGemsModalVisible(true);
            return;
        }

        const { error } = await supabase
            .from('meetup_events')
            .update({
                boost_expires_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
            })
            .eq('event_id', event_id);
        if (error) {
            console.error(error.message)
        } else {
            const { error: reduceGemError } = await supabase
                .from('users')
                .update({
                    gem_count: currentUser.gemCount - 50
                })
                .eq('id', currentUser.id);
            if (reduceGemError) console.error(reduceGemError.message)

            dispatch(setCurrentUser({
                ...currentUser,
                gemCount: currentUser.gemCount - 50
            }))

            setEventData({
                ...eventData,
                boost_expires_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
            })
        };
        setModalVisible(!modalVisible);
        platformAlert('Your event is boosted for 24 hours 🚀')
    };

    return (
        <View
            // style={styles.shadow}
            className='w-full my-3 flex flex-row justify-center'>
            <TouchableOpacity
                style={styles.shadow}
                onPress={() => setModalVisible(!modalVisible)}
                className='p-2 rounded-full bg-white w-1/3 pl-5'>
                <Text className='text-center text-lg'>
                    Boost 🚀
                </Text>
            </TouchableOpacity>
            <BoostEventModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                boostEvent={() => boostEvent()}
            />
            <BuyGemsModal
                modalVisible={buyGemsModalVisible}
                setModalVisible={setBuyGemsModalVisible}
                message="You don't have enough gems"
            />
        </View>
    )
}

export default BoostEvent
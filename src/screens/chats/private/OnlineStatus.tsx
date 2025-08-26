import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../../../supabase";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../context/navSlice";

const OnlineStatus = () => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const currentUser = useSelector(selectCurrentUser);
    const [onlineStatus, setOnlineStatus] = useState('offline');
    useEffect(() => {
       const subscription = AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const _handleAppStateChange = (nextAppState: any) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            (async ()=> {
                const {data ,error} = await supabase
                .from('users')
                .update({
                    online_status: 'offline'
                })
                .eq('id', currentUser.id)
                .select('online_status')

                if (error) console.log(error)
            })()
        } else {
            (async ()=> {
                const {data} = await supabase
                .from('users')
                .update({
                    online_status: 'online'
                })
                .eq('id', currentUser.id)
                .select('online_status')
                .single()
                if (data) {
                    setOnlineStatus(data.online_status)
                }
            })()
        }

    };

    console.log(appStateVisible)
    return (
        <Text>
            {/* {onlineStatus} */}
        </Text>
    )
}

export default OnlineStatus
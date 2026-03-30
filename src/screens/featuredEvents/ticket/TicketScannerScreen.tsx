import { View, Text, Button, StyleSheet, Touchable, TouchableOpacity, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { TicketScannerScreenRouteProp } from '../../../utils/types/types';
import { CameraView, useCameraPermissions } from 'expo-camera';
import platformAlert from '../../../utils/functions/platformAlert';
import { supabase } from '../../../../supabase';

const TicketScannerScreen = () => {
    const route = useRoute<TicketScannerScreenRouteProp>();
    const { featured_event_id } = route.params;
    const [permission, requestPermission] = useCameraPermissions();
    const scanningRef = useRef(false);
    const lastScannedRef = useRef<string | null>(null);
    const cooldownRef = useRef<NodeJS.Timeout | null>(null);

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        // HARD LOCK
        if (scanningRef.current) return;

        // prevent scanning same QR repeatedly
        if (lastScannedRef.current === data) return;

        scanningRef.current = true;
        lastScannedRef.current = data;

        console.log("QR Data:", data);

        try {
            const match = data.match(/com\.linkzy:\/\/ticket\/(.+)$/);
            const ticketUuid = match?.[1];

            if (!ticketUuid) {
                platformAlert("❌ Invalid QR code.");
                return;
            }

            const { data: ticketData, error } = await supabase
                .from('tickets')
                .select('uuid, checked_in, featured_event_id, ticket_id')
                .eq('uuid', ticketUuid)
                .single();

            if (error || !ticketData) {
                platformAlert("❌ Ticket not found.");
                return;
            }

            if (ticketData.featured_event_id !== featured_event_id) {
                platformAlert("❌ Wrong event.");
                return;
            }

            if (ticketData.checked_in) {
                Alert.alert('⚠️ Already checked in, ticket ID: ' + ticketData.ticket_id);
                return;
            }

            await supabase
                .from('tickets')
                .update({ checked_in: true })
                .eq('uuid', ticketUuid);

            Alert.alert("✅ Ticket valid. ID " + ticketData.ticket_id);

        } catch (err) {
            console.error("Scan error:", err);
        } finally {
            // cooldown before next scan
            cooldownRef.current = setTimeout(() => {
                scanningRef.current = false;
                lastScannedRef.current = null;
            }, 2000); // 2s pause
        }
    };

    if (!permission?.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>

                <TouchableOpacity
                    onPress={requestPermission}
                    className='flex flex-row justify-center p-3 self-center bg-black rounded-lg'>
                    <Text className='text-white font-semibold'>
                        GRANT PERMISSION
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <CameraView
                style={{ flex: 1 }}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={scanningRef.current ? undefined : handleBarCodeScanned}
            />
        </View>
    );
}

export default TicketScannerScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 64,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: '100%',
        paddingHorizontal: 64,
    },
    button: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
});
import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { TicketScannerScreenRouteProp } from '../../../utils/types/types';
import { CameraView } from 'expo-camera';
import platformAlert from '../../../utils/functions/platformAlert';
import { supabase } from '../../../../supabase';

const TicketScannerScreen = () => {
  const route = useRoute<TicketScannerScreenRouteProp>();
  const { featured_event_id } = route.params;

  const [scanned, setScanned] = useState(false);

const handleBarCodeScanned = async ({ data }: { data: string }) => {
  if (scanned) return; // prevent spam

  setScanned(true); // lock scanner immediately
  console.log("QR Data:", data);

  try {

    const match = data.match(/com\.linkzy:\/\/event\/(\d+)\/user\/(\d+)/);

    if (!match) {
      platformAlert("❌ Invalid QR code. This QR is not valid for Linkzy.");
      return setTimeout(() => setScanned(false), 1500);
    }

    const scannedEventId = parseInt(match[1], 10);
    const scannedUserId = parseInt(match[2], 10);

    if (scannedEventId !== featured_event_id) {
      platformAlert("🚫 Wrong event. This ticket is not for this event.");
      return setTimeout(() => setScanned(false), 1500);
    }

    const { error:ticketError, data:ticketData } = await supabase
        .from('tickets')
        .select('checked_in')
        .eq('qr_code_link', data)
        .single()
    if (ticketError) {
        console.error('Error retrieving ticket :', ticketError.message);
    }   
    if (ticketData) {
        console.log(ticketData)
        if (ticketData.checked_in === true) {
            platformAlert('⚠️ Attendee already checked in.');
            return setTimeout(() => setScanned(false), 1500);
        }
    }

    // ✅ Valid ticket
    console.log("Scanned valid ticket for user:", scannedUserId);
    platformAlert(`✅ Success! Ticket valid for user ${scannedUserId}`);

    const { error } = await supabase
        .from('tickets')
        .update({
            checked_in: true
        })
        .eq('qr_code_link', data)
        if (error) {
            console.error('Error upadting tickets table :', error.message);
        }
    // Reset after short delay so next ticket can be scanned
    setTimeout(() => setScanned(false), 1500);

  } catch (err) {
    console.error("Scan error:", err);
    setTimeout(() => setScanned(false), 1500);
  }
};


  return (
    <View className="flex-1">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarCodeScanned}
      />
      {scanned && (
        <Text className="text-center p-4"> 
          Ticket scanned — ready for next.
        </Text>
      )}
    </View>
  );
}

export default TicketScannerScreen
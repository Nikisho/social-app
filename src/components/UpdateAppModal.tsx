import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Platform, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import Constants from 'expo-constants';
import { supabase } from '../../supabase';

const UpdateAppModal = () => {
  const googlePlayStoreLink = "https://play.google.com/store/apps/details?id=com.linkzy";
  const appStoreLink = "https://apps.apple.com/us/app/linkzy/id6720764102";
  const storeLink = Platform.OS === 'ios' ? appStoreLink : googlePlayStoreLink;

  const [isOutDated, setIsOutDated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const openURL = () => {
    Linking.openURL(storeLink).catch((err) => console.error("Failed to open URL:", err));
  };

  const checkAppVersion = async () => {
    setLoading(true);
    const buildNumber = Constants.expoConfig?.ios?.buildNumber;
    const versionCode = Constants.expoConfig?.android?.versionCode;
    const { data, error } = await supabase
      .from('app_versioning')
      .select()
      .eq('platform', Platform.OS)
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error.message);
      setLoading(false);
      return;
    }
    if (data && data.length > 0) {
      if (Platform.OS === 'ios') {
        setIsOutDated(data[0]?.build !== buildNumber);
      } else if (Platform.OS === 'android') {
        setIsOutDated(data[0]?.build !== versionCode?.toString());
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAppVersion();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOutDated}
      onRequestClose={() => setIsOutDated(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : (
            <>
              <Text style={styles.title}>New update available! 🚀</Text>
              <Text style={styles.message}>
                We’ve made some improvements and added new features. Update now to get the best experience!
              </Text>
              <TouchableOpacity style={styles.button} onPress={openURL}>
                <Text style={styles.buttonText}>Update now</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsOutDated(false)}>
                <Text style={styles.dismissText}>No thanks</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dismissText: {
    marginTop: 15,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});

export default UpdateAppModal;

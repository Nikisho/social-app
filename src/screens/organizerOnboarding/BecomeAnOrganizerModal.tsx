import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackNavigationProp } from '../../utils/types/types';

interface BecomeAnOrganizerModalProps {
  modalVisible: boolean;
  setModalVisible: (bool: boolean) => void;
}

const BecomeAnOrganizerModal: React.FC<BecomeAnOrganizerModalProps> = ({
  modalVisible,
  setModalVisible,
}) => {
    const navigation  = useNavigation<RootStackNavigationProp>();
    const handleStartOnboarding = async () => {
        navigation.navigate('organizerOnboarding');
        setModalVisible(!modalVisible)
    };
  return (
    <Modal
      transparent
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Become an Organiser 🚀</Text>
          <Text style={styles.description}>
            To organise featured events, you need to onboard as an event organiser first.
          </Text>

          <TouchableOpacity style={styles.continueButton} onPress={handleStartOnboarding}>
            <Text style={styles.buttonText}>Start Onboarding</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BecomeAnOrganizerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
  },
  continueButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  cancelText: {
    color: '#000000',
    fontSize: 16,
  },
});

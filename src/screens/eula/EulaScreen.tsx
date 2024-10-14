import React from 'react';
import { ScrollView, Text, StyleSheet, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';

const EulaScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>End User License Agreement (EULA)</Text>

        <Text style={styles.sectionHeading}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By downloading or using the Linkzy app, you agree to this End User License Agreement (EULA). This EULA is a legal agreement between you and Linkzy, governing your use of the application.
        </Text>

        <Text style={styles.sectionHeading}>2. User-Generated Content</Text>
        <Text style={styles.text}>
          Linkzy allows users to create, post, and share content. However, you agree not to post any content that is illegal, offensive, discriminatory, harmful, or otherwise objectionable. Linkzy has no tolerance for objectionable content or abusive behavior.
        </Text>

        <Text style={styles.sectionHeading}>3. Prohibited Conduct</Text>
        <Text style={styles.text}>
          You may not use the app to:
        </Text>
        <Text style={styles.text}>
          - Harass, bully, or abuse other users.{'\n'}
          - Post or share inappropriate, offensive, or illegal content.{'\n'}
          - Engage in fraudulent or deceptive practices.{'\n'}
          - Violate any applicable laws or regulations.
        </Text>

        <Text style={styles.sectionHeading}>4. Account Suspension or Termination</Text>
        <Text style={styles.text}>
          Linkzy reserves the right to suspend or terminate accounts that violate this agreement or participate in abusive or illegal behavior.
        </Text>

        <Text style={styles.sectionHeading}>5. No Tolerance for Objectionable Content</Text>
        <Text style={styles.text}>
          There is zero tolerance for any objectionable content, including but not limited to:
        </Text>
        <Text style={styles.text}>
          - Hate speech, racism, or discrimination.{'\n'}
          - Explicit or inappropriate sexual content.{'\n'}
          - Violence or threats of violence.
        </Text>

        <Text style={styles.sectionHeading}>6. Limitation of Liability</Text>
        <Text style={styles.text}>
          Linkzy is not responsible for the actions of users on the app. We do our best to moderate and remove inappropriate content, but users engage with the app at their own risk.
        </Text>

        <Text style={styles.sectionHeading}>7. Changes to this Agreement</Text>
        <Text style={styles.text}>
          Linkzy reserves the right to modify this EULA at any time. Changes will be posted within the app and take effect immediately.
        </Text>

        <Button 
          title="Back" 
          onPress={() => navigation.goBack()}
          color="#000000"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
});

export default EulaScreen;

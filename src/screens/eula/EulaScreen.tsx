import React from 'react';
import { ScrollView, Text, StyleSheet, View, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const EulaScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <TouchableOpacity className="py-5 " onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-circle-outline" size={30} color="black" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
  

      <Text style={styles.heading}>{t('eula.title')}</Text>

      <Text style={styles.sectionHeading}>{t('eula.section1.heading')}</Text>
      <Text style={styles.text}>{t('eula.section1.text')}</Text>

      <Text style={styles.sectionHeading}>{t('eula.section2.heading')}</Text>
      <Text style={styles.text}>{t('eula.section2.text')}</Text>

      <Text style={styles.sectionHeading}>{t('eula.section3.heading')}</Text>
      <Text style={styles.text}>{t('eula.section3.text')}</Text>

      <Text style={styles.sectionHeading}>{t('eula.section4.heading')}</Text>
      <Text style={styles.text}>{t('eula.section4.intro')}</Text>
      <Text style={styles.text}>
        {t('eula.section4.list.0') + '\n'}
        {t('eula.section4.list.1') + '\n'}
        {t('eula.section4.list.2') + '\n'}
        {t('eula.section4.list.3')}
      </Text>

      <Text style={styles.sectionHeading}>{t('eula.section5.heading')}</Text>
      <Text style={styles.text}>{t('eula.section5.text')}</Text>

      <Text style={styles.sectionHeading}>{t('eula.section6.heading')}</Text>
      <Text style={styles.text}>{t('eula.section6.intro')}</Text>
      <Text style={styles.text}>
        {t('eula.section6.list.0') + '\n'}
        {t('eula.section6.list.1') + '\n'}
        {t('eula.section6.list.2')}
      </Text>

      <Text style={styles.sectionHeading}>{t('eula.section7.heading')}</Text>
      <Text style={styles.text}>{t('eula.section7.text')}</Text>

      <Text style={styles.sectionHeading}>{t('eula.section8.heading')}</Text>
      <Text style={styles.text}>{t('eula.section8.text')}</Text>

        <Button
          title={t('eula.backButton')}
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

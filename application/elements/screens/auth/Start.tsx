import React from 'react';
import { 
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import LongButton from '../../components/UI/LongButton';
import { useTranslation } from '../../helpers/lang';
import { getTermsUrl } from '../../api/auth';
/**
 * Sign‑in / onboarding screen for Obscure Drive.
 * Pure UI ‑ no business logic; wire up handlers via props.
 */
export interface SignInScreenProps {
  onGoogle?: () => void;
  onApple?: () => void;
  onEmail?: () => void;
}

const StartScreen: React.FC<SignInScreenProps> = ({
  onEmail,
}) => {
  const t = useTranslation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoWrapper}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
        </View>

        {/* Tagline */}
        <View style={styles.buttons}>
        <Text style={styles.heading}>{t('signInHeading')}</Text>

        {/* Buttons */}
          {/* <AuthButton
            label="Continue with Google"
            icon="google"
            onPress={onGoogle}
            style={styles.googleBtn}
          />
          <AuthButton
            label="Continue with Apple"
            icon="apple"
            onPress={onApple}
            style={styles.appleBtn}
          /> */}
          <LongButton
            label={t('continueWithEmail')}
            onPress={onEmail}
            style={{}}
            inverted
          />
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {t('signInAgreement')}{' '}
          <Text style={styles.link} onPress={() => Linking.openURL(getTermsUrl('terms-and-conditions'))}>{t('termsAndConditions')}</Text> {t('andConnector')}{' '}
          <Text style={styles.link} onPress={() => Linking.openURL(getTermsUrl('privacy-policy'))}>{t('privacyStatement')}</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logoImage: {
    marginTop: 64,
    width: 140,
    height: 85,
  },
  logoText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  heading: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    marginTop: 24,
  },
  footer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
  link: {
    color: '#ff3300',
    textDecorationLine: 'underline',
  },
});

export default StartScreen;

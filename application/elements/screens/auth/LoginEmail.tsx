import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../../helpers/lang';

/**
 * Screen: Enter e‑mail address
 * Part of the Obscure Drive onboarding flow.
 */
export interface EmailInputScreenProps {
  onContinue?: (email: string) => void;
  onBack?: () => void;
}

const EmailInputScreen: React.FC<EmailInputScreenProps> = ({ onContinue, onBack }) => {
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const t = useTranslation();

  const isValid = useMemo(() => /.+@.+\..+/.test(email.trim()), [email]);

  const handleContinue = () => {
    if (isValid && onContinue) {
      onContinue(email.trim());
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={96}
      >
        <View style={styles.content}>
          {/* Heading */}
          <Text style={styles.heading}>{t('enterEmailHeading')}</Text>
          {/* Sub‑heading */}
          <Text style={styles.subHeading}>
            {t('enterEmailSubheading')}
          </Text>

          {/* Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, focused && styles.inputFocused]}
              placeholder={t('emailPlaceholder')}
              placeholderTextColor="#b0b0b0"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {focused && email && !email.includes('@') && (
              <View style={styles.dropdownList} >
                <TouchableOpacity style={styles.dropdownListItem} onPress={() => {
                  setEmail(email + t('gmailSuffix'));
                  setFocused(false);
                }}>
                  <Text>{email}</Text>
                  <Text style={styles.dropdownListItemAt}>{t('gmailSuffix')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Continue button */}
          <TouchableOpacity
            style={[styles.continueBtn, !isValid && styles.continueBtnDisabled]}
            activeOpacity={0.8}
            disabled={!isValid}
            onPress={handleContinue}
          >
            <Text style={styles.continueLabel}>{t('continue')}</Text>
          </TouchableOpacity>

          {/* Back */}
          <TouchableOpacity style={styles.backWrapper} onPress={onBack} activeOpacity={0.7}>
            
            <MaterialIcons
              name="chevron-left"
              size={20}
              color="#000"
            />


            <Text style={styles.backLabel}>{t('back')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  heading: {
    marginTop: 48,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  subHeading: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    lineHeight: 20,
  },
  inputWrapper: {
    marginTop: 32,
    position: 'relative',
    zIndex: 10,
  },
  input: {
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: '#3A5160',
  },
  dropdownList: {
    position: 'absolute',
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dropdownListItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    flexDirection: 'row',
  },
  dropdownListItemAt: {
    color: '#3378f7',
  },
  continueBtn: {
    marginTop: 36,
    backgroundColor: '#ff3300',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  continueBtnDisabled: {
    backgroundColor: '#8c8c8c',
  },
  continueLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backWrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 24,
    alignItems: 'center',
  },
  backLabel: {
    marginLeft: 4,
    fontSize: 14,
    color: '#000',
  },
});

export default EmailInputScreen;

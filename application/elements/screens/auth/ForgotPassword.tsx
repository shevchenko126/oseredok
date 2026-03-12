import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import maskEmail from '../../helpers/maskEmail';
import { useTranslation } from '../../helpers/lang';

interface ForgotPasswordScreenProps {
  email: string
  onContinue: (code: string) => void
  onBack: () => void
  setForgotPasswordCode: (code: string | null) => void,
  onResend: () => void,
  isError: boolean
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  email,
  onContinue,
  onBack,
  setForgotPasswordCode,
  onResend,
  isError
}) => {
  const [code, setCode] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)
  const t = useTranslation();

  useEffect(() => {
    setForgotPasswordCode(code)
  }, [code, setForgotPasswordCode])

  // проверки
  const allValid = code !== null && code.toString().length >= 6

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>{t('recoveryEmailHeading')}</Text>

          <Text style={styles.subHeading}>{t('recoveryEmailSubheading')}</Text>
          <Text style={[styles.email, styles.subHeading]}>{maskEmail(email)}</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, focused && styles.inputFocused, isError && styles.inputError]}
              placeholder={t('enterCodePlaceholder')}
              placeholderTextColor="#AAA"
              keyboardType="numeric"
              value={code !== null ? code.toString() : ''}
              onChangeText={text => setCode(text ? text : null)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />

            {isError && (
              <Text style={styles.errorText}>
                {t('invalidCodeMessage')}
              </Text>
            )}
          </View>

          {code ? (
            <TouchableOpacity
              style={[styles.button, !allValid && styles.buttonDisabled]}
              disabled={!allValid}
              onPress={() => onContinue(code)}
            >
              <Text style={styles.buttonText}>{t('continue')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.back}
              onPress={() => onResend()}
            >
              <Text style={styles.backText}>{t('resendCode')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.back} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={20} color="#000" />
            <Text style={styles.backText}>{t('back')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

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
  },
  heading: {
    marginTop: 48,
    marginBottom: 12,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  subHeading: {
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
  inputError: {
    borderColor: '#FF4D4F',
  },
  errorText: {
    color: '#FF4D4F',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
    textAlign: 'left',
  },
  description: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8
  },
  email: {
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16
  },
  rules: {
    marginTop: 16
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  ruleText: {
    marginLeft: 8,
    fontSize: 14
  },
  button: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ff3300',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    width: '100%'
  },
  buttonDisabled: {
    backgroundColor: '#8c8c8c',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500'
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24
  },
  backText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#000'
  }
})

export default ForgotPasswordScreen
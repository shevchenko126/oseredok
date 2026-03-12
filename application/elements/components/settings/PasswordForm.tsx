import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../helpers/lang';

interface CreatePasswordScreenProps {
    title?: string
  onContinue: (password: string) => void
  onBack: () => void
}

const PasswordForm: React.FC<CreatePasswordScreenProps> = ({
    title,
  onContinue,
  onBack
}) => {
  const t = useTranslation();
  const [password, setPassword] = useState<string>('')
  const [confirm, setConfirm] = useState<string>('')
  const [secure1, setSecure1] = useState<boolean>(true)
  const [secure2, setSecure2] = useState<boolean>(true)
  const [focused1, setFocused1] = useState<boolean>(false)
  const [focused2, setFocused2] = useState<boolean>(false)

  // проверки
  const hasMinLen = password.length >= 10
  const hasNumber = /\d/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const allValid = hasMinLen && hasNumber && hasLower && hasUpper && password === confirm

  const renderRule = (ok: boolean, label: string) => (
    <View style={styles.rule} key={label}>
      <MaterialIcons
        name="check-circle-outline"
        size={20}
        color={ok ? '#60b177' : '#CCC'}
      />
      <Text style={[styles.ruleText, { color: ok ? '#000' : '#666' }]}> 
        {label}
      </Text>
    </View>
  )

  return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={96}
        >
          <View style={styles.content}>
            <Text style={styles.heading}>{title ? title : t('createPasswordTitle')}</Text>

            <View style={styles.inputWrapper}>
              <TextInput
                  style={[styles.input, focused1 && styles.inputFocused]}
                  placeholder={t('enterPasswordPlaceholder')}
                  placeholderTextColor="#AAA"
                  secureTextEntry={secure1}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused1(true)}
                  onBlur={() => setFocused1(false)}
              />
              <TouchableOpacity onPress={() => setSecure1(prev => !prev)} style={styles.eyeIcon}>
                  <MaterialIcons
                    name={secure1 ? 'visibility-off' : 'visibility'}
                    size={24}
                    color="#555"
                  />
              </TouchableOpacity>
            </View>

            <View style={styles.rules}>
              {renderRule(hasMinLen, t('passwordRuleMinLength'))}
              {renderRule(hasNumber, t('passwordRuleNumber'))}
              {renderRule(hasLower, t('passwordRuleLowercase'))}
              {renderRule(hasUpper, t('passwordRuleUppercase'))}
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                  style={[styles.input, focused2 && styles.inputFocused]}
                  placeholder={t('confirmPasswordPlaceholder')}
                  placeholderTextColor="#AAA"
                  secureTextEntry={secure2}
                  value={confirm}
                  onChangeText={setConfirm}
                  onFocus={() => setFocused2(true)}
                  onBlur={() => setFocused2(false)}
              />
              <TouchableOpacity onPress={() => setSecure2(prev => !prev)} style={styles.eyeIcon}>
                  <MaterialIcons
                  name={secure2 ? 'visibility-off' : 'visibility'}
                  size={24}
                  color="#555"
                  />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, !allValid && styles.buttonDisabled]}
              disabled={!allValid}
              onPress={() => onContinue(password)}
            >
              <Text style={styles.buttonText}>{t('continue')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.back} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={20} color="#000" />
              <Text style={styles.backText}>{t('back')}</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    // flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    // flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  heading: {
    marginTop: 48,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subHeading: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    lineHeight: 22,
  },
  inputWrapper: {
    marginTop: 32,
    position: 'relative',
    zIndex: 10,
  },
  input: {
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
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  forgot: {
    color: '#3f515f',
    fontSize: 14,
    marginTop: 16,
    fontWeight: '600',
    textDecorationLine: 'underline'
  },
  button: {
    marginTop: 16,
    marginBottom: 24,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FF3200',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#8c8c8c'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
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
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  backText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#000'
  }
})

export default PasswordForm
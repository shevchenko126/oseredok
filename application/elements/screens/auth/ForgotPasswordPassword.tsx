import React, { useState } from 'react'
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
import { useTranslation } from '../../helpers/lang';

interface CreatePasswordScreenProps {
  onContinue: (password: string) => void
  onBack: () => void
}

const ForgotPasswordPasswordScreen: React.FC<CreatePasswordScreenProps> = ({
  onContinue,
  onBack
}) => {
  const [password, setPassword] = useState<string>('')
  const [confirm, setConfirm] = useState<string>('')
  const [secure1, setSecure1] = useState<boolean>(true)
  const [secure2, setSecure2] = useState<boolean>(true)
  const t = useTranslation();

  // проверки
  const hasMinLen = password.length >= 10
  const hasNumber = /\d/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const allValid = hasMinLen && hasNumber && hasLower && hasUpper && password === confirm

  const renderRule = (ok: boolean, label: string) => (
    <View style={styles.rule} key={label}>
      <MaterialIcons
        name="check-circle"
        size={20}
        color={ok ? '#4CD964' : '#CCC'}
      />
      <Text style={[styles.ruleText, { color: ok ? '#000' : '#666' }]}>
        {label}
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{t('createPasswordTitle')}</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={t('enterPasswordPlaceholder')}
              placeholderTextColor="#AAA"
              secureTextEntry={secure1}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecure1(prev => !prev)}>
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
              style={styles.input}
              placeholder={t('confirmPasswordPlaceholder')}
              placeholderTextColor="#AAA"
              secureTextEntry={secure2}
              value={confirm}
              onChangeText={setConfirm}
            />
            <TouchableOpacity onPress={() => setSecure2(prev => !prev)}>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    height: 48,
    marginTop: 12
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000'
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
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24
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
    marginTop: 16
  },
  backText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#000'
  }
})

export default ForgotPasswordPasswordScreen
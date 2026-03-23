import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../../helpers/lang';


const PasswordScreen = ({ email = 'youremail@example.com', onContinue, onForgot, onBack, isError }:any) => {
  const [password, setPassword] = useState('')
  const [secure, setSecure] = useState(true)
  const [focused, setFocused] = useState(false)
  const t = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={96}
      >
        <View style={styles.content}>

          {/* Заголовок */}
          <Text style={styles.heading}>{t('enterPasswordHeading')}</Text>
          <Text style={styles.subHeading}>
            {t('loginPasswordSubheadingPrefix')} {email}
          </Text>

          {/* Поле ввода */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.inputWrapper}
          >
            <TextInput
              style={[styles.input, focused && styles.inputFocused, isError && styles.inputError]}
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />

            <TouchableOpacity onPress={() => setSecure(!secure)}
                style={styles.eyeIcon}>
              <MaterialIcons
                name={secure ? 'visibility-off' : 'visibility'}
                size={24}
                color="#555"
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>

          {isError && (
            <Text style={styles.errorText}>
              {t('invalidCodeMessage')}
            </Text>
          )}

          {/* Забыли пароль */}
          <TouchableOpacity onPress={onForgot}>
            <Text style={styles.forgot}>{t('forgotPassword')}</Text>
          </TouchableOpacity>

          {/* Continue button */}
          <TouchableOpacity
            style={[styles.continueBtn, password.length === 0 && styles.continueBtnDisabled]}
            activeOpacity={0.8}
            disabled={password.length === 0}
            onPress={() => onContinue && onContinue(password)}
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
  button: {
    marginTop: 'auto',
    marginBottom: 24,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FF3200',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
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
  }
})

export default PasswordScreen
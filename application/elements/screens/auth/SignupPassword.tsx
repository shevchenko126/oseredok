import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import PasswordForm from '../../components/settings/PasswordForm';

interface CreatePasswordScreenProps {
  onContinue: (password: string) => void
  onBack: () => void
}

const CreatePasswordScreen: React.FC<CreatePasswordScreenProps> = ({
  onContinue,
  onBack
}) => {

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <PasswordForm
          onContinue={onContinue}
          onBack={onBack}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
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

export default CreatePasswordScreen
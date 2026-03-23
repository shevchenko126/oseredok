import React, { useEffect, useState } from 'react';
import Start from './Start';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native'
import LoginEmail from './LoginEmail';
import LoginPassword from './LoginPassword';
import ForgotPassword from './ForgotPassword';
// import ForgotPasswordPassword from './ForgotPasswordPassword';
import SignupPassword from './SignupPassword';
import { isEmail, login, register, forgotPasswordConfirm, forgotPasswordChange, forgotPassword, confirmEmail, sendConfirmationCode } from '../../../api/auth';
import { saveProfile } from '../../../helpers/storage';
import { saveToken } from '../../../helpers/keychain';
import { requestPushPermissionAndGetToken } from '../../../helpers/pushNotifications';

// Simple flow controller for authentication screens
export default function StartScreen({ onAuth }: { onAuth?: () => void }) {
  const [step, setStep] = useState<'start' | 'email' | 'loginPass' | 'signupPass' | 'forgotPassword' | 'forgotPasswordPassword' | 'confirmEmail'>('start');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordCode, setForgotPasswordCode] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleEmail = async (value: string) => {
    setEmail(value);
    const { data } = await isEmail(value);
    if (data) {
      setStep('loginPass');
    } else {
      setStep('signupPass');
    }
  };

  useEffect(() => {
    setIsError(false);
  }, [step]);

  if (step === 'email') {
    return (
      <LoginEmail
        onContinue={handleEmail}
        onBack={() => setStep('start')}
      />
    );
  }

  if (step === 'loginPass') {
    return (
      <LoginPassword
        email={email}
        onContinue={async (yourPassword: string) => {
          const { data, error } = await login(email, yourPassword);
          if (!error && data) {
            if(!data.user_info.is_email_verified){
              await sendConfirmationCode(email);
              setStep('confirmEmail');
              setPassword(yourPassword);
              return;
            } else {
              await saveProfile(data.user_info);
              await saveToken(data.access_token);

              await requestPushPermissionAndGetToken();
              
              onAuth && onAuth();
            }
          } else {
            setIsError(true);
          }
        }}
        onForgot={() => {
          setStep('forgotPassword');
          forgotPassword(email);
        }}
        onBack={() => setStep('email')}
        isError={isError}
      />
    );
  }

  if (step === 'signupPass') {
    return (

      <SafeAreaView style={styles.container}>
        <SignupPassword
          onContinue={async (newPassword: string) => {
            const { data, error } = await register(email, newPassword);
            if (!error && data) {
              setPassword(newPassword);
              setStep('confirmEmail');
            };
          }}
          onBack={() => setStep('email')}
        />
      </SafeAreaView>
    );
  }

  if (step === 'confirmEmail') {
    return (
      <ForgotPassword
        email={email}
        setForgotPasswordCode={setForgotPasswordCode}
        onContinue={async (code: string) => {
          const { data, error } = await confirmEmail(email, code);
          if (!error && data && data.success) {

            const loginResp = await login(email, password);
            if (!loginResp.error && loginResp.data) {
              await saveProfile((loginResp.data as any).user_info);
              await saveToken((loginResp.data as any).access_token);

              await requestPushPermissionAndGetToken();
              onAuth && onAuth();
            } else {
              setIsError(true);
            }
          } else {
            setIsError(true);
          }
        }}
        onBack={() => setStep('email')}
        isError={isError}
        onResend={async () => {
          await sendConfirmationCode(email);
        }}
      />
    );
  }

  if (step === 'forgotPassword') {
    return (
      <ForgotPassword
        email={email}
        setForgotPasswordCode={setForgotPasswordCode}
        onContinue={async (code: string) => {
          const { data, error } = await forgotPasswordConfirm(email, code);
          if (!error && data) {
            setStep('forgotPasswordPassword');
            setForgotPasswordCode(code);
          } else {
            setIsError(true);
          }
        }}
        onBack={() => setStep('email')}
        isError={isError}
        onResend={async () => {
          await forgotPassword(email);
        }}
      />
    );
  }


  if (step === 'forgotPasswordPassword') {
    return (
      <SafeAreaView style={styles.container}>
        <SignupPassword
          onContinue={async (newPassword: string) => {
              await forgotPasswordChange(email,  forgotPasswordCode!, newPassword);
              const { data, error } = await login(email, newPassword);
              if (!error && data) {
                await saveProfile(data.user_info);
                await saveToken(data.access_token);
                onAuth && onAuth();
              }
          }}
          onBack={() => setStep('email')}
        />
      </SafeAreaView>
    );
  }

  // default
  return <Start onEmail={() => setStep('email')} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  }
});
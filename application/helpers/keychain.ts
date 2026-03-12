import * as Keychain from 'react-native-keychain';

export async function saveToken(token: string | null) {
  if (!token) {
    await Keychain.resetGenericPassword({ service: 'auth_token' });
    return;
  }
  await Keychain.setGenericPassword('auth', token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    service: 'auth_token',
  });
}

export async function getToken(): Promise<string | null> {try {
    const creds = await Keychain.getGenericPassword({ service: 'auth_token' });
    return creds ? creds.password : null;
  } catch (e) {
    return null;
  }
}
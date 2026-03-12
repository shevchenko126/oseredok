import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveProfile(profile: UserProfile) {
  await AsyncStorage.setItem('@profile', JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const json = await AsyncStorage.getItem('@profile');
  return json ? JSON.parse(json) : null;
}
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { UserInfo } from '../../../dto/auth/types.gen';
import { changeMe, getMe } from '../../../api/auth';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, Asset, CameraOptions, ImageLibraryOptions, PhotoQuality } from 'react-native-image-picker';
import { getImage, uploadImage, toThumbnailName } from '../../../api/storage';
import { connect } from "react-redux";
import IPopupStore from "../../../store/popup/initStore.interface";
import { useTranslation } from '../../../helpers/lang';


interface IEditProfileScreenProps {
    openPopup: (popup:string) => void;
}


const EditProfileScreen = ({ openPopup }: IEditProfileScreenProps) => {
  const navigation = useNavigation();
  const t = useTranslation();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    avatar_id: null,
    language: null,
    is_email_verified: false
  });
  const [saving, setSaving] = useState(false);
  const [avatarPreviewUri, setAvatarPreviewUri] = useState<string | undefined>(undefined);
  const [isDoneEnabled, setIsDoneEnabled] = useState(false);
  
  // load current user info on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await getMe();
        if (!cancelled && !error && data) {
          setUserInfo(prev => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error('Load profile error', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleResetPassword = () => {
    openPopup('changePassword');
  };

  const handleCancel = () => {
    // @ts-ignore - basic navigation without typed params
    navigation.goBack();
  };
  const handleSave = async () => {
    if (saving) return;
    if (!isDoneEnabled) return;
    setSaving(true);
    try {
      changeMe({
        id: userInfo.id,
        email: userInfo.email ?? null,
        first_name: userInfo.first_name ?? null,
        last_name: userInfo.last_name ?? null,
        avatar_id: userInfo.avatar_id ?? null,
        username: userInfo.username ?? null,
        language: userInfo.language ?? null,
        is_email_verified: userInfo.is_email_verified,
      });
      navigation.goBack();
      // if (!error && data) {
      //   setUserInfo(prev => ({ ...prev, ...data }));
      //   // go back to previous screen on success
      //   // @ts-ignore - basic navigation without typed params
      //   navigation.goBack();
      // }
    } catch (e) {
      console.error('Save profile error', e);
    } finally {
      setSaving(false);
    }
  };

  const updateUserInfo = (field: keyof UserInfo, value: string | null) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDoneEnabled((userInfo.first_name?.trim() || '').length > 0 && (userInfo.last_name?.trim() || '').length > 0);
  };

  const handlePickAvatar = async () => {
    try {
      const options: CameraOptions & ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 0.8 as PhotoQuality,
      };
      const result = await launchImageLibrary(options);
      if (result.assets && result.assets.length > 0) {
        const photo: Asset = result.assets[0];
        if (photo.uri) setAvatarPreviewUri(photo.uri);
        const response = await uploadImage(photo);

        console.log("Upload response:", response);
        if (response.error) {
          console.error('Upload image error:', response);
          return;
        }
        const { filename } = (response.data || {}) as any;
        if (filename) {
          updateUserInfo('avatar_id', filename);
        }
      }
    } catch (err) {
      console.error('Image picker error:', err);
    }
  };


  useEffect(() => {
    const fetchImage = async () => {
      userInfo.avatar_id && setAvatarPreviewUri(await getImage(toThumbnailName(userInfo.avatar_id)));
    };
    fetchImage();
  }, [userInfo.avatar_id]);


  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={handlePickAvatar}>
          <Image
            source={{ uri: avatarPreviewUri || 'https://placehold.co/100x100'}}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.changePhoto} onPress={handlePickAvatar}>
          <Text style={styles.changePhotoText}>{t('setNewPhoto')}</Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input]}
              placeholder={t('firstNamePlaceholder')}
              value={userInfo.first_name || ''}
              onChangeText={(value) => updateUserInfo('first_name', value)}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input]}
              placeholder={t('lastNamePlaceholder')}
              value={userInfo.last_name || ''}
              onChangeText={(value) => updateUserInfo('last_name', value)}
              placeholderTextColor="#999"
            />
            <Text style={styles.helper}>{t('enterNameHelper')}</Text>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder={t('nicknamePlaceholder')}
            value={userInfo.username || ''}
            onChangeText={(value) => updateUserInfo('username', value)}
            placeholderTextColor="#999"
          />
          <Text style={styles.helper}>{t('addNicknameHelper')}</Text>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder={t('emailPlaceholderShort')}
            value={userInfo.email || ''}
            editable={false}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity onPress={handleResetPassword} style={styles.resetLink}>
          <Text style={styles.resetText}>{t('changePasswordAction')}</Text>
        </TouchableOpacity>


      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleCancel} style={styles.footerButton}>
          <Text style={styles.cancelText}>{t('cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!isDoneEnabled || saving}
          style={[styles.footerButton, (!isDoneEnabled || saving) && styles.disabledButton]}
        >
          <Text style={[styles.doneText, (!isDoneEnabled || saving) && styles.disabledText]}>{t('save')}</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
  changePhoto: { marginTop: 12 },
  changePhotoText: { color: '#3f515f', fontSize: 16 },
  inputGroup: {
    width: '100%',
    marginTop: 24,

    borderRadius: 8,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  helper: {
    marginTop: 6,
    color: '#777',
    fontSize: 12,
    paddingHorizontal: 4,
  },
  resetLink: { marginTop: 20, alignSelf: 'flex-start' },
  resetText: { color: '#3f515f', fontSize: 14, textDecorationLine: 'underline', fontWeight: '500' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 48,
  },
  footerButton: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  cancelText: { color: '#3f515f', fontSize: 16 },
  doneText: { color: '#3f515f', fontSize: 16, fontWeight: '600' },
  disabledButton: { opacity: 0.5 },
  disabledText: { color: '#ccc' },
});

const mapState = ({
    popup,
}: {
    popup: IPopupStore;
}) => {
    const { currentPopup } = popup;
    return { currentPopup };
};

const mapDispatch = {
    openPopup: (popup:string) => ({
        type: "SET_OPEN_POPUP",
        payload: popup
    }),
};



const connector = connect(mapState, mapDispatch);

const EditProfileScreenRedux = connector(EditProfileScreen);

export default EditProfileScreenRedux;
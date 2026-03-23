import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Platform
} from 'react-native';
import SettingsItem from '../../components/settings/SettingsItem';
import * as Keychain from 'react-native-keychain';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { connect } from "react-redux";
import IPopupStore from "../../../store/popup/initStore.interface";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { getMe } from '../../../api/auth';
import type { UserInfo } from '../../../dto/auth/types.gen';
import {
  useTranslation,
  LanguageContext,
  languageNameKeys,
} from '../../../helpers/lang';
import { AuthContext } from '../../../helpers/auth';
import { getDashboardTotal } from '../../../api/main/dashboard';
import { DashboardBase } from '../../../dto/main';
import { getImage, toThumbnailName } from '../../../api/storage';
import ClockIcon from '../../components/icons/clock';
import CheckSquareIcon from '../../components/icons/checkSquare';
import BookOpenIcon from '../../components/icons/bookOpen';

interface IProfileScreenProps {
    openPopup: (popup:string) => void;
}

const ProfileScreen = ({ openPopup }: IProfileScreenProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [me, setMe] = useState<UserInfo | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [dashboardData, setDashboardData] = useState<DashboardBase | null>(null);
  const { language } = useContext(LanguageContext);
  const auth = useContext(AuthContext);
  const t = useTranslation();


  const logoutPress = async () => {
    Alert.alert(
    t('logOutQuestion'),
    t('logOutMessage'),
    [
      {
        text: t('no'),
        style: 'cancel',
      },
      {
        text: t('logOut'),
        onPress: async () => {
          await Keychain.resetGenericPassword();
          auth && auth.logout();
        },
        style: 'destructive', // делает кнопку красной на iOS
      },
    ],
    { cancelable: true }
  );

    
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleDeleteAccount = () => {
    navigation.navigate('DeleteAccount');
  };

  const languageLabelKey = languageNameKeys[language] ?? languageNameKeys.en;

  const loadProfile = useCallback(async () => {
    const meData = await getMe();
    setMe(meData.data);

    const dashboardTotal = await getDashboardTotal();
    setDashboardData(dashboardTotal.data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  
  useEffect(() => {
    const fetchAvatar = async () => { 
      if(!me || !me.avatar_id) {
        setAvatarUri(undefined);
        return;
      }
      const imageUri = await getImage(toThumbnailName(me.avatar_id));
      setAvatarUri(imageUri);
    };

    fetchAvatar();
  }, [me]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: avatarUri || 'https://placehold.co/64x64' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {[(me?.first_name || ''), (me?.last_name || '')].filter(Boolean).join(' ') || ' '}
          </Text>
          <Text style={styles.role}>{me?.username || ''}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <View style={styles.statIconNumber}>
            <ClockIcon />
            <Text style={styles.statNumber}>{dashboardData ? dashboardData.events_count : ""}</Text>
          </View>
          <Text style={styles.statLabel}>{t('events')}</Text>
        </View>
        <View style={styles.stat}>
          <View style={styles.statIconNumber}>
            <CheckSquareIcon />
            <Text style={styles.statNumber}>{dashboardData ? dashboardData.tasks_count : ""}</Text>
          </View>
          <Text style={styles.statLabel}>{t('tasks')}</Text>
        </View>
        <View style={styles.stat}>
          <View style={styles.statIconNumber}>
            <BookOpenIcon />
            <Text style={styles.statNumber}>{dashboardData ? dashboardData.notes_count : ""}</Text>
          </View>
          <Text style={styles.statLabel}>{t('notes')}</Text>
        </View>
      </View>

      <View style={styles.list}>
        <View style={[styles.whiteSettingsItem, shadowSm]}>
          <SettingsItem icon="settings" label={t('editProfile')} onPress={handleEditProfile} />
        </View>

        <View style={[styles.whiteSettingsItem, shadowSm]}>
          <SettingsItem
            icon="globe"
            label={t('language')}
            extra={t(languageLabelKey)}
            onPress={() => openPopup('LanguageSettings')}
            isWithBorder={true}
          />
          <SettingsItem
            icon="bell"
            label={t('notifications')}
            onPress={() => openPopup('NotificationSettings')}
          />
        </View>
        <View style={[styles.whiteSettingsItem, shadowSm]}>
          <SettingsItem
            icon="account"
            label={t('deleteAccount')}
            onPress={handleDeleteAccount}
            isWithBorder={true}
          />

          <SettingsItem icon="logout" label={t('logOut')} onPress={() => {logoutPress()}} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userInfo: {
    marginLeft: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  role: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 24,
  },
  statIconNumber: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 6,
    paddingTop: 2,
    height:20,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  list: {
    marginTop: 16,
  },
  whiteSettingsItem: {
    backgroundColor: '#fff',
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

const shadowSm = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    android: {
      elevation: 1,
    },
  }),
};

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

const ProfileScreenRedux = connector(ProfileScreen);

export default ProfileScreenRedux;
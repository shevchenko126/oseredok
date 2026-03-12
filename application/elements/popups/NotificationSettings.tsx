import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Switch
} from 'react-native';
import { changeMe, getMe } from '../api/auth';
import {
  NotificationValue
} from '../helpers/notif';
import {
  useTranslation
} from '../helpers/lang';
import { requestPushPermissionAndGetToken } from '../helpers/pushNotifications';



interface Props {
  visible: boolean;
  onClose: () => void;
}

const LanguagePopup = ({ visible, onClose }: Props) => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const t = useTranslation();
  const [isSaving, setIsSaving] = React.useState(false);


  const toggleSwitch = async (isNotif: NotificationValue) => {
    if (isSaving) return;

    const previousNotification = isNotificationsEnabled;
    setIsNotificationsEnabled(isNotif);
    setIsSaving(true);

    try {
      await changeMe({ is_notifications_enabled: isNotif });
      if (isNotif) {
        await requestPushPermissionAndGetToken();
      }
    } catch (error) {
      console.error('change notification failed', error);
      setIsNotificationsEnabled(previousNotification);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const getNotificationSetting = async () => {
      try {
        const meReq = await getMe();
        const me = meReq.data;
        if (typeof me?.is_notifications_enabled === 'boolean') {
          setIsNotificationsEnabled(!!me.is_notifications_enabled);
        }
      } catch (e) {
        console.warn('Failed to load notification value', e);
      }
    };
    
    getNotificationSetting();
  }, [visible, setIsNotificationsEnabled]);

  return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.wrapper}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
            <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{t('notifications')}</Text>
            <View style={styles.sheetList}>
              <View style={styles.sheetItem}>
                <Text>{t('notificationsOn')}</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#5dec8dff" }}
                  thumbColor={"#f4f3f4"}
                  onValueChange={toggleSwitch}
                  value={isNotificationsEnabled}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    maxHeight: '50%',
    paddingBottom: 24,
    overflow: 'hidden',
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  sheetList: {
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 30,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sheetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  sheetItemSelected: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  sheetText: {
    fontSize: 16,
    color: '#111',
  },
  sheetTextSelected: {
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#111',
    marginLeft: 12,
  },
});

export default LanguagePopup;
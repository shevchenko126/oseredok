import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import { changePassword } from '../../api/auth';
import PasswordForm from '../components/settings/PasswordForm';
import SuccessIcon from '../components/icons/success';
import { useTranslation } from '../../helpers/lang';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onClose }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const t = useTranslation();

  const onCancel = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.backdrop}>
        <TouchableOpacity style={styles.overlay} onPress={onCancel} />
        <View style={styles.container}>
          {isSuccess ? (
            <View style={styles.body}>
              <Text style={styles.header}>{t('passwordChangedTitle')}</Text>
              <Text style={styles.text}>{t('passwordChangedMessage')}</Text>
              <Text style={styles.text}>
                <SuccessIcon />
              </Text>
              <TouchableOpacity
                style={[styles.footerButton]}
                onPress={onCancel}
              >
                <Text style={styles.doneText}>{t('done')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <PasswordForm
              onContinue={async (password: string) => {
                  await changePassword(password);
                  setIsSuccess(true);
              }}
              onBack={() => onClose()}
              title={t('changePassword')}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  container: {
    maxHeight: '90%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 20
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
  },
  body: { paddingHorizontal: 16, paddingBottom: 20 },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  footerButton: { padding: 8 },
  cancelText: { fontSize: 16, color: '#555' },
  doneText: { fontSize: 16, color: '#007AFF' },
  deleteButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  deleteText: { fontSize: 16, color: '#E74C3C' },
  text: { fontSize: 16, textAlign: 'center', marginTop: 8, marginRight: 'auto', marginLeft: 'auto' },
});

const mapState = () => {
  return {};
};

const mapDispatch = {
  closeEditPopup: () => ({
    type: 'SET_OBJECT_POPUP',
    payload: {
      id: null,
      type: null,
      popup: null,
    },
  }),
};

const connector = connect(mapState, mapDispatch);
export default connector(ChangePasswordModal);


import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../../helpers/lang';
import { uploadPaymentFile, createPaymentIn } from '../../api/main/finance';

interface Props {
  visible: boolean;
  buildingId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentInForm: React.FC<Props> = ({ visible, buildingId, onClose, onSuccess }) => {
  const t = useTranslation();
  const [amount, setAmount] = useState('');
  const [fileId, setFileId] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setAmount('');
    setFileId(null);
    setImageUri(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 as any });
    if (!result.assets?.length) return;
    const asset = result.assets[0];
    setUploadingImage(true);
    const resp = await uploadPaymentFile(asset);
    setUploadingImage(false);
    if (!resp.error && resp.data) {
      setFileId(resp.data.uuid);
      setImageUri(asset.uri ?? null);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !buildingId) return;
    setSubmitting(true);
    const resp = await createPaymentIn({
      building_id: buildingId,
      amount,
      file_id: fileId,
    });
    setSubmitting(false);
    if (!resp.error) {
      reset();
      onSuccess();
    }
  };

  const canSubmit = !!amount && !submitting;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.overlay} onPress={handleClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{t('newPaymentIn')}</Text>

          <TextInput
            style={styles.input}
            placeholder={t('amountPlaceholder')}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImage}
            disabled={uploadingImage}
            activeOpacity={0.7}
          >
            {uploadingImage ? (
              <ActivityIndicator color="#555" />
            ) : imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
            ) : (
              <View style={styles.imagePickerInner}>
                <Ionicons name="image-outline" size={28} color="#888" />
                <Text style={styles.imagePickerText}>{t('addPhoto')}</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleClose} style={styles.footerBtn}>
              <Text style={styles.cancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.footerBtn}
              disabled={!canSubmit}
            >
              {submitting ? (
                <ActivityIndicator color="#3A5160" />
              ) : (
                <Text style={[styles.submitText, !canSubmit && styles.disabledText]}>
                  {t('done')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: -35,
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  sheet: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  imagePicker: {
    marginHorizontal: 16,
    marginBottom: 12,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePickerInner: { alignItems: 'center', gap: 6 },
  imagePickerText: { fontSize: 14, color: '#888' },
  preview: { width: '100%', height: '100%' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  footerBtn: { paddingVertical: 10, paddingHorizontal: 20 },
  cancelText: { fontSize: 16, color: '#555' },
  submitText: { fontSize: 16, fontWeight: '600', color: '#3A5160' },
  disabledText: { color: '#bbb' },
});

export default PaymentInForm;

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { changeMe } from '../api/auth';
import {
  useTranslation,
  LanguageContext,
  languageNameKeys,
  availableLanguageCodes,
  type LanguageCode,
  setCurrentLanguage
} from '../helpers/lang';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const LanguagePopup = ({ visible, onClose }: Props) => {
  const { language, setLanguage } = React.useContext(LanguageContext);
  const t = useTranslation();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSelect = async (code: LanguageCode) => {
    if (isSaving) return;
    if (code === language) {
      onClose();
      return;
    }

    const previousLanguage = language;
    setLanguage(code);
    setIsSaving(true);
    setCurrentLanguage(code);

    try {
      await changeMe({ language: code });
      onClose();
    } catch (error) {
      console.error('change language failed', error);
      setLanguage(previousLanguage);
    } finally {
      setIsSaving(false);
    }
  };

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
          <Text style={styles.sheetTitle}>{t('language')}</Text>
          <View style={styles.sheetList}>
            <FlatList
              data={availableLanguageCodes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = item === language;
                const labelKey = languageNameKeys[item] ?? languageNameKeys.en;
                return (
                  <TouchableOpacity
                    style={[styles.sheetItem, isSelected && styles.sheetItemSelected]}
                    onPress={() => handleSelect(item)}
                    disabled={isSaving}
                  >
                    <Text style={[styles.sheetText, isSelected && styles.sheetTextSelected]}>
                      {t(labelKey)}
                    </Text>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
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
    // backgroundColor: '#f2f2f2',
    // borderRadius: 8,
    // paddingHorizontal: 8,
  },
  sheetText: {
    fontSize: 16,
    color: '#111',
  },
  sheetTextSelected: {
    // fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#111',
    marginLeft: 12,
  },
});

export default LanguagePopup;
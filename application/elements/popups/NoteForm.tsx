import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { launchCamera, launchImageLibrary, Asset, CameraOptions, ImageLibraryOptions, PhotoQuality } from 'react-native-image-picker';
import { connect } from 'react-redux';
import IPopupStore from '../store/popup/initStore.interface';
import EventTypeSelector from '../components/edit/EventTypeSelector';
import { uploadImage } from '../api/storage';
import { NoteCreate } from '../dto/main';
import { createNote, updateNote, deleteNote, getSingleNote } from '../api/main/notes';
import ImagesGrid from '../components/notes/ImagesGrid';
import ImageIcon from '../components/icons/image';
import CameraIcon from '../components/icons/camera';
import { useTranslation } from '../helpers/lang';

interface EditNoteModalProps {
  visible: boolean;
  onClose: () => void;
  eventTypeId: number | null;
  objectId: number | null;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ visible, onClose, eventTypeId, objectId }) => {
  const [obj, setObj] = useState<NoteCreate>({});
  const t = useTranslation();

  const onCancel = () => {
    setObj({});
    onClose();
  };

  const onCreate = async () => {
    if (objectId) {
      await updateNote(objectId, obj);
    } else {
      await createNote(obj);
    }
    setObj({});
    onClose();
  };

  const onDelete = async () => {
    if (objectId) {
      await deleteNote(objectId);
      onClose();
    }
  };


  const uploadImageHandler = async (type: 'camera' | 'gallery') => {
    try {
      const options: CameraOptions & ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 0.8 as PhotoQuality
      };

      let result;
      if (type === 'camera') {
        result = await launchCamera(options);
      } else {
        result = await launchImageLibrary(options);
      }

      if (result.assets && result.assets.length > 0) {
        const photo: Asset = result.assets[0];
        const response = await uploadImage(photo);
        if (response.error) {
          console.error('Upload image error:', response);
        }
        const { filename } = response.data || {};
        if (filename) {
          setObj({ ...obj, images: [...(obj.images || []), filename] });
        }

      }
    } catch (err) {
      console.error('Image picker error:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!visible) return;
      if (objectId) {
        const { data } = await getSingleNote(objectId);
        setObj(data);
      } else {
        setObj({});
      }
    };
    fetchData();
  }, [objectId, visible]);

  useEffect(() => {
    if (eventTypeId && !obj.event_type_id) {
      setObj({event_type_id:eventTypeId});
    }
  }, [eventTypeId, obj.event_type_id]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.backdrop}>
        <TouchableOpacity style={styles.overlay} onPress={onCancel} />

          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
          <Text style={styles.header}>{objectId ? t('editNote') : t('newNote')}</Text>
          <ScrollView contentContainerStyle={styles.body}>
            {obj.images ? <ImagesGrid urls={obj.images} /> : ""}
            <TextInput
              style={styles.input}
              value={obj.title || ''}
              onChangeText={(text) => setObj({ ...obj, title: text })}
              placeholder={t('noteTitlePlaceholder')}
            />
            <TextInput
              style={[styles.input, { maxHeight: 180 }]}
              value={obj.description || ''}
              onChangeText={(text) => setObj({ ...obj, description: text })}
              placeholder={t('noteDescriptionPlaceholder')}
              multiline
              textAlignVertical="top"
            />
            <TextInput
              style={styles.input}
              placeholder={t('additionalTagPlaceholder')}
              value={obj.additional_tag || ''}
              onChangeText={(text) => setObj({ ...obj, additional_tag: text })}
            />
            <EventTypeSelector
              onChange={(id: number | null) => setObj({ ...obj, event_type_id: id })}
              value={obj.event_type_id}
            />
          </ScrollView>
          <View style={styles.footerRow}>
            <View style={styles.footerRowHalf}>
              <TouchableOpacity onPress={() => uploadImageHandler('gallery')} style={styles.footerButton}>
                <ImageIcon />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => uploadImageHandler('camera')} style={styles.footerButton}>
                <CameraIcon />
              </TouchableOpacity>
            </View>
            <View style={styles.footerRowHalf}>
              <TouchableOpacity onPress={onCancel} style={styles.footerButton}>
                <Text style={styles.cancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCreate} style={styles.footerButton}>
                <Text style={styles.doneText}>{t('done')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {objectId && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Text style={styles.deleteText}>{t('deleteNote')}</Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end',
	marginBottom:-35, },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  container: {
    maxHeight: '90%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
  },
  body: { paddingHorizontal: 16, paddingBottom: 20 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,

  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  footerRowHalf : {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerButton: { paddingVertical: 12, paddingHorizontal: 16 },
  cancelText: { fontSize: 16, color: '#555' },
  doneText: { fontSize: 16, fontWeight: '600', color: '#445360' },
  deleteButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  deleteText: { fontSize: 16, color: '#E74C3C' },
});

const mapState = ({ popup }: { popup: IPopupStore }) => {
  const { objectId, objectType, eventTypeId } = popup;
  return { objectId, objectType, eventTypeId };
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
export default connector(EditNoteModal);


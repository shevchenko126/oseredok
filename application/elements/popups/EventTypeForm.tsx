import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { connect } from "react-redux";
import IPopupStore from "../store/popup/initStore.interface";
// npm install react-native-emoji-selector
import EmojiSelector from 'react-native-emoji-selector';
import { EventTypeCreate } from '../dto/main';
import { createEventType, getSingleEventType, updateEventType } from '../api/main/eventTypes';
import { useTranslation } from '../helpers/lang';

interface AddEventTypeModalProps {
    visible: boolean;
    onClose: () => void;
    closeEditPopup: () => void;
    setEventTypeId: (eventTypeId: number | null) => void;
    objectId: number | null;
    objectType: string | null;
}

const EventTypeModalForm = ({ visible, onClose, closeEditPopup, objectId, setEventTypeId }: AddEventTypeModalProps) => {

    const [obj, setObj] = useState<EventTypeCreate>({});
    const t = useTranslation();
    const inputRef = useRef(null);

    const handleEmojiPress = (e: string) => {
        setObj({ ...obj, emoji: e });
    };

    const onAdd = async () => {
      if (obj.title?.trim()) {
        if( objectId ) {
          await updateEventType(objectId!!, obj);
          closeEditPopup();
        } else {
          const { data } = await createEventType(obj);
          closeEditPopup();
          setEventTypeId(data.id);
        }
        setObj({});
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        if (objectId) {
          const { data } = await getSingleEventType(objectId);
          setObj(data);
        } else {
          setObj({});
        }
      }
      fetchData();
    }, [objectId]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
          
            <View style={styles.backdrop}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.select({ ios: 'padding', android: undefined })}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.headerBtn}>{t('cancel')}</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>{t('addEventType')}</Text>
                        <TouchableOpacity
                            onPress={onAdd}
                            disabled={!obj.title?.trim()}
                        >
                            <Text style={[styles.headerBtn, !obj.title?.trim() && styles.disabled]}>
                                                                {objectId ? t('update') : t('add')}
                                                        </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputRow}>
                        {/* Иконка-эмоджи */}
                        <Text style={styles.emojiIcon}>{obj.emoji}</Text>
                        {/* Поле ввода */}
                        <TextInput
                            ref={inputRef}
                            style={styles.input}
                            placeholder={t('enterEventTypeNamePlaceholder')}
                            value={obj.title!!}
                            onChangeText={(title) => {
                              setObj({ ...obj, title })
                          }}
                        />
                    </View>

                    {/* Селектор эмоджи */}
                    <View style={styles.pickerContainer}>
                        <EmojiSelector
                            onEmojiSelected={handleEmojiPress}
                            showSearchBar={false}
                            showSectionTitles={false}
                            // category={Categories.smileys}
                            columns={8}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  headerBtn: {
    fontSize: 16,
    color: '#007aff',
  },
  disabled: {
    color: '#aaa',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    paddingHorizontal: 8,
  },
  emojiIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  pickerContainer: {
    height: 250,           // регулируйте под свою высоту
    borderTopWidth: 1,
    borderColor: '#eee',
  },
});


const mapState = ({
    popup,
}: {
    popup: IPopupStore;
}) => {
    const { objectId, objectType } = popup;
    return { objectId, objectType };
};

const mapDispatch = {
    closeEditPopup: () => ({
        type: "OPEN_PREVIOUS_POPUP"
    }),
    setEventTypeId: (eventTypeId: number | null) => ({
        type: "SET_EVENT_TYPE_ID",
        payload: {eventTypeId},
    }),
};

const connector = connect(mapState, mapDispatch);
const EventTypeModalFormRedux = connector(EventTypeModalForm);

export default EventTypeModalFormRedux;
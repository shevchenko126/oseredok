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
import { connect } from "react-redux";
import IPopupStore from "../store/popup/initStore.interface";
import EventTypeSelector from '../components/edit/EventTypeSelector';
import { TaskCreate } from '../dto/main';
import Checkbox from '../components/UI/inputs/Checkbox';
import PriorityStars from '../components/UI/inputs/PriorityStars';
import DateTimePicker from '../components/UI/inputs/DateTimePicker';
import { createTask, updateTask, deleteTask, getSingleTask } from '../api/main/tasks';
import { useTranslation } from '../helpers/lang';


export type EventType = { id: string; icon: string; label: string };
export type CreateType = 'event' | 'task' | 'note';

interface EditTaskModalProps {
  visible: boolean;
  onClose: () => void;
    objectId: number | null;
    objectType?: string | null;
	eventTypeId?: number | null;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  visible,
  onClose,
  objectId,
  eventTypeId
}) => {

    const [obj, setObj] = useState<TaskCreate>({});
    const t = useTranslation();

	const onCancel = () => {
		setObj({});
		onClose();
	};


	const onCreate = async () => {
		if (obj.title?.trim() && obj.event_type_id) {
			if( objectId ) {
				await updateTask(objectId!!, obj);
				onClose();
			} else {
				await createTask(obj);
				onClose();
			}
			setObj({});
		}
	};

	const onDelete = async () => {
		if (objectId) {
			await deleteTask(objectId);
			onClose();
		}
	};

	useEffect(() => {
		const fetchData = async () => {
      	if (!visible) return;
		if (objectId) {
			const { data } = await getSingleTask(objectId);
			setObj(data);
		} else {
			setObj({});
		}
		}
		fetchData();
	}, [objectId, visible]);

	useEffect(() => {
		if (eventTypeId && !obj.event_type_id) {
			setObj({event_type_id:eventTypeId});
		}
	}, [eventTypeId, obj.event_type_id]);

	return (
		<Modal visible={visible} animationType="slide" transparent>

			<KeyboardAvoidingView
			style={styles.wrapper}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
			>
				<SafeAreaView style={styles.backdrop}>
					<TouchableOpacity style={styles.overlay} onPress={onCancel} />
					<View style={styles.container}>
          <Text style={styles.header}>{objectId ? t('editTask') : t('newTask')}</Text>
          <ScrollView contentContainerStyle={styles.body}>
          {/* Title */}
          <TextInput
                  style={styles.input}
                  value={obj.title || ''}
                  onChangeText={(text) => setObj({ ...obj, title: text })}
                  placeholder={t('taskTitlePlaceholder')}
          />

          {/* Description */}
          <TextInput
                  style={styles.input}
                  value={obj.description || ''}
                  onChangeText={(text) => setObj({ ...obj, description: text })}
                  placeholder={t('taskDescriptionPlaceholder')}
          />

          {/* Toggles */}
          <Checkbox
                  isChecked={obj.is_completed || false}
                  onChange={(checked) => setObj({ ...obj, is_completed: checked })}
                  label={t('taskCompletedLabel')}
          />

          <Checkbox
                  isChecked={obj.is_accepted || false}
                  onChange={(checked) => setObj({ ...obj, is_accepted: checked })}
                  label={t('taskAcceptedLabel')}
          />



						{/* Priority */}
						<PriorityStars
							priority={obj.priority || 0}
							onChange={(priority) => setObj({ ...obj, priority })}
						/>

						{/* Deadline */}
            <DateTimePicker
                    value={obj.deadline || null}
                    onChange={(date) => setObj({ ...obj, deadline: date })}
                    title={t('deadline')}
            />

            {/* Additional Tag */}
            <TextInput
                    style={styles.input}
                    placeholder={t('additionalTagPlaceholder')}
                    value={obj.additional_tag || ''}
                    onChangeText={(text) => setObj({ ...obj, additional_tag: text })}
            />

						{/* Event Type Selector */}
						<EventTypeSelector
							onChange={(id: number | null) => setObj({ ...obj, event_type_id: id })}
							value={obj.event_type_id}
						/>
						</ScrollView>

						{/* Footer Buttons */}
            <View style={styles.footerRow}>
            <TouchableOpacity onPress={onCancel} style={styles.footerButton}>
                    <Text style={styles.cancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCreate} style={styles.footerButton}>
                    <Text style={styles.doneText}>{t('done')}</Text>
            </TouchableOpacity>
            </View>

            {/* Delete */}
            {objectId ? (
                    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                            <Text style={styles.deleteText}>{t('deleteTask')}</Text>
                    </TouchableOpacity>
            ) : null}
					</View>
				</SafeAreaView>
			</KeyboardAvoidingView>
		</Modal>
	);
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
	marginBottom:-35,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  container: {
    maxHeight: '100%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
	marginBottom:0,
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
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  deadlineLabel: { marginLeft: 8, fontSize: 16, color: '#333' },
  sectionLabel: { fontSize: 16, marginBottom: 8, color: '#333' },
  eventTypesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  eventTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  eventTypeSelected: { backgroundColor: '#FFEBE8' },
  eventTypeLabel: { marginLeft: 6, fontSize: 14, color: '#333' },
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
  doneText: { fontSize: 16, fontWeight: '600', color: '#445360' },
  deleteButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  deleteText: { fontSize: 16, color: '#E74C3C' },
});


const mapState = ({
    popup,
}: {
    popup: IPopupStore;
}) => {
    const { objectId, objectType, eventTypeId } = popup;
    return { objectId, objectType, eventTypeId };
};

const mapDispatch = {
    closeEditPopup: () => ({
        type: "SET_OBJECT_POPUP",
        payload:{
			id:null,
			type: null,
			popup: null,
		},
    }),
};



const connector = connect(mapState, mapDispatch);


const EditTaskModalRedux = connector(EditTaskModal);

export default EditTaskModalRedux;
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { connect } from "react-redux";
import IPopupStore from "../../store/popup/initStore.interface";
import { useNavigation, CommonActions } from '@react-navigation/native';

import { getDashboardEventType } from '../../api/main/dashboard';
import EventTypeSelector from '../components/edit/EventTypeSelector';
import { deleteEvent } from '../../api/main/events';
import { deleteEventType } from '../../api/main/eventTypes';
import { deleteTask } from '../../api/main/tasks';
import { deleteNote } from '../../api/main/notes';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from "../navigation/types";
import { useTranslation } from '../../helpers/lang';

interface DeleteEventTypeModalProps {
    visible: boolean;
    onClose: () => void;
    objectId: number | null;
    objectType?: string | null;
	closeEditPopup: () => void;
}

const DeleteConfirmation: React.FC<DeleteEventTypeModalProps> = ({ visible, onClose, objectId, objectType, closeEditPopup }) => {


        const navigation = useNavigation<NavigationProp<RootStackParamList>>();
        const t = useTranslation();
        // const [eventTypes, setEventTypes] = useState<EventType[]>([]);
	const [eventTypeId, setEventTypeId] = useState<number | null>(null);
	const [isEventTypeSelector, setIsEventTypeSelector] = useState<boolean>(false);


	const onCancel = () => {
		setEventTypeId(null);
		closeEditPopup();
		onClose();
	};


	const onDelete = async () => {
		if(!objectId || !objectType) return;
		if (objectType === 'eventType' || objectType === 'eventTypeMove') {
			deleteEventType( objectId, eventTypeId );
			setEventTypeId(null);
		} else if (objectType === 'event') {
			deleteEvent( objectId );
		} else if (objectType === 'task') {
			deleteTask( objectId );
		} else if (objectType === 'note') {
			deleteNote( objectId );
		}
		onCancel();

		navigation.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [{
					name: 'EventTypesList',
					params: { noAnim: true }
				}],
			})
		);

	};

	useEffect(() => {
		if( objectType === 'eventTypeMove' ) {
			getDashboardEventType(objectId!!).then( ({data, error}) => {
				if(!error && data && (data.events_count || data.tasks_count || data.notes_count)) {
					setIsEventTypeSelector(true);
				}
			});
		}
	}, [objectType, objectId]);

        const title = objectType === 'eventType' || objectType === 'eventTypeMove' ? t('deleteEventType') :
                objectType === 'event' ? t('deleteEvent') :
                objectType === 'task' ? t('deleteTask') :
                objectType === 'note' ? t('deleteNote') : t('deleteConfirmationTitle');

	return (
		<Modal visible={visible} animationType="slide">
			<SafeAreaView style={styles.backdrop}>
				<TouchableOpacity style={styles.overlay} onPress={onCancel} />
				<View style={styles.container}>
                                        <Text style={styles.header}>{title}</Text>
                                        <Text style={styles.subtitle}>{t('deleteConfirmationMessage')}</Text>
                                        { isEventTypeSelector && objectType === 'eventTypeMove' && (
                                                <>
                                                        <Text style={styles.subtitle}>{t('deleteConfirmationMoveMessage')}</Text>
                                                        <EventTypeSelector
                                                                onChange={(newEventTypeId) => {
                                                                        setEventTypeId(newEventTypeId);
								}}
								value={eventTypeId || null}
								excludeId={objectId || null}
							/>
						</>
					)}
					{/* Action buttons */}
					<View style={styles.footer}>
						<TouchableOpacity onPress={onCancel} style={styles.actionButton}>
                                                <Text style={styles.cancelText}>{t('cancel')}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={onDelete} style={styles.redActionButton}>
                                                <Text style={styles.deleteText}>{t('delete')}</Text>
                                                </TouchableOpacity>
                                        </View>
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
	padding:8,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 12,
  },
  body: { paddingHorizontal: 16, paddingBottom: 20 },
	title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
	subtitle: { fontSize: 14, fontWeight: 'normal', marginBottom: 16, textAlign: 'center' },
	commentInput: {
		height: 40,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		paddingHorizontal: 12,
		marginBottom: 16,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	label: { marginLeft: 8, fontSize: 16, color: '#333', flexShrink: 1 },
	pill: {
		backgroundColor: '#f0f0f0',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
		marginHorizontal: 8,
	},
	pillText: { fontSize: 14, color: '#333' },
	picker: { backgroundColor: '#fff', marginBottom: 16 },
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 'auto',
		paddingVertical: 16,
	},
	actionButton: { paddingHorizontal: 16, paddingVertical: 8 },
	redActionButton: { paddingHorizontal: 16, paddingVertical: 8 },
	deleteText: { fontSize: 16, color: '#D84242' },
	cancelText: { fontSize: 16, color: '#555' },
	createText: { fontSize: 16, color: '#007AFF' },
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
        type: "SET_OBJECT_POPUP",
        payload:{
			id:null,
			type: null,
			popup: null,
		},
    }),
};



const connector = connect(mapState, mapDispatch);


const DeleteConfirmationRedux = connector(DeleteConfirmation);

export default DeleteConfirmationRedux;
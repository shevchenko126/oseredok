import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from "react-redux";
import IPopupStore from "../store/popup/initStore.interface";
import DateTimePicker from '../components/UI/inputs/DateTimePicker'
import { EventCreate } from '../dto/main';
import EventTypeSelector from '../components/edit/EventTypeSelector';

import { createEvent, getSingleEvent, updateEvent } from '../api/main/events';
// import { appendLog } from '../helpers/writeLog';
import { useTranslation } from '../helpers/lang';

interface NewEventModalProps {
    visible: boolean;
    onClose: () => void;
    objectId: number | null;
    objectType?: string | null;
}

const NewEventModal: React.FC<NewEventModalProps> = ({ visible, onClose, objectId }) => {


        const [obj, setObj] = useState<EventCreate>({});
        const t = useTranslation();


	const onCancel = () => {
		setObj({});
		onClose();
	};


	const onCreate = async () => {
		if( objectId ) {
			await updateEvent(objectId!!, obj);
			onClose();
		} else {
			await createEvent(obj);
			onClose();
		}
		setObj({});
	};

	useEffect(() => {
		const fetchData = async () => {
		if (objectId) {
			const { data } = await getSingleEvent(objectId);
			setObj(data);
		} else {
			setObj({});
		}
		}
		fetchData();
	}, [objectId]);

	return (
		<Modal visible={visible} animationType="slide" transparent>
			  <SafeAreaView style={styles.backdrop}>
				<TouchableOpacity style={styles.overlay} onPress={onCancel} />

				<KeyboardAvoidingView
					style={styles.container}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
				>
					<ScrollView contentContainerStyle={styles.scrollViewContent}>
						<Text style={styles.title}>{t('newEvent')}</Text>
						<TextInput
								style={styles.commentInput}
								placeholder={t('addCommentPlaceholder')}
								value={obj.description ?? ''}
								onChangeText={(text) => setObj({ ...obj, description: text })}
						/>
						{/* Starts row */}
						<DateTimePicker
								title={t('starts')}
								value={obj.date_from || null}
								onChange={(date) => setObj({ ...obj, date_from: date })}
						/>
						{/* Ends row */}
						<DateTimePicker
								title={t('ends')}
								value={obj.date_to || null}
								onChange={(date) => setObj({ ...obj, date_to: date })}
						/>
						<EventTypeSelector
							onChange={(id: number | null) => setObj({ ...obj, event_type_id: id })}
							value={obj.event_type_id}
						/>

						<TextInput
								style={styles.commentInput}
								placeholder={t('addTitlePlaceholder')}
								value={obj.title ?? ''}
								onChangeText={(text) => setObj({ ...obj, title: text })}
						/>
						{/* Action buttons */}
						<View style={styles.footer}>
								<TouchableOpacity onPress={onCancel} style={styles.actionButton}>
								<Text style={styles.cancelText}>{t('cancel')}</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={onCreate} style={styles.actionButton}>
								<Text style={styles.createText}>{t('create')}</Text>
								</TouchableOpacity>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end',
	marginBottom:-35, },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
	scrollViewContent: { flexGrow: 1, padding: 16 },
	keyboardAvoidingView: { flex: 1, backgroundColor: '#f5f5f5' },
	title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
	commentInput: {
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
	container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16, maxHeight: '85%', },

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
	picker: { backgroundColor: '#f5f5f5', marginBottom: 16 },
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 'auto',
		paddingVertical: 16,
	},
	actionButton: { paddingHorizontal: 16, paddingVertical: 8 },
	cancelText: { fontSize: 16, color: '#555' },
	createText: { fontSize: 16, fontWeight: '600', color: '#445360' },
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


const EventModalFormRedux = connector(NewEventModal);

export default EventModalFormRedux;
import React from 'react';
import { connect } from "react-redux";
import IPopupStore from "../../store/popup/initStore.interface";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from '../../helpers/lang';

interface CreateNewModalProps {
	visible: boolean;
	onClose: () => void;
	openPopup: (popupToOpen: string) => void;
}

const AddNewModal: React.FC<CreateNewModalProps> = ({ visible, onClose, openPopup }) => {
        const t = useTranslation();

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent
			onRequestClose={onClose}
		>
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.backdrop} />
			</TouchableWithoutFeedback>
			<SafeAreaView style={styles.container}>
				<View style={styles.header}>
                                        <Text style={styles.title}>{t('createNew')}</Text>
				</View>
				<View style={styles.optionsRow}>
					<TouchableOpacity
						style={styles.option}
						onPress={() => openPopup('EventForm')}
						activeOpacity={0.7}
					>
					<View style={styles.iconWrapper}>
						<Icon name="clock" size={24} color="#333" />
					</View>
                                        <Text style={styles.label}>{t('event')}</Text>
					</TouchableOpacity>
					<TouchableOpacity
					style={styles.option}
					onPress={() => openPopup('TaskForm')}
					activeOpacity={0.7}
					>
						<View style={styles.iconWrapper}>
							<Icon name="clipboard-check" size={24} color="#333" />
						</View>
                                                <Text style={styles.label}>{t('task')}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.option}
						onPress={() => openPopup('NoteForm')}
						activeOpacity={0.7}
					>
						<View style={styles.iconWrapper}>
							<Icon name="book-open" size={24} color="#333" />
						</View>
                                                <Text style={styles.label}>{t('note')}</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  container: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  option: {
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#f5f5f5',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
});



const mapState = ({
    popup,
}: {
    popup: IPopupStore;
}) => {
    const { currentPopup } = popup;
    return { currentPopup };
};

const mapDispatch = {
    openPopup: (popupToOpen: string) => ({
        type: "SET_OPEN_POPUP",
        payload:popupToOpen,
    }),
};

const connector = connect(mapState, mapDispatch);


const AddNewModalRedux = connector(AddNewModal);

export default AddNewModalRedux;
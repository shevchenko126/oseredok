import React from 'react';
import { connect } from "react-redux";
import IPopupStore from "../../../../store/popup/initStore.interface";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute, RouteProp } from '@react-navigation/native';
import SearchFilterBar from '../../../components/eventTypes/EventTypeListFooter';
import { useTranslation } from '../../../../helpers/lang';



// Пункты меню на экране редактирования
interface EditOption {
  id: string;
  icon: string;
  label: string;
  action: () => void;
}

interface EditScreenProps {
  openEditPopup: (id: number) => void;
  onDelete: () => void;
}

const EditScreen: React.FC<EditScreenProps> = ({ openEditPopup, onDelete }) => {

  const route = useRoute<RouteProp<{ params: { eventTypeId: number } }>>();
  const { eventTypeId } = route.params;
  const t = useTranslation();

  // Действия по пунктам меню
  const options: EditOption[] = [
    {
      id: '1',
      icon: 'cog',
      label: t('editName'),
      action: () => {
        openEditPopup(eventTypeId);
      },
    },
    {
      id: '2',
      icon: 'trash',
      label: t('deleteEventType'),
      action: () => {
        // навигация к подтверждению удаления
        onDelete();
        // navigation.navigate('DeleteEventType' as never);
      },
    },
  ];

  return (
	<SafeAreaView style={styles.container}>
		<StatusBar barStyle="dark-content" />
		<View style={styles.list}>
		{options.map((opt) => (
			<TouchableOpacity
			key={opt.id}
			style={styles.item}
			onPress={opt.action}
			activeOpacity={0.7}
			>
			<View style={styles.itemRow}>
				<Icon name={opt.icon} size={20} color={opt.id === '2' ? '#E74C3C' : '#3498DB'} />
				<Text style={[styles.itemLabel, opt.id === '2' && { color: '#E74C3C' }]}>
				{opt.label}
				</Text>
			</View>
			<Icon name="chevron-right" size={18} color="#999" />
			</TouchableOpacity>
		))}
		</View>
    <SearchFilterBar
      title={""}
      eventTypeId={eventTypeId}
    />

	</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { marginTop: 16, paddingHorizontal: 16 },
  item: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemLabel: { marginLeft: 12, fontSize: 16, color: '#333' },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 56,
  },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabItemSelected: { backgroundColor: '#333' },
  tabText: { fontSize: 14, color: '#333' },
  tabTextSelected: { color: '#fff', fontWeight: '600' },
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
    openEditPopup: (id: number) => ({
        type: "SET_OBJECT_POPUP",
        payload:{
			id,
			type: "eventType",
			popup: "EventTypeForm" ,
		},
    }),
    openDeletePopup: () => ({
        type: "SET_OPEN_POPUP",
        payload: "DeleteEventType",
    }),
};



const connector = connect(mapState, mapDispatch);


const EditScreenRedux = connector(EditScreen);

export default EditScreenRedux;
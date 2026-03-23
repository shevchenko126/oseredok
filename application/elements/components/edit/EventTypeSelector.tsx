import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { connect } from "react-redux";
import IPopupStore from "../../../store/popup/initStore.interface";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { EventType } from '../../../dto/main/types.gen'
import { getEventTypes } from '../../../api/main/eventTypes';
import { useTranslation } from '../../../helpers/lang';

interface IProps {
    onChange: (eventTypeId: number | null) => void;
	  value?: number | null;
    openAddFormPopup: () => void;
    excludeId?: number | null;
}

const EventTypeSelector = ({ onChange, openAddFormPopup, value, excludeId }:IProps) => {

    const t = useTranslation();
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);


    const onAddNewType = () => {
        openAddFormPopup();
    };

    useEffect(() => {
        getEventTypes(-1).then((res) => {
            setEventTypes(res.data!.items);
        }).catch((err) => {
            console.error('Error fetching event types:', err);
        });
    }, []);

    return (
        <View>
            <Text style={styles.sectionLabel}>{t('eventType')}</Text>
            <View style={styles.typesRow}>
                <TouchableOpacity
                    style={[styles.typeItem, styles.addNewItem]}
                    onPress={onAddNewType}
                >
                  <Icon name="plus" size={16} color="#445360" />
                  <Text style={[styles.typeLabel, { color: '#445360' }]}> {t('addNew')}</Text>
                </TouchableOpacity>
                {eventTypes && eventTypes.filter(et => et.id !== excludeId).map((et) => (
                    <TouchableOpacity
                        key={et.id}
                        style={[
							styles.typeItem,
							value === et.id && styles.typeSelected,
                        ]}
                        onPress={() => onChange(et.id)}
                    >
                        <Text style={[
							styles.typeLabel,
							value === et.id && styles.typeSelectedText,
                        ]}>{et.emoji} {et.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  container: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,

  },
  addNewItem: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  typeSelected: {
    borderColor: 'rgba(255, 50, 0, 1)',
    borderWidth: 1,
  },
  typeSelectedText: {
	  color: 'rgba(255, 50, 0, 1)',
  },
  typeLabel: { fontSize: 14, color: '#333' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  actionButton: { padding: 8 },
  cancelText: { fontSize: 16, color: '#555' },
  createText: { fontSize: 16, color: '#445360' },
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
    closePopup: () => ({
        type: "CLOSE_POPUP"
    }),
    openAddFormPopup: () => ({
        type: "SET_OPEN_POPUP",
        payload: "EventTypeForm"
    }),
};

const connector = connect(mapState, mapDispatch);
const EventTypeSelectorRedux = connector(EventTypeSelector);

export default EventTypeSelectorRedux;
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList,
  Switch,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../../helpers/lang';
import {
  getBuildings,
  getApartmentsByBuilding,
  setupBuilding,
  Building,
  Apartment,
} from '../../../api/realestate';

interface Props {
  onDone: () => void;
}

type PickerTarget = 'building' | 'apartment' | null;

export default function BuildingSetupScreen({ onDone }: Props) {
  const t = useTranslation();

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  const [loadingApartments, setLoadingApartments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await getBuildings();
      if (data) setBuildings(data.items);
      setLoadingBuildings(false);
    })();
  }, []);

  const handleSelectBuilding = async (building: Building) => {
    setSelectedBuilding(building);
    setSelectedApartment(null);
    setApartments([]);
    setPickerTarget(null);
    setLoadingApartments(true);
    const { data } = await getApartmentsByBuilding(building.id);
    if (data) setApartments(data.items);
    setLoadingApartments(false);
  };

  const handleSelectApartment = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setPickerTarget(null);
  };

  const handleSubmit = async () => {
    if (!selectedBuilding || !selectedApartment) return;
    setSubmitting(true);
    const { error } = await setupBuilding(selectedBuilding.id, selectedApartment.id, isOwner);
    setSubmitting(false);
    if (!error) onDone();
  };

  const canSubmit = !!selectedBuilding && !!selectedApartment && !submitting;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.heading}>{t('selectBuildingHeading')}</Text>
        <Text style={styles.subHeading}>{t('selectBuildingSubheading')}</Text>

        {/* Building selector */}
        <TouchableOpacity
          style={styles.selector}
          onPress={() => {
            if (!loadingBuildings) setPickerTarget('building');
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.selectorText, !selectedBuilding && styles.placeholder]}>
            {selectedBuilding
              ? `${selectedBuilding.address}, ${selectedBuilding.city}`
              : t('selectBuilding')}
          </Text>
          {loadingBuildings ? (
            <ActivityIndicator size="small" color="#555" />
          ) : (
            <MaterialIcons name="keyboard-arrow-down" size={22} color="#555" />
          )}
        </TouchableOpacity>

        {/* Apartment selector */}
        <TouchableOpacity
          style={[styles.selector, !selectedBuilding && styles.selectorDisabled]}
          onPress={() => {
            if (selectedBuilding && !loadingApartments) setPickerTarget('apartment');
          }}
          activeOpacity={0.7}
          disabled={!selectedBuilding}
        >
          <Text style={[styles.selectorText, !selectedApartment && styles.placeholder]}>
            {selectedApartment
              ? `${t('selectApartment')} ${selectedApartment.number}`
              : t('selectApartment')}
          </Text>
          {loadingApartments ? (
            <ActivityIndicator size="small" color="#555" />
          ) : (
            <MaterialIcons name="keyboard-arrow-down" size={22} color="#555" />
          )}
        </TouchableOpacity>

        {/* is_owner checkbox */}
        <View style={styles.ownerRow}>
          <Text style={styles.ownerLabel}>{t('isOwner')}</Text>
          <Switch
            value={isOwner}
            onValueChange={setIsOwner}
            trackColor={{ true: '#ff3300', false: '#ccc' }}
            thumbColor="#fff"
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitLabel}>{t('setupBuildingSubmit')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Picker modal */}
      <Modal
        visible={pickerTarget !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerTarget(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerTarget(null)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <FlatList
              data={pickerTarget === 'building' ? buildings : apartments}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                if (pickerTarget === 'building') {
                  const b = item as Building;
                  return (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => handleSelectBuilding(b)}
                    >
                      <Text style={styles.modalItemText}>{b.address}</Text>
                      <Text style={styles.modalItemSub}>{b.city}</Text>
                    </TouchableOpacity>
                  );
                }
                const a = item as Apartment;
                return (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleSelectApartment(a)}
                  >
                    <Text style={styles.modalItemText}>
                      {t('selectApartment')} {a.number}
                    </Text>
                    <Text style={styles.modalItemSub}>
                      {a.floor}F · {a.rooms} rooms · {a.area} m²
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heading: {
    marginTop: 48,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  subHeading: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    lineHeight: 20,
  },
  selector: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  selectorDisabled: {
    opacity: 0.4,
  },
  selectorText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholder: {
    color: '#b0b0b0',
  },
  ownerRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  ownerLabel: {
    fontSize: 16,
    color: '#000',
  },
  submitBtn: {
    marginTop: 36,
    backgroundColor: '#ff3300',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#8c8c8c',
  },
  submitLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 32,
    maxHeight: '60%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
  },
  modalItemSub: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});

// FilterSheet.tsx
import React, { useEffect, useRef } from 'react';
import { connect } from "react-redux";
import IPopupStore, { IFilterType } from "../store/popup/initStore.interface";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { useTranslation } from '../helpers/lang';


const filters = {
    "eventTypes": [
        { key: 'eventTypes_most_time_spent', labelKey: 'filterMostTimeSpent' },
        { key: 'eventTypes_least_time_spent', labelKey: 'filterLeastTimeSpent' },
        { key: 'eventTypes_no_time_tracked', labelKey: 'filterNoTimeTracked' },
        { key: 'eventTypes_with_tasks', labelKey: 'filterWithTasks' },
        { key: 'eventTypes_with_notes', labelKey: 'filterWithNotes' },
        { key: 'eventTypes_with_both', labelKey: 'filterWithBoth' },
        { key: 'eventTypes_empty', labelKey: 'filterEmpty' },
    ],
    "tasks": [
        { key: 'tasks_high_priority', labelKey: 'filterHighPriority' },
        { key: 'tasks_completed', labelKey: 'filterCompleted' },
        { key: 'tasks_not_completed', labelKey: 'filterNotCompleted' },
        { key: 'tasks_with_deadline', labelKey: 'filterWithDeadline' },
        { key: 'tasks_without_deadline', labelKey: 'filterWithoutDeadline' },
    ],
    "notes": [
        { key: 'notes_recently_edited', labelKey: 'filterRecentlyEdited' },
        { key: 'notes_with_attachments', labelKey: 'filterWithAttachments' },
        { key: 'notes_without_title', labelKey: 'filterWithoutTitle' },
    ]
};



type Props = {
  visible: boolean;
  onClose: () => void;
  filterType: IFilterType | null;
  filterString: string | null;
  title?: string;
  clearText?: string;
  setFilterString: (filterString: string | null) => void;
};

const FilterPopup = ({
  visible,
  onClose,
  filterType,
  filterString,
  setFilterString,
  title,
  clearText,
}: Props) => {
  const t = useTranslation();
  const translateY = useRef(new Animated.Value(500)).current;
  const opacity = useRef(new Animated.Value(0)).current;

    const onSelect = (key:string | null) => {
        setFilterString(key);
        onClose();
    }

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(translateY, {
          toValue: 500,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>

        <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Sheet */}
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
              <View style={styles.header}>
                <View />
              <Text style={styles.title}>{title || t('filterTitle')}</Text>
              <Pressable
                  onPress={() => onSelect(null)}
                  accessibilityRole="button"
                  hitSlop={8}
              >
                  <Text style={styles.clear}>{clearText || t('clear')}</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.list}
              bounces={false}
              showsVerticalScrollIndicator={false}
              >
              {filterType && filters[filterType].map((opt) => (
                  <RadioItem
                    key={opt.key}
                    label={t(opt.labelKey)}
                    selected={filterString === opt.key}
                    onPress={() => onSelect(opt.key)}
                  />
              ))}
            </ScrollView>
            
        </Animated.View>

    </Modal>
  );
}

function RadioItem({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.item} onPress={onPress} android_ripple={{ color: '#e6e6e6' }}>
      <Text style={styles.itemText}>{label}</Text>
      <View style={styles.radioOuter} accessibilityRole="radio" accessibilityState={{ selected }}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    // maxHeight: '50%',
    paddingBottom: 24,
  },

  // backdrop: {
  //   flex: 1,
  //   justifyContent: 'flex-end',
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   width: '100%',
  //   height: '100%',
  // },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  container: {
    maxHeight: '100%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  backdropInner: {
    // flex: 1,
    // backgroundColor: '#000000',
    // opacity: 0.25,
  },
  // sheet: {
  //   // backgroundColor: '#FFFFFF',
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   paddingTop: 14,
  //   paddingHorizontal: 16,
  //   // paddingBottom: 28, // место под home-indicator
  //   shadowColor: '#000',
  //   shadowOpacity: 0.15,
  //   shadowRadius: 12,
  //   // elevation: 14,
  // },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2b2b2b',
  },
  clear: {
    fontSize: 14,
    color: '#3f515f',
    fontWeight: '500',
  },
  list: {
    paddingVertical: 6,
  },
  item: {
    minHeight: 44,
    paddingVertical: 10,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
  },
  itemText: {
    fontSize: 15,
    color: '#232323',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2f2f2f',
  },
  grabberContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E5EA',
  },
});



const mapState = ({
    popup,
}: {
    popup: IPopupStore;
}) => {
    const { currentPopup, filterType, filterString } = popup;
    return { currentPopup, filterType, filterString };
};

const mapDispatch = {
    openFilterPopup: (payload:string) => ({
        type: "OPEN_FILTER_POPUP",
        payload
    }),
    openSearchField: () => ({
        type: "OPEN_SEARCH_FIELD",
    }),
    setFilterString: (filterString: string | null) => ({
        type: "SET_FILTER_STRING",
        payload: filterString,
    }),
};



const connector = connect(mapState, mapDispatch);


const FilterPopupRedux = connector(FilterPopup);

export default FilterPopupRedux;
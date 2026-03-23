// SearchFilterBar.tsx
import React from 'react';
import { connect } from "react-redux";
import {
    Pressable,
    StyleSheet,
    TextInput,
    Text,
    View,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';  
import IPopupStore, { IFilterType } from "../../../store/popup/initStore.interface";
import { getSingleEventType } from "../../../api/main/eventTypes";
import type { RootStackParamList } from "../../navigation/types";
import FilterIcon from '../icons/filter';
import { useTranslation } from '../../../helpers/lang';

type Props = {
    title?: string;
    filterType?: IFilterType;
    eventTypeId?: number;
    openSearchField?: () => void;
    openFilterPopup?: (filter: IFilterType) => void;
    searchKeyword: string | null;
    setSearchKeyword: (keyword: string) => void;
};

const SearchFilterBar = ({
  title,
  filterType = IFilterType.EVENT_TYPES,
  eventTypeId,
  openFilterPopup,
  searchKeyword,
  setSearchKeyword
}: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const t = useTranslation();
  const [isSearchFieldOpen, setIsSearchFieldOpen] = React.useState(false);
  const [isSearchFieldFocused, setIsSearchFieldFocused] = React.useState(false);
  const [eventTypeTitle, setEventTypeTitle] = React.useState<string | null>(null);
    
  React.useEffect(() => {
    let isMounted = true;

    if (!eventTypeId) {
      setEventTypeTitle(null);
      return () => {
        isMounted = false;
      };
    }

    const fetchEventType = async () => {
      try {
        const response = await getSingleEventType(eventTypeId);

        if (!response.error && response.data && isMounted) {
          const titleParts = [response.data.emoji, response.data.title].filter(Boolean);
          setEventTypeTitle(titleParts.join(' ').trim());
        }
      } catch (error) {
        if (isMounted) {
          setEventTypeTitle(null);
        }
        console.warn('Failed to fetch event type title', error);
      }
    };

    fetchEventType();

    return () => {
      isMounted = false;
    };
  }, [eventTypeId]);


  React.useEffect(() => {
    setSearchKeyword('');
  }, [filterType, setSearchKeyword]);


  const onPressSearch = () => {
    setIsSearchFieldOpen(true);
  };

  const onPressFilter = () => {
    openFilterPopup && openFilterPopup(filterType);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const isEventTypeContext = typeof eventTypeId === 'number';
  const baseTitle = title || t('eventTypes');
  const displayTitle = isEventTypeContext ? eventTypeTitle || baseTitle : baseTitle;

  return (

    <View style={[styles.wrapper, eventTypeId ? styles.eventType : null]} >
      {isEventTypeContext ? (
        <>
          <Pressable style={styles.backButton} onPress={handleBackPress} hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color="#2b2b2b" />
          </Pressable>
          <Text numberOfLines={1} style={[styles.title, styles.centerTitle]}>
            {displayTitle}
          </Text>
          <Pressable style={styles.iconButton} onPress={onPressFilter} hitSlop={8}>
            {/* <Ionicons name="funnel-outline" size={22} color="#2b2b2b" /> */}
            <FilterIcon />
          </Pressable>
        </>
      ) : isSearchFieldOpen ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.searchPlaceholder}>
            <TextInput
                autoFocus
                placeholder={t('keywordPlaceholder')}
                value={searchKeyword || ''}
                onChangeText={setSearchKeyword}
                returnKeyType="done"
                style={[styles.input, isSearchFieldFocused ? styles.inputFocused : null]}
                onFocus={() => setIsSearchFieldFocused(true)}
                onBlur={() => setIsSearchFieldFocused(false)}
            />
            <Pressable onPress={() => {
                setIsSearchFieldOpen(false);
                setSearchKeyword('');
            }}>
              <Text>{t('close')}</Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <>
          <Text numberOfLines={1} style={styles.title}>
            {displayTitle}
          </Text>

          <View style={styles.actions}>
            <Pressable style={styles.iconButton} onPress={onPressSearch} hitSlop={8}>
              <Ionicons name="search" size={22} color="#2b2b2b" />
            </Pressable>

            {filterType && (
              <Pressable style={styles.iconButton} onPress={onPressFilter} hitSlop={8}>
                {/* <Ionicons name="funnel-outline" size={22} color="#2b2b2b" /> */}
                <FilterIcon />
              </Pressable>
          )}
          </View>
        </>
      )}
    
    </View>
  );
};

/* ---- Styles ---- */

const styles = StyleSheet.create({
  wrapper: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    elevation: 1,
    marginBottom: 40,
    marginTop: 'auto',
    position: 'relative',
    zIndex: 10,
  },
  eventType :{
    marginBottom: 10,

  },
  input: {
    height: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    width: '85%',
    borderRadius: 8,
  },
  inputFocused: {
    borderColor: '#3A5160',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#3b3b3b',
  },
  centerTitle: {
    textAlign: 'center',
    marginHorizontal: 8,
  },
  actions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
  backButton: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  searchPlaceholder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});


const mapState = ({
    popup,
}: {
    popup: IPopupStore;
}) => {
    const { currentPopup, searchKeyword } = popup;
    return { currentPopup, searchKeyword };
};

const mapDispatch = {
    openFilterPopup: (payload: IFilterType) => ({
        type: "OPEN_FILTER_POPUP",
        payload
    }),
    openSearchField: () => ({
        type: "OPEN_SEARCH_FIELD",
    }),
    setSearchKeyword: (payload: string) => ({
        type: "SET_SEARCH_KEYWORD",
        payload
    }),
};



const connector = connect(mapState, mapDispatch);


const SearchFilterBarRedux = connector(SearchFilterBar);

export default SearchFilterBarRedux;
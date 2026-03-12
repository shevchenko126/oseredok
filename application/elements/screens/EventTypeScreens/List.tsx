import React, { FC, useCallback, useContext, useState } from 'react';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import IPopupStore from '../../store/popup/initStore.interface';
import { AuthContext } from '../../helpers/auth';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { EventType } from '../../dto/main/types.gen';
import ListItem from '../../components/eventTypes/EventTypesListItem';
import EventTypeListFooter from '../../components/eventTypes/EventTypeListFooter';
import { getEventTypes, IFilters } from '../../api/main/eventTypes';
import { useTranslation } from '../../helpers/lang';

interface IEventTypesListScreenProps {
  openPopup: (popupToOpen: string) => void;
  closePopup: () => void;
  currentPopup: string | null;
  filterString: string | null;
  searchKeyword: string | null;
}

const EventTypesListScreen: FC<IEventTypesListScreenProps> = ({
  openPopup,
  closePopup,
  filterString,
  searchKeyword
}) => {
  const t = useTranslation();
  const [data, setData] = useState<EventType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const auth = useContext(AuthContext);

  const fetchEventTypes = useCallback(
    async (targetPage: number, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsInitialLoading(true);
      }


      const filters: IFilters = {};
      if (filterString && filterString.startsWith("eventTypes")) {
        if (filterString === "eventTypes_most_time_spent") {
          filters.order_by = 'duration';
          filters.order = 'desc';
        } else if( filterString === "eventTypes_least_time_spent") {
          filters.order_by = 'duration';
          filters.order = 'asc';
        } else if( filterString === "eventTypes_no_time_tracked") {
          filters.duration = 0;
        } else if ( filterString === "eventTypes_with_tasks") {
          filters.is_tasks = true;
        } else if ( filterString === "eventTypes_with_notes") {
          filters.is_notes = true;
        } else if ( filterString === "eventTypes_with_both") {
          filters.is_tasks = true;
          filters.is_notes = true;
        } else if ( filterString === "eventTypes_empty") {
          filters.is_tasks = false;
          filters.is_notes = false;
        }
      }

      if (searchKeyword && searchKeyword.trim().length > 0) {
        filters.search = searchKeyword.trim();
      }

      try {
        const eventTypesResp = await getEventTypes(targetPage, filters);

        if (eventTypesResp.error) {
          console.warn('Error fetching event types:', eventTypesResp.error);
          auth?.logout();
          closePopup();
          if (!append) {
            setData([]);
          }
          return;
        }

        const eventTypes = eventTypesResp.data;

        if (!eventTypes || (!searchKeyword && !filterString && !eventTypes.total)) {
          if (!append) {
            setData([]);
            openPopup('EventTypeForm');
          }
          return;
        }

        setPage(eventTypes.page);
        setTotalPages(eventTypes.total_pages);
        setData((prev) => {
          if (append) {
            const existingIds = new Set(prev.map((item) => item.id));
            const newItems = eventTypes.items.filter((item) => !existingIds.has(item.id));
            return [...prev, ...newItems];
          }
          return eventTypes.items;
        });
      } catch (error) {
        console.warn('Unexpected error fetching event types:', error);
      } finally {
        setIsInitialLoading(false);
        setIsLoadingMore(false);
      }
    },
    [auth, closePopup, openPopup, filterString, searchKeyword]
  );

  useFocusEffect(
    useCallback(() => {
      fetchEventTypes(1, false);
    }, [fetchEventTypes])
  );

  const handleEventTypeUpdated = useCallback(
    (updatedEventType: EventType) => {
      setData((prevData) =>
        prevData.map((existing) =>
          existing.id === updatedEventType.id ? updatedEventType : existing
        )
      );
    },
    []
  );

  const renderItem: ListRenderItem<EventType> = ({ item }) => (
    <ListItem item={item} onEventTypeUpdate={handleEventTypeUpdated} />
  );

  const handleLoadMore = useCallback(() => {
    if (isInitialLoading || isLoadingMore) {
      return;
    }

    if (totalPages !== null && page >= totalPages) {
      return;
    }

    fetchEventTypes(page + 1, true);
  }, [fetchEventTypes, isInitialLoading, isLoadingMore, page, totalPages]);

  const handleRefresh = useCallback(() => {
    if (isInitialLoading || isLoadingMore) {
      return;
    }

    fetchEventTypes(1, false);
  }, [fetchEventTypes, isInitialLoading, isLoadingMore]);

  const EmptyState = useCallback(() => {
    if (isInitialLoading) {
      return <ActivityIndicator style={styles.emptyLoader} />;
    }

    return <Text style={styles.emptyPlaceholder}>{t('eventTypeEmptyStateTitle')}</Text>;
  }, [isInitialLoading, t]);


  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // подстрой под высоту таббара/хедера
    >
      <SafeAreaView
        style={styles.container}
        // edges={['left', 'right', 'bottom']}
      >
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator style={styles.footerLoader} /> : null
          }
          ListEmptyComponent={EmptyState}
          refreshing={isInitialLoading}
          onRefresh={handleRefresh}
        />
        <EventTypeListFooter />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingBottom:80 },
  list: { padding: 16, paddingBottom: 80 },
  emptyList: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: 'rgba(58, 81, 96, 1)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyPlaceholder: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  footerLoader: { marginVertical: 16 },
  emptyLoader: { marginTop: 32 },
});

const mapState = ({
  popup,
}: {
  popup: IPopupStore;
}) => {
  const { currentPopup, filterString, searchKeyword } = popup;
  return { currentPopup, filterString, searchKeyword };
};

const mapDispatch = {
  openPopup: (popupToOpen: string) => ({
    type: 'SET_OPEN_POPUP',
    payload: popupToOpen,
  }),
  closePopup: () => ({
    type: 'CLOSE_POPUP',
  }),
};

const connector = connect(mapState, mapDispatch);

const EventTypesListScreenRedux = connector(EventTypesListScreen);

export default EventTypesListScreenRedux;

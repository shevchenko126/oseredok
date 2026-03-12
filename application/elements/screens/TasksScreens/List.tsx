import React, { useState, useCallback, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from '../../helpers/lang';
import { connect } from 'react-redux';

import { getEventTypes } from '../../api/main/eventTypes';
import { getTasks } from '../../api/main/tasks';
import { EventType, Task } from '../../dto/main/types.gen';
import { AuthContext } from '../../helpers/auth';
import IPopupStore from '../../store/popup/initStore.interface';
import SearchFilterBar from '../../components/eventTypes/EventTypeListFooter';
import { IFilterType } from '../../store/popup/initStore.interface';
import TasksListByEventType from '../../components/tasks/TasksList.tsx';

interface ITasksListProps {
  popup: IPopupStore;
}

const TasksList: React.FC<ITasksListProps> = ({ popup }) => {

  const t = useTranslation();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [page, setPage] = useState(1);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [tasks, setTasks] = useState<Record<number, Task[]>>({});
  const [editingEventTypeId, setEditingEventTypeId] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [totalPages, setTotalPages] = useState<number | null>(null);
  const auth = useContext(AuthContext);

  const fetchEventTypes = useCallback( 
    async (targetPage: number, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsInitialLoading(true);
      }

      try {
        const eventTypesResp = await getEventTypes(targetPage, {is_tasks: true});

        if (eventTypesResp.error) {
          console.warn('Error fetching event types:', eventTypesResp.error);
          auth?.logout();
          if (!append) {
            setEventTypes([]);
          }
          return;
        }

        const eventTypes = eventTypesResp.data;

        if (!eventTypes || !eventTypes.total) {
          if (!append) {
            setEventTypes([]);
          }
          return;
        }

        setPage(eventTypes.page);
        setTotalPages(eventTypes.total_pages);
        setEventTypes((prev) => {
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




        // const resp = await getEventTypes();
        // if (resp.error) {
        //   auth?.logout();
        //   return;
        // }
        // setEventTypes(resp.data?.items || []);
      },
    [auth]
  );

  useFocusEffect(
    useCallback(() => {
      fetchEventTypes(1, false);
    }, [fetchEventTypes])
  );



  const toggleSection = async (id: number) => {
    const isExpanded = expandedSections[id];
    const nextExpanded = !isExpanded;
    setExpandedSections(prev => ({ ...prev, [id]: nextExpanded }));
    if (nextExpanded && !tasks[id]) {
      const resp = await getTasks(1, id);
      if (!resp.error) {
        setTasks(prev => ({ ...prev, [id]: resp.data?.items || [] }));
      }
    }
  };


  const handleLoadMore = useCallback(() => {
    if (isInitialLoading || isLoadingMore) {
      return;
    }

    if (totalPages !== null && page >= totalPages) {
      return;
    }

    fetchEventTypes(page + 1, true);
  }, [fetchEventTypes, isInitialLoading, isLoadingMore, page, totalPages]);



  useEffect(() => {
    const refreshTasks = async () => {
      if (!popup.currentPopup && editingEventTypeId !== null) {
        const resp = await getTasks(1, editingEventTypeId);
        if (!resp.error) {
          setTasks(prev => ({ ...prev, [editingEventTypeId]: resp.data?.items || [] }));
        }
        setEditingEventTypeId(null);
      }
    };
    refreshTasks();
  }, [popup.currentPopup, editingEventTypeId]);

  const renderItem = ({ item }: { item: Task }) => {

    return (
      <View style={styles.item}>
        <TasksListByEventType
          eventTypeId={item.event_type_id !== null ? item.event_type_id : undefined}
        />
      </View>
    );
  };

  const renderSection = ({ item }: { item: EventType }) => {
    const isExpanded = expandedSections[item.id];
    return (
      <View style={styles.section}>
        <TouchableOpacity style={styles.header} onPress={() => toggleSection(item.id)}>
          <Text style={styles.headerText}>{`${item.emoji || ''} ${item.title}`}</Text>
          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} />
        </TouchableOpacity>
        {isExpanded && (
          <FlatList
            data={tasks[item.id] || []}
            keyExtractor={t => t.id.toString()}
            renderItem={renderItem}
          />
        )}
      </View>
    );
  };

  return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // подстрой под высоту таббара/хедера
      >
        <SafeAreaView style={styles.container}>
          <FlatList
            data={eventTypes}
            keyExtractor={et => et.id.toString()}
            renderItem={renderSection}
            contentContainerStyle={styles.list}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.6}
          />

            <SearchFilterBar
              title={t('tasks')}
              filterType={IFilterType.TASKS}
            />
        </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  list: { padding: 16, paddingBottom: 80 },
  section: {
    marginBottom: 12, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', padding:10,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  headerText: { fontSize: 18, fontWeight: '600' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12,  },
  circleButton: { marginRight: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#ccc' },
  itemContent: { flex: 1 },
  itemText: { flex: 1, fontSize: 16 },
});

const mapState = ({
  popup,
}: {
  popup: IPopupStore;
}) => ({
  popup,
});

const mapDispatch = {
  openEditPopup: (id: number) => ({
    type: 'SET_OBJECT_POPUP',
    payload: {
      id,
      type: 'task',
      popup: 'TaskForm',
    },
  }),
};

export default connect(mapState, mapDispatch)(TasksList);

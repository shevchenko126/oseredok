import React, { useCallback, useEffect, useState, useContext } from 'react';
import {
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
  ListRenderItem,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import IPopupStore from '../../../store/popup/initStore.interface';

import { Task } from '../../../dto/main/types.gen';
import { getTasks, ITasksFilters, updateTask } from '../../../api/main/tasks';
import { useTranslation, LanguageContext } from '../../../helpers/lang';
import { formatDate } from '../../../helpers/formatDate';
import { IFilterType } from '../../../store/popup/initStore.interface';

export interface TasksListProps {
  eventTypeId?: number;
  filterString?: string | null;
  openEditPopup?: (id: number) => void;
  onAddTask?: () => void;
  onFetchError?: (status?: number | null) => void;
  filterType: IFilterType | null;
  searchKeyword?: string | null;
  currentPopup?: string | null;
}

interface PaginationState {
  page: number;
  totalPages: number | null;
}

const TasksList: React.FC<TasksListProps> = ({
  eventTypeId,
  filterString,
  openEditPopup,
  onAddTask,
  onFetchError,
  filterType,
  searchKeyword,
  currentPopup
}) => {
  const t = useTranslation();
  const { language } = useContext(LanguageContext);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [{ page, totalPages }, setPagination] = useState<PaginationState>({
    page: 1,
    totalPages: null,
  });

  const fetchTasks = useCallback(
    async (
      targetPage: number,
      options: { append?: boolean; isRefresh?: boolean } = {}
    ) => {
      const { append = false, isRefresh = false } = options;

      if (append) {
        setIsLoadingMore(true);
      } else if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsInitialLoading(true);
      }


      const filters: ITasksFilters = {};
      if (filterString && filterString.startsWith("tasks")) {

        if (filterString === 'tasks_high_priority') {
          filters.order_by = 'priority';
          filters.order = 'desc';
        } else if (filterString === 'tasks_completed') {
          filters.is_completed = true;
        } else if (filterString === 'tasks_not_completed') {
          filters.is_completed = false;
        } else if (filterString === 'tasks_with_deadline') {
          filters.is_deadline = true;
        } else if (filterString === 'tasks_without_deadline') {
          filters.is_deadline = false;
        }
      }


      if( filterType === IFilterType.TASKS && searchKeyword ) {
        if (searchKeyword.trim().length > 0) {
          filters.search = searchKeyword.trim();
        }
      }

      try {
        const resp = await getTasks(targetPage, eventTypeId, filters);

        if (resp.error || !resp.data) {
          if (!append) {
            setTasks([]);
            setPagination({ page: 1, totalPages: null });
          }
          onFetchError?.(resp.status ?? null);
          return;
        }

        const pagination = resp.data;

        setPagination({
          page: pagination.page ?? targetPage,
          totalPages: pagination.total_pages ?? null,
        });

        const newItems = pagination.items ?? [];

        setTasks((prev) => {
          if (!append) {
            return newItems;
          }

          const existingIds = new Set(prev.map((item) => item.id));
          const merged = [...prev];

          newItems.forEach((item) => {
            if (!existingIds.has(item.id)) {
              merged.push(item);
            }
          });

          return merged;
        });
      } catch (error) {
        console.warn('Error fetching tasks:', error);
        if (!append) {
          setTasks([]);
          setPagination({ page: 1, totalPages: null });
        }
        onFetchError?.();
      } finally {
        if (append) {
          setIsLoadingMore(false);
        } else if (isRefresh) {
          setIsRefreshing(false);
        } else {
          setIsInitialLoading(false);
        }
      }
    },
    [eventTypeId, onFetchError, filterString, filterType, searchKeyword],
  );

  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks, currentPopup]);

  const handleLoadMore = useCallback(() => {
    if (isInitialLoading || isRefreshing || isLoadingMore) {
      return;
    }

    if (totalPages !== null && page >= totalPages) {
      return;
    }

    fetchTasks(page + 1, { append: true });
  }, [fetchTasks, isInitialLoading, isLoadingMore, isRefreshing, page, totalPages]);

  const handleRefresh = useCallback(() => {
    if (isInitialLoading || isLoadingMore) {
      return;
    }

    fetchTasks(1, { isRefresh: true });
  }, [fetchTasks, isInitialLoading, isLoadingMore]);

  const handleMarkCompleted = useCallback(
    async (task: Task, event: GestureResponderEvent) => {
      event.stopPropagation();

      if (task.is_completed) {
        return;
      }

      try {
        await updateTask(task.id, { is_completed: true });
        setTasks((prevTasks) =>
          prevTasks.map((item) =>
            item.id === task.id ? { ...item, is_completed: true } : item,
          ),
        );
      } catch (error) {
        console.warn('Failed to update task status', error);
      }
    },
    [],
  ); 

  const renderItem: ListRenderItem<Task> = useCallback(
    ({ item }) => {
      const formatted = formatDate(item.created_on, language);
      const [datePart, timePart = ''] = formatted.split(', ');

      return (
        <TouchableOpacity
          activeOpacity={openEditPopup ? 0.7 : 1}
          onPress={openEditPopup ? () => openEditPopup(item.id) : undefined}
        >
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TouchableOpacity
                style={styles.circleButton}
                activeOpacity={0.7}
                onPress={(event) => handleMarkCompleted(item, event)}
              >
                {item.is_completed ? (
                  <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
                ) : (
                  <View style={styles.circle} />
                )}
              </TouchableOpacity>
              <Text style={styles.cardTitle}>{item.title || t('tasksUntitled')}</Text>
            </View>
            {item.description ? (
              <Text style={styles.cardDesc}>{item.description}</Text>
            ) : null}
            <View style={styles.cardFooter}>
              <Text style={styles.cardDate}>{`${t('by')} ${datePart}  ${timePart}`}</Text>
              {typeof item.priority === 'number' ? (
                <View style={styles.rating}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Ionicons
                      key={i}
                      name={i < (item.priority || 0) ? 'star' : 'star-outline'}
                      size={16}
                      color={i === 0 ? '#bfd8ba' : 
                          i === 1 ? '#99b885' : 
                          i === 2 ? '#e2a336' : 
                          i === 3 ? '#e27938' : 
                          i === 4 ? '#d68d89' : '#f39c12'}
                      style={styles.star}
                    />
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [handleMarkCompleted, openEditPopup, t, language],
  );

  const EmptyState = useCallback(() => {
    if (isInitialLoading) {
      return <ActivityIndicator style={styles.emptyLoader} />;
    }

    if (onAddTask) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t('eventTypeEmptyStateTitle')}</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            activeOpacity={0.7}
            onPress={onAddTask}
          >
            <Text style={styles.emptyButtonText}>{t('eventTypeEmptyStateAdd')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return <Text style={styles.emptyPlaceholder}>{t('tasksEmptyState')}</Text>;
  }, [isInitialLoading, onAddTask, t]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.6}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={
          isLoadingMore ? <ActivityIndicator style={styles.footerLoader} /> : null
        }
        contentContainerStyle={tasks.length ? styles.list : styles.emptyList}
        ListEmptyComponent={EmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 80 },
  emptyList: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  circleButton: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ececec',
    backgroundColor: '#ececec'
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    marginLeft: 44,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: { 
    fontSize: 12, 
    color: '#999',
    marginLeft: 44, 
  },
  rating: { flexDirection: 'row' },
  star: { marginLeft: 4 },
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
    backgroundColor: '#3d3d3d',
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
    const { searchKeyword, filterType, filterString, currentPopup } = popup;
    return { searchKeyword, filterType, filterString, currentPopup };
};

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

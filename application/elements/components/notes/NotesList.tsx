import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { connect } from 'react-redux';
import IPopupStore from '../../store/popup/initStore.interface';

import { Note } from '../../dto/main/types.gen';
import NoteCard from './NotesListItem';
import { getNotes, INotesFilters } from '../../api/main/notes';
import { useTranslation } from '../../helpers/lang';
import SearchFilterBar from '../eventTypes/EventTypeListFooter';
import { IFilterType } from '../../store/popup/initStore.interface';

export interface NotesListProps {
  eventTypeId?: number;
  filterString?: string | null;
  openEditPopup?: (id:number) => void;
  onAddNote?: () => void;
  renderNote?: (note: Note) => React.ReactElement;
  onFetchError?: (status?: number | null) => void;
  filterType: IFilterType | null;
  searchKeyword?: string | null;
  currentPopup?: string | null;
}

interface PaginationState {
  page: number;
  totalPages: number | null;
}

const NotesList: React.FC<NotesListProps> = ({
  eventTypeId,
  filterString,
  openEditPopup,
  onAddNote,
  renderNote,
  onFetchError,
  filterType,
  searchKeyword,
  currentPopup
}) => {
  const t = useTranslation();

  const [notes, setNotes] = useState<Note[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [{ page, totalPages }, setPagination] = useState<PaginationState>({
    page: 1,
    totalPages: null,
  });

  const fetchNotes = useCallback(
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

      const filters: INotesFilters = {};
      if (filterString && filterString.startsWith("notes")) {
        if (filterString === 'notes_recently_edited') {
          filters.order_by = 'updated_on';
          filters.order = 'desc';
        } else if (filterString === 'notes_with_attachments') {
          filters.is_attachements = true;
        } else if (filterString === 'notes_without_title') {
          filters.title = '';
        }
      }

      if( filterType === IFilterType.NOTES && searchKeyword ) {
        if (searchKeyword.trim().length > 0) {
          filters.search = searchKeyword.trim();
        }
      }

      try {
        const resp = await getNotes(targetPage, eventTypeId, filters);

        if (resp.error || !resp.data) {
          if (!append) {
            setNotes([]);
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

        setNotes((prev) => {
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
        console.warn('Error fetching notes:', error);
        if (!append) {
          setNotes([]);
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
    [eventTypeId, onFetchError, filterString, filterType, searchKeyword]
  );

  useEffect(() => {
    fetchNotes(1);
  }, [fetchNotes, currentPopup]);

  const handleLoadMore = useCallback(() => {
    if (isInitialLoading || isRefreshing || isLoadingMore) {
      return;
    }

    if (totalPages !== null && page >= totalPages) {
      return;
    }

    fetchNotes(page + 1, { append: true });
  }, [fetchNotes, isInitialLoading, isLoadingMore, isRefreshing, page, totalPages]);

  const handleRefresh = useCallback(() => {
    if (isInitialLoading || isLoadingMore) {
      return;
    }

    fetchNotes(1, { isRefresh: true });
  }, [fetchNotes, isInitialLoading, isLoadingMore]);

  const renderItem: ListRenderItem<Note> = useCallback(
    ({ item }) => {
      if (renderNote) {
        return renderNote(item);
      }

      if (openEditPopup) {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => openEditPopup(item.id)}
          >
            <NoteCard item={item} />
          </TouchableOpacity>
        );
      }

      return <NoteCard item={item} />;
    },
    [openEditPopup, renderNote]
  );

  const EmptyState = useCallback(() => {
    if (isInitialLoading) {
      return <ActivityIndicator style={styles.emptyLoader} />;
    }

    if (onAddNote) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t('eventTypeEmptyStateTitle')}</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            activeOpacity={0.7}
            onPress={onAddNote}
          >
            <Text style={styles.emptyButtonText}>{t('eventTypeEmptyStateAdd')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return <Text style={styles.emptyPlaceholder}>{t('notesEmptyState')}</Text>;
  }, [isInitialLoading, onAddNote, t]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // подстрой под высоту таббара/хедера
    >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.6}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={
              isLoadingMore ? <ActivityIndicator style={styles.footerLoader} /> : null
            }
            contentContainerStyle={
              notes.length ? styles.list : styles.emptyList
            }
            ListEmptyComponent={EmptyState}
          />
          <SearchFilterBar
            title={t('notes')}
            filterType={IFilterType.NOTES}
            eventTypeId={eventTypeId}
          />
        </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
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

// export default NotesList;



const mapState = ({
    popup,
}: {
    popup: IPopupStore;
}) => {
    const { searchKeyword, filterType, currentPopup } = popup;
    return { searchKeyword, filterType, currentPopup };
};

const mapDispatch = {
  openEditPopup: (id: number) => ({
    type: 'SET_OBJECT_POPUP',
    payload: {
      id,
      type: 'note',
      popup: 'NoteForm',
    },
  }),
};

export default connect(mapState, mapDispatch)(NotesList);

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
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import IPopupStore from '../../../store/popup/initStore.interface';

import { Note } from '../../../dto/main/types.gen';
import DocumentCard from './DocumentsListItem';
import { getNotes, INotesFilters } from '../../../api/main/notes';
import { useTranslation } from '../../../helpers/lang';
import SearchFilterBar from '../eventTypes/EventTypeListFooter';
import { IFilterType } from '../../../store/popup/initStore.interface';

export interface DocumentsListProps {
  eventTypeId?: number;
  filterString?: string | null;
  openEditPopup?: (id: number) => void;
  onAddDocument?: () => void;
  renderDocument?: (doc: Note) => React.ReactElement;
  onFetchError?: (status?: number | null) => void;
  filterType: IFilterType | null;
  searchKeyword?: string | null;
  currentPopup?: string | null;
}

interface PaginationState {
  page: number;
  totalPages: number | null;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  eventTypeId,
  filterString,
  openEditPopup,
  onAddDocument,
  renderDocument,
  onFetchError,
  filterType,
  searchKeyword,
  currentPopup,
}) => {
  const t = useTranslation();

  const [documents, setDocuments] = useState<Note[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [{ page, totalPages }, setPagination] = useState<PaginationState>({
    page: 1,
    totalPages: null,
  });

  const fetchDocuments = useCallback(
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
      if (filterString && filterString.startsWith('documents')) {
        if (filterString === 'documents_recently_edited') {
          filters.order_by = 'updated_on';
          filters.order = 'desc';
        } else if (filterString === 'documents_with_attachments') {
          filters.is_attachements = true;
        }
      }

      if (filterType === IFilterType.NOTES && searchKeyword) {
        if (searchKeyword.trim().length > 0) {
          filters.search = searchKeyword.trim();
        }
      }

      try {
        const resp = await getNotes(targetPage, eventTypeId, filters);

        if (resp.error || !resp.data) {
          if (!append) {
            setDocuments([]);
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

        setDocuments((prev) => {
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
        console.warn('Error fetching documents:', error);
        if (!append) {
          setDocuments([]);
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
    fetchDocuments(1);
  }, [fetchDocuments, currentPopup]);

  const handleLoadMore = useCallback(() => {
    if (isInitialLoading || isRefreshing || isLoadingMore) {
      return;
    }

    if (totalPages !== null && page >= totalPages) {
      return;
    }

    fetchDocuments(page + 1, { append: true });
  }, [fetchDocuments, isInitialLoading, isLoadingMore, isRefreshing, page, totalPages]);

  const handleRefresh = useCallback(() => {
    if (isInitialLoading || isLoadingMore) {
      return;
    }

    fetchDocuments(1, { isRefresh: true });
  }, [fetchDocuments, isInitialLoading, isLoadingMore]);

  const renderItem: ListRenderItem<Note> = useCallback(
    ({ item }) => {
      if (renderDocument) {
        return renderDocument(item);
      }

      if (openEditPopup) {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => openEditPopup(item.id)}
          >
            <DocumentCard item={item} />
          </TouchableOpacity>
        );
      }

      return <DocumentCard item={item} />;
    },
    [openEditPopup, renderDocument]
  );

  const EmptyState = useCallback(() => {
    if (isInitialLoading) {
      return <ActivityIndicator style={styles.emptyLoader} />;
    }

    if (onAddDocument) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t('eventTypeEmptyStateTitle')}</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            activeOpacity={0.7}
            onPress={onAddDocument}
          >
            <Text style={styles.emptyButtonText}>{t('eventTypeEmptyStateAdd')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return <Text style={styles.emptyPlaceholder}>{t('notesEmptyState')}</Text>;
  }, [isInitialLoading, onAddDocument, t]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.6}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator style={styles.footerLoader} /> : null
          }
          contentContainerStyle={documents.length ? styles.list : styles.emptyList}
          ListEmptyComponent={EmptyState}
        />
        <SearchFilterBar
          title={t('documents')}
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
  emptyContainer: { alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12, textAlign: 'center' },
  emptyButton: { backgroundColor: '#3d3d3d', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24 },
  emptyButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  emptyPlaceholder: { textAlign: 'center', color: '#666', fontSize: 14 },
  footerLoader: { marginVertical: 16 },
  emptyLoader: { marginTop: 32 },
});

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

export default connect(mapState, mapDispatch)(DocumentsList);

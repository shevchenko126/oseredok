import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getNotifications, NotificationDto, NotificationsResponse } from '../../api/main/notifications';
import { AuthContext } from '../../helpers/auth';
import { LanguageContext, useTranslation } from '../../helpers/lang';
import { formatDate } from '../../helpers/formatDate';

interface NotificationListItem extends NotificationDto {
  id?: number | string;
}

type NotificationCollection = NotificationsResponse | NotificationDto[] | null;

type ExtractResult = {
  items: NotificationListItem[];
  nextPage: number | null;
};

const extractNotifications = (data: NotificationCollection): ExtractResult => {
  if (!data) {
    return { items: [], nextPage: null };
  }

  if (Array.isArray(data)) {
    return { items: data, nextPage: null };
  }

  const candidateList =
    data.items || data.results || data.notifications || data.data || [];

  const nextFromLink = typeof data.next === 'string' ? data.next : null;
  let nextPage: number | null = null;

  if (nextFromLink) {
    const match = nextFromLink.match(/page=(\d+)/);
    if (match) {
      nextPage = Number(match[1]);
    }
  }

  if (nextPage === null) {
    if (typeof data.page === 'number' && (typeof data.total_pages === 'number' || typeof data.totalPages === 'number')) {
      const total = typeof data.total_pages === 'number' ? data.total_pages : (data.totalPages as number);
      if (data.page < total) {
        nextPage = data.page + 1;
      }
    } else if (data.pagination) {
      const pagination = data.pagination;
      if (typeof pagination.next_page === 'number') {
        nextPage = pagination.next_page;
      } else if (typeof pagination.next === 'number') {
        nextPage = pagination.next;
      }
    }
  }

  return { items: candidateList, nextPage };
};

const resolveTitle = (item: NotificationListItem, fallback: string) =>
  item.title || (item as any).subject || fallback;

const resolveBody = (item: NotificationListItem) =>
  item.description || item.message || item.body || (item as any).text || '';

const resolveDate = (item: NotificationListItem) =>
  item.created_on || item.created_at || item.sent_at || (item as any).updated_at || null;

const isRead = (item: NotificationListItem) =>
  typeof item.is_read === 'boolean' ? item.is_read : Boolean(item.read);

const NotificationsScreen: React.FC = () => {
  const auth = useContext(AuthContext);
  const t = useTranslation();

  const [notifications, setNotifications] = useState<NotificationListItem[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadNotifications = useCallback(
    async (pageToLoad = 1, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else if (!isRefreshing) {
        setIsLoading(true);
      }

      try {
        const response = await getNotifications(pageToLoad);

        if (response.error) {
          auth?.logout();
          return;
        }

        const { items, nextPage: resolvedNextPage } = extractNotifications(response.data);

        setNotifications((prev) => (append ? [...prev, ...items] : items));
        setNextPage(resolvedNextPage);
        setErrorMessage(null);
      } catch (error) {
        console.error('Failed to load notifications', error);
        setErrorMessage(t('notificationsLoadError'));
        if (!append) {
          setNotifications([]);
          setNextPage(null);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [auth, isRefreshing, t],
  );

  useFocusEffect(
    useCallback(() => {
      setIsRefreshing(false);
      loadNotifications(1, false);
    }, [loadNotifications]),
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadNotifications(1, false);
  }, [loadNotifications]);

  const onEndReached = useCallback(() => {
    if (!nextPage || isLoadingMore || isLoading) {
      return;
    }

    loadNotifications(nextPage, true);
  }, [isLoading, isLoadingMore, loadNotifications, nextPage]);

  const { language } = useContext(LanguageContext);

  const renderItem = useCallback(
    ({ item }: { item: NotificationListItem }) => {
      const title = resolveTitle(item, t('notifications'));
      const body = resolveBody(item);
      const dateValue = resolveDate(item);
      const read = isRead(item);


      return (
        <View style={[styles.card, read ? styles.cardRead : null]}>
          <Text style={styles.title}>{title}</Text>
          {body ? <Text style={styles.body}>{body}</Text> : null}
          {dateValue ? (
            <Text style={styles.date}>{formatDate(dateValue, language)}</Text>
          ) : null}
        </View>
      );
    },
    [t, language],
  );

  const keyExtractor = useCallback((item: NotificationListItem, index: number) => {
    const identifier = item.id ?? resolveDate(item) ?? index;
    return String(identifier);
  }, []);

  const listEmptyComponent = useMemo(() => {
    if (isLoading || isRefreshing) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{errorMessage || t('notificationsEmpty')}</Text>
      </View>
    );
  }, [errorMessage, isLoading, isRefreshing, t]);

  return (
    <SafeAreaView style={styles.container}>
      {errorMessage && notifications.length > 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {isLoading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A6CF7" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
          contentContainerStyle={notifications.length ? styles.listContent : styles.listEmptyContent}
          ListEmptyComponent={listEmptyComponent}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color="#4A6CF7" />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardRead: {
    opacity: 0.7,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B1B1D',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#4E4E50',
    marginBottom: 12,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: '#8A8A8E',
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoading: {
    paddingVertical: 12,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8A8A8E',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFE8E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
});

export default NotificationsScreen;

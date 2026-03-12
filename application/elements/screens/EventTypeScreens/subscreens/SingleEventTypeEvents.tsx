import React, { FC, useState, useCallback, useContext, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  SectionList,
  StyleSheet,
  ListRenderItemInfo,
  ActivityIndicator,
} from 'react-native';
import { formatDuration } from '../../../helpers/formatDuration';
import { formatDateShort } from '../../../helpers/formatDate';
import { AuthContext } from '../../../helpers/auth';
import { Event, EventType, GroupOut } from '../../../dto/main/types.gen';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getEventsByEventType, getSingleEventType } from '../../../api/main/eventTypes';
import RedClockIcon from '../../../components/icons/redClock';
import SearchFilterBar from '../../../components/eventTypes/EventTypeListFooter';
import { LanguageContext, useTranslation } from '../../../helpers/lang';

interface EventsScreenProps {
  eventTypeId: number;
}


const EventsScreen: FC<EventsScreenProps> = ({ eventTypeId }) => {

  const [eventType, setEventType] = useState<EventType | null>(null);
  const [groups, setGroups] = useState<GroupOut[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const auth = useContext(AuthContext);
  const navigation = useNavigation();
  const t = useTranslation();

  const fetchEventTypeDetails = useCallback(async () => {
    try {
      const respEventType = await getSingleEventType(eventTypeId);
      if (respEventType.error) {
        auth?.logout();
        return;
      }
      if (respEventType.data) {
        setEventType(respEventType.data);
      }
    } catch (error) {
      console.warn('Error fetching event type details:', error);
    }
  }, [auth, eventTypeId]);

  const fetchEvents = useCallback(
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
        setIsLoading(true);
      }

      try {
        const resp = await getEventsByEventType(eventTypeId, targetPage);

        if (resp.error) {
          auth?.logout();
          return;
        }

        const pagination = resp.data;

        if (!pagination) {
          if (!append) {
            setGroups([]);
          }
          return;
        }

        setPage(pagination.page);
        setTotalPages(pagination.total_pages);

        const newGroups = pagination.items || [];

        setGroups((prev) => {
          if (!append) {
            return newGroups;
          }

          const merged = [...prev];

          newGroups.forEach((group) => {
            const index = merged.findIndex((existing) => existing.date === group.date);

            if (index > -1) {
              const existingEvents = merged[index].data;
              const existingIds = new Set(existingEvents.map((event) => event.id));
              const updatedEvents = [...existingEvents];

              group.data.forEach((event) => {
                if (!existingIds.has(event.id)) {
                  updatedEvents.push(event);
                }
              });

              merged[index] = { ...merged[index], data: updatedEvents };
            } else {
              merged.push(group);
            }
          });

          return merged;
        });
      } catch (error) {
        console.warn('Error fetching events for event type:', error);
      } finally {
        if (append) {
          setIsLoadingMore(false);
        } else if (isRefresh) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [auth, eventTypeId]
  );

  useFocusEffect(
    useCallback(() => {
      fetchEventTypeDetails();
      fetchEvents(1);
    }, [fetchEventTypeDetails, fetchEvents])
  );

  const handleLoadMore = useCallback(() => {
    if (isLoading || isRefreshing || isLoadingMore) {
      return;
    }

    if (totalPages !== null && page >= totalPages) {
      return;
    }

    fetchEvents(page + 1, { append: true });
  }, [fetchEvents, isLoading, isLoadingMore, isRefreshing, page, totalPages]);

  const handleRefresh = useCallback(() => {
    if (isLoading || isLoadingMore) {
      return;
    }

    fetchEvents(1, { isRefresh: true });
  }, [fetchEvents, isLoading, isLoadingMore]);

  useLayoutEffect(() => {
    if (eventType?.title) {
      navigation.setOptions({ title: `${eventType.emoji} ${eventType.title}` });
    }
  }, [eventType, navigation]);

  const renderEvent = ({ item, index }: ListRenderItemInfo<Event>) => {
    
    const isLast = index === groups.length - 1;
    return (
      <View style={[styles.eventCard, isLast && styles.eventCardLast]}>
        <View style={styles.eventRow}>
          <Text style={styles.titleText}>{item.title}</Text>
          {item.duration ? (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
            </View>
          ) : null}
        </View>
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
      </View>
    );
  }

  const { language } = useContext(LanguageContext);


  const renderSectionHeader = ({ section }: { section: GroupOut }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.dot} />
      <Text style={styles.sectionTitle}>{formatDateShort(section.date, language)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        {eventType && eventType?.duration ? (
          <View style={styles.totalHeader}>
            <RedClockIcon />
            <Text style={styles.totalLabel}> {t('totalTime')}</Text>
            <Text style={styles.totalValue}> {formatDuration(eventType?.duration)}</Text>
          </View>
        ) : null}

        <View style={styles.list}>
          <SectionList
            sections={groups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEvent}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.listContent}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.6}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={
              isLoadingMore ? (
                <ActivityIndicator style={styles.footerLoader} />
              ) : null
            }
            ListEmptyComponent={
              isLoading ? <ActivityIndicator style={styles.emptyLoader} /> : null
            }
          />
        </View>
      <SearchFilterBar
        title={""}
        eventTypeId={eventTypeId}
      />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper : { flex: 1, backgroundColor: '#f8f8f8' },
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  topBarTitle: { flexDirection: 'row', alignItems: 'center' },
  topTitle: { fontSize: 16, fontWeight: '500', marginLeft: 4 },
  topBarSpacer: { width: 24 },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEAEA',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 16,
  },
  totalLabel: { fontSize: 16, color: '#333', fontWeight: '500' },
  totalValue: { fontSize: 16, color: '#D84242', fontWeight: '600' },
  listContent: { paddingHorizontal: 16, paddingBottom: 140 },
  list: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 16,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D84242', marginRight: 8 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    
  },
  eventCard: {
    // marginVertical: 8,
    paddingLeft:12,
    borderLeftWidth:1,
    borderLeftColor:'#ededed',
    marginLeft:3,
    marginTop:-12,
    paddingTop:10,
    paddingBottom:30,
  },
  eventCardLast: {
    marginBottom: 30,
    borderLeftWidth:0,
    paddingLeft:0,
    marginLeft:0,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  codeText: {
    fontSize: 12,
    color: '#333',
  },
  titleText: {
    fontSize: 14,
    color: '#1E90FF',
    marginLeft: 4,
    textDecorationLine: 'underline',
  },
  durationBadge: {
    marginLeft: 'auto',
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: { fontSize: 12, color: '#333' },
  description: { fontSize: 12, color: '#555', marginTop: 4 },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    // backgroundColor: '#fff',
  },
  navItem: { flex: 1, alignItems: 'center' },
  navItemCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  footerLoader: { marginVertical: 16 },
  emptyLoader: { marginTop: 32 },
});

export default EventsScreen;

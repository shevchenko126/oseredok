import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, 
  TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { EventTypeStackParams } from '../../screens/EventTypeScreens';
import { EventType } from '../../dto/main/types.gen';
import { continueEvent, createEvent, pauseEvent, stopEvent } from '../../api/main/events';
import { getSingleEventType } from '../../api/main/eventTypes';
import Timer from './Timer';
import { LanguageContext, useTranslation,  } from '../../helpers/lang';
import { formatDate } from '../../helpers/formatDate';

type ListItemProps = {
  item: EventType;
  onEventTypeUpdate?: (updatedEventType: EventType) => void;
};

const ListItem: React.FC<ListItemProps> = ({ item, onEventTypeUpdate }) => {
  const navigation = useNavigation<NativeStackNavigationProp<EventTypeStackParams>>();
  const t = useTranslation();
  const { language } = useContext(LanguageContext);
  const [eventType, setEventType] = useState<EventType>(item);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpenDescription, setIsOpenDescription] = useState(false);


  useEffect(() => {
    setEventType(item);
  }, [item]);

  const refreshEventType = useCallback(async () => {
    try {
      const response = await getSingleEventType(item.id);
      if (!response.error && response.data) {
        setEventType(response.data);
        onEventTypeUpdate?.(response.data);
      }
    } catch (error) {
      console.warn('Failed to refresh event type', error);
    }
  }, [item.id, onEventTypeUpdate]);

  const executeAndRefresh = useCallback(
    async (callback: () => Promise<unknown>) => {
      setIsUpdating(true);
      try {
        await callback();
        await refreshEventType();
      } catch (error) {
        console.warn('Failed to update event type', error);
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshEventType]
  );

  const handlePress = () => {
    navigation.navigate('EventTypesSingle', { eventTypeId: item.id });
  };

  const handlePlayPress = async () => {
    if (isUpdating) return;
    await executeAndRefresh(() => createEvent({ event_type_id: item.id }));
  };

  const handlePausePress = async () => {
    if (isUpdating) return;
    const currentEventId = eventType.current_event_id;
    if (!currentEventId) return;
    await executeAndRefresh(() => pauseEvent(currentEventId, eventType.current_event_description || ''));
  };

  const handleContinuePress = async () => {
    if (isUpdating) return;
    const currentEventId = eventType.current_event_id;
    if (!currentEventId) return;
    await executeAndRefresh(() => continueEvent(currentEventId, eventType.current_event_description || ''));
  };

  const handleFinishPress = async () => {
    if (isUpdating) return;
    const currentEventId = eventType.current_event_id;
    if (!currentEventId) return;
    await executeAndRefresh(() => stopEvent(currentEventId, eventType.current_event_description || ''));
  };

  const handleOpenDescription = () => {
    setIsOpenDescription(!isOpenDescription);
  };

  console.log('Rendering EventTypesListItem for eventType:', eventType);

  return (
    <View>
    <TouchableOpacity onPress={handlePress} style={styles.card} activeOpacity={0.9}>
      <View style={styles.row}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{eventType.emoji}</Text>
          <Text style={styles.title}>{eventType.title}</Text>
          {eventType.events_number ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{eventType.events_number}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actionsRow}>
          {eventType.current_record_id ? (
            <TouchableOpacity onPress={handlePausePress} disabled={isUpdating} hitSlop={8}>
              <Ionicons name="pause-circle-outline" size={32} />
            </TouchableOpacity>
          ) : eventType.current_event_id ? (
            <View style={styles.inlineBtns}>
              <Pressable
                onPress={handleContinuePress}
                disabled={isUpdating}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.btnBase,
                  styles.btnContinue,
                  pressed && styles.btnPressed,
                  isUpdating && styles.btnDisabled,
                ]}
              >
                <Text style={[styles.btnText, styles.btnTextContinue]}>{t('continueAction')}</Text>
              </Pressable>

              <Pressable
                onPress={handleFinishPress}
                disabled={isUpdating}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.btnBase,
                  styles.btnFinish,
                  pressed && styles.btnPressedDark,
                  isUpdating && styles.btnDisabledDark,
                ]}
              >
                <Text style={[styles.btnText, styles.btnTextFinish]}>{t('finish')}</Text>
              </Pressable>
            </View>
          ) : (
            <TouchableOpacity onPress={handlePlayPress} disabled={isUpdating} hitSlop={8}>
              <Ionicons name="play-circle-outline" size={32} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.rowBottom}>
        {eventType.current_event_id  ? (
          <Text style={styles.date}>
            <Timer
              startDuration={eventType.current_event_duration || 0}
              startDate={eventType.current_record_date_from ? eventType.current_record_date_from : undefined}
              isRunning={eventType.current_record_id !== null}
            />
          </Text>
        ) : eventType.created_on ? (
          <Text style={styles.date}>{formatDate(eventType.created_on, language)}</Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>


      {eventType.current_event_id ? (
        <TouchableOpacity onPress={handleOpenDescription} disabled={isUpdating} hitSlop={8} style={styles.rowBottomArrow}>
          <View>
            <Ionicons name="chevron-down-outline" size={24} />
          </View>
        </TouchableOpacity>
      ) : ""}
    </TouchableOpacity>

    {eventType.current_event_id ? (
        <View style={[styles.descriptionInput, isOpenDescription && styles.openDescription]}>
          <TextInput
            style={styles.input}
            value={eventType.current_event_description || ''}
            onChangeText={(text) => setEventType({ ...eventType, current_event_description: text })}
            placeholder={t('writeNotePlaceholder')}
          />
        </View>
    ) : ""}

    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 20, marginRight: 8 },
  title: { fontSize: 16, fontWeight: '500' },
  badge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: { fontSize: 12 },

  actionsRow: { flexDirection: 'row', alignItems: 'center' },

  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  rowBottomArrow: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  descriptionInput: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'rgba(243, 243, 243, 1)',
    padding: 15,
    marginTop: -30,
    marginBottom: 15,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    display: 'none',
  },
  openDescription: {
    display: 'flex',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  
  date: { fontSize: 12, color: '#888' },

  // Inline buttons container
  inlineBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // если нет поддержки gap — добавьте marginRight: 8 у первой кнопки
  },

  // Button base
  btnBase: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // Continue (light)
  btnContinue: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },

  // Finish (dark)
  btnFinish: {
    backgroundColor: '#1F2A37',
  },

  // Text
  btnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  btnTextContinue: {
    color: '#111827',
  },
  btnTextFinish: {
    color: '#FFFFFF',
  },

  // States
  btnPressed: { opacity: 0.8 },
  btnPressedDark: { opacity: 0.85 },
  btnDisabled: { opacity: 0.6 },
  btnDisabledDark: { opacity: 0.6 },
});
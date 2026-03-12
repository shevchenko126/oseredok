// DeleteEventTypeModal.tsx
import React, { useEffect } from 'react';
// import { useRoute, RouteProp } from '@react-navigation/native';
// import type { RootStackParamList } from '../../../navigation/types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  useTranslation,
} from '../../../helpers/lang';
import { DashboardBase, EventType } from '../../../dto/main';
import { getDashboardEventType } from '../../../api/main/dashboard';
import { useNavigation } from '@react-navigation/native';
import { connect } from "react-redux";
import IPopupStore from "../../../store/popup/initStore.interface";
import { getSingleEventType } from '../../../api/main/eventTypes';
import ClockIcon from '../../../components/icons/clock';
import CheckSquareIcon from '../../../components/icons/checkSquare';
import BookOpenIcon from '../../../components/icons/bookOpen';
import TrashIcon from '../../../components/icons/trash';

type IProps = {
  openPopup: (popup:string, objectId:number | null, objectType:string | null) => void;
  eventTypeId: number | null;
  
};

const DeleteEventType = ({
  openPopup,
  eventTypeId
}: IProps) => {

  const t = useTranslation();
  const [eventType, setEventType] = React.useState<EventType>({} as EventType);
  const [dashboardData, setDashboardData] = React.useState<DashboardBase>({})

  // const route = useRoute<RouteProp<RootStackParamList, 'EventTypesSingle'>>();
  // const { eventTypeId } = route.params as { eventTypeId: number };

  const navigation = useNavigation();
  const onClose = () => {
    navigation.goBack();
    navigation.setOptions({ headerShown: true });
  }
  const onDelete = () => {
    // Логика удаления всех связанных элементов
    openPopup('DeleteConfirmation', eventTypeId, 'eventType');
  }

  const onMove = () => {
    openPopup('DeleteConfirmation', eventTypeId, 'eventTypeMove');
  }


  useEffect(() => {
    if(eventTypeId) {
      getDashboardEventType(eventTypeId).then(({data, error}) => {
        if(!error && data) {
          setDashboardData(data);
        }
      });
      getSingleEventType(eventTypeId).then(({data, error}) => {
        if(!error && data) {
          setEventType(data);
        }
      });
    }
  }, [eventTypeId]);

  return (
        <SafeAreaView>
          <View style={styles.card}>
            {/* Header */}
            <Text style={styles.title}>
              {`${t('deleteEventTypeIntroPrefix')} `}
              <Text style={styles.emoji}>{eventType.emoji}</Text>
              {` ${eventType.title} ${t('deleteEventTypeIntroSuffix')}`}
            </Text>

              <Text style={styles.subtitle}>
                {t('deleteEventTypeLinkedItems')}
              </Text>

            {/* Counters */}
            {dashboardData ? (
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <View style={styles.statIconNumber}>
                    <ClockIcon />
                    <Text style={styles.statNumber}>{dashboardData.events_count}</Text>
                  </View>
                  <Text style={styles.statLabel}>{t('events')}</Text>
                </View>
                <View style={styles.stat}>
                  <View style={styles.statIconNumber}>
                    <CheckSquareIcon />
                    <Text style={styles.statNumber}>{dashboardData.tasks_count}</Text>
                  </View>
                  <Text style={styles.statLabel}>{t('tasks')}</Text>
                </View>
                <View style={styles.stat}>
                  <View style={styles.statIconNumber}>
                    <BookOpenIcon />
                    <Text style={styles.statNumber}>{dashboardData.notes_count}</Text>
                  </View>
                  <Text style={styles.statLabel}>{t('notes')}</Text>
                </View>
              </View>
            ) : null}


            {/* Primary action */}
            {dashboardData.events_count || dashboardData.tasks_count || dashboardData.notes_count ? (
              <>
                <TouchableOpacity
                  onPress={onMove}
                  activeOpacity={0.8}
                  style={styles.primaryBtn}
                  accessibilityRole="button"
                  accessibilityLabel={t('moveToAnotherEventType')}
                >
                  <Text style={styles.primaryBtnText}>{t('moveToAnotherEventType')}</Text>
                </TouchableOpacity>

                {/* Helper text */}
                <Text style={styles.helper}>
                  {t('deleteEventTypeHelperIntro')}{'\n'}
                  {t('deleteEventTypeHelperMiddle')} {' '}
                  <Text style={styles.emoji}>{eventType.emoji}</Text> {eventType.title} {' '}
                  {t('deleteEventTypeHelperSuffix')}
                </Text>
              </>
            ) : null}

            {/* Destructive */}
            <TouchableOpacity
              onPress={onDelete}
              activeOpacity={0.8}
              style={styles.dangerBtn}
              accessibilityRole="button"
              accessibilityLabel={t('deleteAll')}
            >
              <Text style={styles.dangerIcon}><TrashIcon /></Text>
              <Text style={styles.dangerText}>{t('deleteAll')}</Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              style={styles.cancelBtn}
              accessibilityRole="button"
              accessibilityLabel={t('cancel')}
            >
              <Text style={styles.cancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    height: '80%',
  },
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    // alignItems: 'center',
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a', // slate-900
    lineHeight: 26,
    marginBottom: 10,
    textAlign: 'center',
  },
  emoji: { fontSize: 18 },
  subtitle: {
    fontSize: 14,
    color: '#475569', // slate-600
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  countersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 6,
  },
  counter: { alignItems: 'center', minWidth: 72 },
  counterIcon: { fontSize: 20, marginBottom: 2 },
  counterValue: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  counterLabel: { fontSize: 12, color: '#64748b', marginTop: 2 },
  primaryBtn: {
    backgroundColor: '#1f3440', // тёмно-синий как на макете
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  helper: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  dangerBtn: {
    borderWidth: 1.5,
    borderColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dangerIcon: { fontSize: 16, marginRight: 6 },
  dangerText: { color: '#ef4444', fontWeight: '700', fontSize: 16 },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 24,
  },
  statIconNumber: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 6,
    paddingTop: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
});

const mapState = ({
    popup,
}: {
    popup: IPopupStore;
}) => {
    const { currentPopup } = popup;
    return { currentPopup };
};

const mapDispatch = {
    openPopup: (popup:string, id:number | null, type:string | null) => ({
        type: "SET_OBJECT_POPUP",
        payload: {
            popup,
            id,
            type,
        }
    })
};



const connector = connect(mapState, mapDispatch);

const DeleteEventTypeRedux = connector(DeleteEventType);

export default DeleteEventTypeRedux;
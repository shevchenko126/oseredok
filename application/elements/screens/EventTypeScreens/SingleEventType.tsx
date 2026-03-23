import React, { FC, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import BottomTabMenu, { Tab } from '../../components/BottomTabMenu';
import SingleEventTypeEvents from './subscreens/SingleEventTypeEvents';
import SingleEventTypeTasks from './subscreens/SingleEventTypeTasks';
import SingleEventTypeNotes from './subscreens/SingleEventTypeNotes';
import SingleEventTypeEdit from './subscreens/SingleEventTypeEdit';
import type { RootStackParamList } from '../../../navigation/types';
import DeleteEventType from './subscreens/DeleteEventType';

const SingleEventScreen: FC = () => {

    const [activeTab, setActiveTab] = useState<Tab>('Events');
    const route = useRoute<RouteProp<RootStackParamList, 'EventTypesSingle'>>();
    const { eventTypeId } = route.params as { eventTypeId: number };

    return (

            
        <SafeAreaView style={styles.bg}>
          <View style={styles.container}>
            {
                activeTab === 'Events' ? <SingleEventTypeEvents eventTypeId={eventTypeId} /> :
                activeTab === 'Tasks' ? <SingleEventTypeTasks eventTypeId={eventTypeId} /> :
                activeTab === 'Notes' ? <SingleEventTypeNotes eventTypeId={eventTypeId} /> :
                activeTab === 'Delete' ? <DeleteEventType eventTypeId={eventTypeId} /> :
                activeTab === 'Edit' ? <SingleEventTypeEdit onDelete={() => { setActiveTab('Delete') }} /> :
                null
            }
          </View>
          {activeTab !== 'Delete' && ( 
            <View style={styles.menuContainer}>
              <BottomTabMenu
                  selected={activeTab}
                  onChange={(tab) => setActiveTab(tab)}
              />
            </View>
          )}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1, backgroundColor: '#f8f8f8',
    padding:12
  },
  container: {flex: 1, backgroundColor: '#fff', margin:12, borderRadius:16, overflow:'hidden',},
  menuContainer: {
    position: 'relative',
    bottom: 100,
    // marginHorizontal:12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  totalLabel: { fontSize: 14, color: '#333', fontWeight: '500' },
  totalValue: { fontSize: 14, color: '#D84242', fontWeight: '600' },
  listContent: { paddingHorizontal: 16, paddingBottom: 140 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D84242', marginRight: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '500', color: '#333' },
  eventCard: { marginVertical: 8 },
  eventRow: { flexDirection: 'row', alignItems: 'center' },
  codeText: { fontSize: 12, color: '#333' },
  nameText: { fontSize: 14, color: '#1E90FF', marginLeft: 4, textDecorationLine: 'underline' },
  durationBadge: {
    marginLeft: 'auto',
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: { fontSize: 12, color: '#333' },
  description: { fontSize: 12, color: '#555', marginLeft: 24, marginTop: 4 },
  
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
    backgroundColor: '#fff',
  },
  navItem: { flex: 1, alignItems: 'center' },
  navItemCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
});

export default SingleEventScreen;
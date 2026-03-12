import React, { useCallback, useContext } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  View,
  StyleSheet,
} from 'react-native';
import TasksList from '../../../components/tasks/TasksList';
import { AuthContext } from '../../../helpers/auth';
import IPopupStore from '../../../store/popup/initStore.interface';
import SearchFilterBar from '../../../components/eventTypes/EventTypeListFooter';
import { IFilterType } from '../../../store/popup/initStore.interface';

const mapState = ({
  popup,
}: {
  popup: IPopupStore;
}) => ({
  filterString: popup.filterString,
});

const mapDispatch = {
  openTaskFormPopup: (eventTypeId: number) => ({
    type: 'SET_OPEN_POPUP_WITH_EVENT_TYPE_ID',
    payload: { popup: 'TaskForm', eventTypeId },
  }),
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface OwnProps {
  eventTypeId: number;
}

type Props = OwnProps & PropsFromRedux;

const SingleEventTypeTasks: React.FC<Props> = ({
  eventTypeId,
  openTaskFormPopup
}) => {
  const auth = useContext(AuthContext);

  const handleFetchError = useCallback(() => {
    auth?.logout();
  }, [auth]);

  return (
    <View style={styles.container}>
      <TasksList
        eventTypeId={eventTypeId}
        onAddTask={async () => {
          openTaskFormPopup(eventTypeId);
        }}
        onFetchError={handleFetchError}
      />

      <SearchFilterBar
        filterType={IFilterType.TASKS}
        eventTypeId={eventTypeId}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' }
});



export default connector(SingleEventTypeTasks);

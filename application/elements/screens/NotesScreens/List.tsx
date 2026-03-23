import React, { useCallback, useContext } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import NotesList from '../../components/notes/NotesList';
import { Note } from '../../../dto/main/types.gen';
import { AuthContext } from '../../../helpers/auth';
import IPopupStore from '../../../store/popup/initStore.interface';
import NoteCard from '../../components/notes/NotesListItem';

const mapState = ({
  popup,
}: {
  popup: IPopupStore;
}) => ({
  filterString: popup.filterString,
});

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

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux;

const NotesListScreen: React.FC<Props> = ({ filterString, openEditPopup }) => {
  const auth = useContext(AuthContext);

  const handleFetchError = useCallback(() => {
    auth?.logout();
  }, [auth]);

  const renderNote = useCallback(
    (item: Note) => (
      <TouchableOpacity
        style={styles.touchable}
        activeOpacity={0.8}
        onPress={() => openEditPopup(item.id)}
      >
        <NoteCard item={item} />
      </TouchableOpacity>
    ),
    [openEditPopup]
  );

  return (
    <NotesList
      filterString={filterString}
      renderNote={renderNote}
      onFetchError={handleFetchError}
    />
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});

export default connector(NotesListScreen);


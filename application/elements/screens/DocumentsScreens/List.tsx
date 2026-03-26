import React, { useCallback, useContext } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { StyleSheet, TouchableOpacity } from 'react-native';

import DocumentsList from '../../components/documents/DocumentsList';
import { Note } from '../../../dto/main/types.gen';
import { AuthContext } from '../../../helpers/auth';
import IPopupStore from '../../../store/popup/initStore.interface';
import DocumentCard from '../../components/documents/DocumentsListItem';

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

const DocumentsListScreen: React.FC<Props> = ({ filterString, openEditPopup }) => {
  const auth = useContext(AuthContext);

  const handleFetchError = useCallback(() => {
    auth?.logout();
  }, [auth]);

  const renderDocument = useCallback(
    (item: Note) => (
      <TouchableOpacity
        style={styles.touchable}
        activeOpacity={0.8}
        onPress={() => openEditPopup(item.id)}
      >
        <DocumentCard item={item} />
      </TouchableOpacity>
    ),
    [openEditPopup]
  );

  return (
    <DocumentsList
      filterString={filterString}
      renderDocument={renderDocument}
      onFetchError={handleFetchError}
    />
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
});

export default connector(DocumentsListScreen);

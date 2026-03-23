import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import NotesList from '../../../components/notes/NotesList';
import IPopupStore from '../../../../store/popup/initStore.interface';

const mapState = ({
  popup,
}: {
  popup: IPopupStore;
}) => ({
  filterString: popup.filterString,
});

const mapDispatch = {
  openNoteFormPopup: (eventTypeId: number) => ({
    type: 'SET_OPEN_POPUP_WITH_EVENT_TYPE_ID',
    payload: { popup: 'NoteForm', eventTypeId },
  }),
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface OwnProps {
  eventTypeId: number;
}

type Props = OwnProps & PropsFromRedux;

const SingleEventTypeNotes: React.FC<Props> = ({
  eventTypeId,
  openNoteFormPopup,
  filterString,
}) => {
  return (
    <NotesList
      eventTypeId={eventTypeId}
      filterString={filterString}
      onAddNote={() => openNoteFormPopup(eventTypeId)}
    />
  );
};

export default connector(SingleEventTypeNotes);


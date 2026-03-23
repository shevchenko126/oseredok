import { connect } from "react-redux";
import IPopupStore from "../../store/popup/initStore.interface";
import AddNewModal from "./AddMenu";
import EventTypeForm from "./EventTypeForm"
import EventForm from "./EventForm"
import TaskForm from "./TaskForm"
import NoteForm from "./NoteForm"
import FilterPopup from "./FilterForm";
import LanguagePopup from "./LanguageSettings";
import NotificationPopup from "./NotificationSettings";
import ChangePasswordPopup from "./ChangePassword";
import DeleteConfirmation from "./DeleteConfirmation";


interface IPopups {
    currentPopup: string | null;
    closePopup: () => void;
    openPreviousPopup: () => void;
}



const AllPopupsComponent = ({ currentPopup, closePopup, openPreviousPopup }: IPopups) => {

    return (
        <>            
            <AddNewModal
                visible={currentPopup === "AddNew"}
                onClose={() => closePopup()}
            />
            <EventTypeForm
                visible={currentPopup === "EventTypeForm"}
                onClose={() => openPreviousPopup()}
            />
            <EventForm
                visible={currentPopup === "EventForm"}
                onClose={() => closePopup()}
            />
            <TaskForm
                visible={currentPopup === "TaskForm"}
                onClose={() => closePopup()}
            />
            <NoteForm
                visible={currentPopup === "NoteForm"}
                onClose={() => closePopup()}
            />
            <FilterPopup
                visible={currentPopup === "filter"}
                onClose={() => closePopup()}
            />
            <LanguagePopup
                visible={currentPopup === "LanguageSettings"}
                onClose={() => closePopup()}
            />
            <NotificationPopup
                visible={currentPopup === "NotificationSettings"}
                onClose={() => closePopup()}
            />
            <ChangePasswordPopup
                visible={currentPopup === "changePassword"}
                onClose={() => closePopup()}
            />
            <ChangePasswordPopup
                visible={currentPopup === "changePassword"}
                onClose={() => closePopup()}
            />
            <DeleteConfirmation
                visible={currentPopup === "DeleteConfirmation"}
                onClose={() => closePopup()}
            />
        </>
    )
}


const mapState = ({
    popup,
}: {
    popup: IPopupStore;
}) => {
    const { currentPopup } = popup;
    return { currentPopup };
};

const mapDispatch = {
    closePopup: () => ({
        type: "CLOSE_POPUP"
    }),
    openPreviousPopup: () => ({
        type: "OPEN_PREVIOUS_POPUP"
    }),
};



const connector = connect(mapState, mapDispatch);


export const AllPopups = connector(AllPopupsComponent);



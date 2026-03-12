// import type { ParamListBase } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    EventTypes: { noAnim?: boolean } | undefined;
    Tasks: { noAnim?: boolean } | undefined;
    Notes: { noAnim?: boolean } | undefined;
    Profile: { noAnim?: boolean } | undefined;
    EditProfile: { noAnim?: boolean } | undefined;
    DeleteAccount: { noAnim?: boolean } | undefined;
    Notifications: { noAnim?: boolean } | undefined;

    EventTypesList: { noAnim?: boolean } | undefined;
    EventTypesSingle: { eventTypeId: number, noAnim?: boolean } | undefined;
    TasksList: { noAnim?: boolean } | undefined;
    TasksSingle: { taskId: number, noAnim?: boolean } | undefined;
    NotesList: { noAnim?: boolean } | undefined;
    NotesSingle: { noteId: number, noAnim?: boolean } | undefined;
};

// const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

// export default navigation;

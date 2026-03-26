import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import IPopupStore from '../../../store/popup/initStore.interface';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../../navigation/navigationRef';
import NewsMenuIcon from '../icons/menu/news';
import FinanceMenuIcon from '../icons/menu/finance';
import DocumentsMenuIcon from '../icons/menu/documents';
import AccountMenuIcon from '../icons/menu/account';


interface Tab {
  title: string;
  icon: 'news' | 'finance' | 'documents' | 'account';
  link: 'News' | 'Finance' | 'Documents' | 'Profile';
}

interface BottomMenuProps {
  openPopup: (popupToOpen: string) => void;
}

const BottomMenu = ({ openPopup }: BottomMenuProps) => {
  const [routeName, setRouteName] = React.useState<string | undefined>(undefined);

  const tabs: Tab[] = [
    { title: 'News', icon: 'news', link: 'News' },
    { title: 'Finance', icon: 'finance', link: 'Finance' },
    { title: 'Documents', icon: 'documents', link: 'Documents' },
    { title: 'Profile', icon: 'account', link: 'Profile' },
  ];

  const screensWithHiddenMenu = ['EditProfile', 'DeleteAccount'];

  const onPress = (link: 'News' | 'Finance' | 'Documents' | 'Profile') => {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{
            name: link,
            params: { noAnim: true },
          }],
        })
      );
    }
  };

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      const currentRouteName = navigationRef.getCurrentRoute()?.name;
      setRouteName(currentRouteName);
    });
    return unsubscribe;
  }, []);

  if (screensWithHiddenMenu.includes(routeName || '')) {
    return null;
  }

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.navItem,
            index === 0 ? styles.firstItem : null,
            index === tabs.length - 1 ? styles.lastItem : null,
          ]}
          onPress={() => onPress(tab.link)}
        >
          {tab.icon === 'news' ? (
            <NewsMenuIcon isActive={routeName?.includes('News') || false} />
          ) : tab.icon === 'finance' ? (
            <FinanceMenuIcon isActive={routeName?.includes('Finance') || false} />
          ) : tab.icon === 'documents' ? (
            <DocumentsMenuIcon isActive={routeName?.includes('Documents') || false} />
          ) : (
            <AccountMenuIcon isActive={routeName?.includes('Profile') || false} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingBottom: 15,
    paddingTop: 15,
    paddingHorizontal: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
    width: 32,
  },
  firstItem: {
    marginLeft: 20,
  },
  lastItem: {
    marginRight: 20,
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
  openPopup: (popupToOpen: string) => ({
    type: 'SET_OPEN_POPUP',
    payload: popupToOpen,
  }),
  closePopup: () => ({
    type: 'CLOSE_POPUP',
  }),
};

const connector = connect(mapState, mapDispatch);

const BottomMenuRedux = connector(BottomMenu);

export default BottomMenuRedux;

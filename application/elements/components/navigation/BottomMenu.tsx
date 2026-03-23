import React, { useEffect } from 'react';
import { connect } from "react-redux";
import IPopupStore from "../../../store/popup/initStore.interface";
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../../navigation/navigationRef';
import ClockMenuIcon from '../icons/menu/clock';
import CheckboxMenuIcon from '../icons/menu/checkbox';
import PlusMenuIcon from '../icons/menu/plus';
import BookMenuIcon from '../icons/menu/book';
import AccountMenuIcon from '../icons/menu/account';


interface Tab {
        title: string;
        icon: string;
        isCenter: boolean;
        link: 'EventTypes' | 'AddPopup' | 'Tasks' | 'Notes' | 'Profile';
}

interface BottomMenuProps {	
	openPopup: (popupToOpen: string) => void;
}

const BottomMenu = ({ openPopup }:BottomMenuProps) => {

	const [routeName, setRouteName] = React.useState<string | undefined>(undefined);

	const tabs: Tab[] = [
		{ title: 'Events', icon: 'clock', isCenter: false, link: 'EventTypes' },
		{ title: 'Tasks', icon: 'checkbox', isCenter: false, link: 'Tasks' },
		{ title: 'Add', icon: 'plus', isCenter: true, link: 'AddPopup' },
		{ title: 'Notes', icon: 'book', isCenter: false, link: 'Notes' },
		{ title: 'Profile', icon: 'account', isCenter: false, link: 'Profile' },
	];

	const screensWithHiddenMenu = ['EditProfile', 'DeleteAccount'];

	const onPress = (link: 'EventTypes' | 'AddPopup' | 'Tasks' | 'Notes' | 'Profile') => {
		if (link === 'AddPopup') {
			openPopup("AddNew");
			return;
		}
		if (navigationRef.isReady()) {
			navigationRef.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [{
						name: link,
						params: { noAnim: true }
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
					style={[index === 0 ? styles.firstItem : null, index === tabs.length -1 ? styles.lastItem : null, tab.isCenter ? styles.navItemCenter : styles.navItem]}
					onPress={() => onPress(tab.link)}
				>
					{tab.icon === 'clock' ? (
						<ClockMenuIcon isActive={routeName?.includes('EventTypes') || false} />
					) : tab.icon === 'checkbox' ? (
						<CheckboxMenuIcon isActive={routeName?.includes('Tasks') || false} />
					) : tab.icon === 'plus' ? (
						<PlusMenuIcon />
					) : tab.icon === 'book' ? (
						<BookMenuIcon isActive={routeName?.includes('Notes') || false} />
					) : tab.icon === 'account' ? (
						<AccountMenuIcon isActive={routeName?.includes('Profile') || false} />
					) : (
						tab.icon
					)}
				</TouchableOpacity>
			))}
		</View>
	);
}

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
		gap: 40,
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
		// borderWidth: 1,
		// borderColor: "#000"
	},
	firstItem: {
		marginLeft: 20,
	},
	lastItem: {
		marginRight: 20,
	},
	navItemCenter: {
		width: 52,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#272727',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: -16,
	},
})

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
        type: "SET_OPEN_POPUP",
        payload:popupToOpen,
    }),
	closePopup: () => ({
		type: "CLOSE_POPUP",
	}),
};



const connector = connect(mapState, mapDispatch);


const BottomMenuRedux = connector(BottomMenu);

export default BottomMenuRedux;

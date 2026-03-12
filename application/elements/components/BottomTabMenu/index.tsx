import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
  Animated,
} from 'react-native'
import { connect } from "react-redux";
import IPopupStore from "../../store/popup/initStore.interface";
import { useTranslation } from '../../helpers/lang';
// import { useNavigation } from '@react-navigation/native'

export type Tab = 'Events' | 'Tasks' | 'Notes' | 'Edit' | 'Delete';

interface CustomTabBarProps {
    selected: Tab
    onChange: (tab: Tab) => void,
}

const BottomTabMenu: React.FC<CustomTabBarProps> = ({ onChange, selected }) => {
    const t = useTranslation();
    const tabs: Tab[] = ['Events', 'Tasks', 'Notes', 'Edit']
    // const [active, setActive] = useState<Tab>('Tasks')
    // const nav = useNavigation()
    const indicator = useRef(new Animated.Value(0)).current
    const [tabWidth, setTabWidth] = useState(0)

    // при нажатии — анимируем смещение и навигируем
    const onPress = (tab: Tab, idx: number) => {
        // setActive(tab)
        Animated.spring(indicator, {
            toValue: idx * tabWidth,
            useNativeDriver: true,
        }).start()
        // если используешь React Navigation:
        
        onChange(tab)
    }

    // узнаём ширину одной кнопки
    const onLayout = (e: LayoutChangeEvent) => {
        const full = e.nativeEvent.layout.width
        setTabWidth(full / tabs.length)
    }


    return (
        <View style={styles.container} onLayout={onLayout}>
            {/* сам движущийся фон */}
            <Animated.View
                style={[
                    styles.indicator,
                    {
                    width: tabWidth,
                    transform: [{ translateX: indicator }],
                    },
                ]}
            />
            {tabs.map((tab, i) => (
            <TouchableOpacity
                key={tab}
                style={[styles.tab, selected === tab && { /* тут можно ещё изменить цвет текста */ }]}
                onPress={() => onPress(tab, i)}
            >
                <Text style={[styles.text, selected === tab && styles.textActive]}>
                {{
                    Events: t('events'),
                    Tasks: t('tasks'),
                    Notes: t('notes'),
                    Edit: t('edit'),
                }[tab]}
                </Text>
            </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 29,
        backgroundColor: '#fff',
        position: 'relative',
        // marginBottom:40,
        borderRadius: 20,
        overflow: 'hidden',
        zIndex: 1,
        marginHorizontal:12,


        // shadowColor: '#000',
        // shadowOpacity: 0.8,
        // shadowRadius: 6,
        // shadowOffset: { width: 2, height: 2 },

    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    text: {
        fontSize: 13,
        color: '#333',
    },
    textActive: {
        color: '#fff',
        fontWeight: '600',
    },
    indicator: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#333',
        top: 0,
        left: 0,
        borderRadius: 20,
        overflow: 'hidden',
        // borderRadius: 4,
    },
})



const mapState = ({
    popup,
}: {
    popup: IPopupStore;
}) => {
    const { objectId, objectType } = popup;
    return { objectId, objectType };
};

const mapDispatch = {
    closeEditPopup: () => ({
        type: "SET_OBJECT_POPUP",
        payload:{
			id:null,
			type: null,
			popup: null,
		},
    }),
};

const connector = connect(mapState, mapDispatch);
const BottomTabMenuRedux = connector(BottomTabMenu);

export default BottomTabMenuRedux;
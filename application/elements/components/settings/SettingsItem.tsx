import React, { JSX } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import SettingsIcon from '../icons/settings';
import GlobeIcon from '../icons/globe';
import BellIcon from '../icons/bell';
import AccountIcon from '../icons/account';
import LogoutIcon from '../icons/logOut';

interface SettingsItemProps {
  icon: string;
  label: string;
  extra?: string;
  isWithBorder?: boolean;
  onPress: () => void;
}

interface IIcon {
  icon: JSX.Element;
  color: string;
}

const SettingsItem = ({ icon, label, extra, isWithBorder, onPress }:SettingsItemProps) => {

  const icons: Record<string, IIcon> = {
    "settings": {icon:<SettingsIcon />, color: '#e6f1fa'},
    "globe": {icon:<GlobeIcon />, color: '#ede4f9'},
    "bell": {icon:<BellIcon />, color: '#fceee7'},
    "account": {icon:<AccountIcon />, color: '#fbe8e6'},
    "logout": {icon:<LogoutIcon />, color: '#f5f5f5'},
  }


  return (
    <TouchableOpacity style={[styles.item, isWithBorder && styles.withBorder]} onPress={onPress}>
      <View style={[styles.itemIcon, {backgroundColor: icons[icon]?.color || '#f5f5f5'}]}>
        {icons[icon]?.icon}
      </View>
      <Text style={styles.itemLabel}>{label}</Text>
      {extra && <Text style={styles.itemExtra}>{extra}</Text>}
      <Icon
        name="chevron-right"
        size={20}
        color="#C7C7CC"
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

export default SettingsItem;

const styles = StyleSheet.create({

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  itemIcon: {
    marginRight: 12,
    borderRadius: 8,
    padding: 5
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  itemExtra: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  }
});
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';


interface CheckboxProps {
    isChecked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onChange, label }) => {

    return (

        <View style={styles.toggleRow}>
            <TouchableOpacity
            style={styles.toggleItem}
            onPress={() => onChange(!isChecked)}
            >
                <Icon
                    name={isChecked ? 'check-circle' : 'circle'}
                    size={20}
                    color={isChecked ? '#272727' : '#e5e5e5'}
                />
                <Text style={styles.toggleLabel}>{label}</Text>
            </TouchableOpacity>
        </View>

    )
}




const styles = StyleSheet.create({
  toggleRow: { flexDirection: 'row', marginBottom: 12 },
  toggleItem: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  toggleLabel: { marginLeft: 8, fontSize: 16, color: '#333' },
  
});


export default Checkbox;
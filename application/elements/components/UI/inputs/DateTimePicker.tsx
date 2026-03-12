import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LanguageContext } from '../../../helpers/lang';

interface EditDateTimeProps {
    value: string | null;
    onChange: (date: string | null) => void;
    title: string;
}


const EditDateTime = ({ value, onChange, title }: EditDateTimeProps) => {

    const [pickerMode, setPickerMode] = useState<'date' | 'time' | null>(null);
    const [isChanged, setIsChanged] = useState(false);
    const offsetMinutes = new Date().getTimezoneOffset();

    const isoUtcToLocal = (iso: string): Date => {
        const date = new Date(iso);
        if (!isChanged){
            date.setMinutes(date.getMinutes() - offsetMinutes);
        }
        
        return date;
    };

    const localToIsoUtc = (d: Date): string => {
        // d.setMinutes(d.getMinutes() + offsetMinutes);

        console.log("localToIsoUtc", d.toISOString());
        return d.toISOString();
    };

    // value is stored as UTC instant (ISO with Z); UI displays it in local time.
    const valueDate: Date | null = value ? isoUtcToLocal(value) : null;

    const { language } = React.useContext(LanguageContext);
    const localeString = language === 'uk' ? 'uk-UA' : 'en-US';
	const formattedDate = (date: Date) =>
		date.toLocaleDateString(localeString, { month: 'short', day: 'numeric', year: 'numeric' });
	const formattedTime = (date: Date) =>
		date.toLocaleTimeString(localeString, { hour: 'numeric', minute: '2-digit' });


    const onChangeDate = (event: DateTimePickerEvent | null, selectedDate?: Date | null) => {
      // On Android, when dismissing, selectedDate is undefined.
      // We just close the picker and keep the previous value.
      if (!selectedDate) {
        setPickerMode(null);
        return;
      }

      const mode = pickerMode; // capture before we close picker
      setPickerMode(null);
      if (!mode) return;

      // Start from currently displayed local date/time or now.
    //   const base = valueDate ?? new Date();
      const next = valueDate ?? new Date();

      if (mode === 'date') {
        next.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      }

      if (mode === 'time') {
        next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      }

      onChange(localToIsoUtc(next));
        setIsChanged(true);
    };




    return (

        <>
            <TouchableOpacity style={styles.inputRow}
                    onPress={() => setPickerMode(pickerMode === 'date' ? null : 'date')}>
                <Icon name="calendar-alt" size={20} color="#333" />
                <Text style={styles.label}>{title}</Text>
                <TouchableOpacity
                    style={[styles.pill, { minWidth: valueDate ? 'auto' : 80 } ]}
                    onPress={() => setPickerMode(pickerMode === 'date' ? null : 'date')}
                >
                    <Text style={styles.pillText}>{valueDate && formattedDate(valueDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.pill, { minWidth: valueDate ? 'auto' : 80 } ]}
                    onPress={() => setPickerMode(pickerMode === 'time' ? null : 'time')}
                >
                    <Text style={styles.pillText}>{valueDate ? formattedTime(valueDate) : ''}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setPickerMode(null); onChange(null); }}>
                    <Icon name="times-circle" size={20} color="#999" />
                </TouchableOpacity>

            </TouchableOpacity>

            {pickerMode && (
                <View style={styles.calendarRow}>
                    <DateTimePicker
                        value={valueDate ?? new Date()}
                        mode={pickerMode}
                        display={Platform.OS === 'ios' ? (pickerMode === 'date' ? 'inline' : 'spinner') : 'default'}
                        onChange={onChangeDate}
                        style={styles.picker}
                    />
                </View>
            )}


        </>

    );
}


const styles = StyleSheet.create({

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
    fontSize: 12,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
	
  },
    // inputRow: {
	// 	flexDirection: 'row',
	// 	alignItems: 'center',
	// 	marginBottom: 12,
        
	// },
	calendarRow: {
		marginBottom: 12,
	},
	label: { marginLeft: 8, fontSize: 13, color: '#333', flexShrink: 1,width:70 },
	pill: {
		backgroundColor: '#f0f0f0',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
		marginHorizontal: 8,
        
	},
	pillText: { fontSize: 14, color: '#333' },
	picker: { backgroundColor: '#fff', marginBottom: 16 },
	
});

export default EditDateTime;
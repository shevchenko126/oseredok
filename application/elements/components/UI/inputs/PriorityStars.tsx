import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../../../helpers/lang';


interface PriorityStarsProps {
    priority: number;
    onChange: (priority: number) => void;
}

const PriorityStars: React.FC<PriorityStarsProps> = ({ priority, onChange }) => {
    const t = useTranslation();

    return (

        <View style={styles.priorityRow}>
            <Text style={styles.priorityLabel}>{t('priority')}</Text>
            <View style={styles.starsRow}>
            {Array.from({ length: 5 }, (_, i) => (
                <TouchableOpacity
                    key={i}
                    onPress={() => onChange(i + 1)}
                >
                <Ionicons
                    key={i}
                    name={i < (priority || 0) ? 'star' : 'star-outline'}
                    size={16}
                    color={i === 0 ? '#bfd8ba' : 
                        i === 1 ? '#99b885' : 
                        i === 2 ? '#e2a336' : 
                        i === 3 ? '#e27938' : 
                        i === 4 ? '#d68d89' : '#f39c12'}
                    style={styles.star}
                />
                </TouchableOpacity>
            ))}
            </View>
        </View>
    )
}




const styles = StyleSheet.create({
  priorityRow: { flex: 1, flexDirection: 'row', marginBottom: 12 },
  priorityLabel: { fontSize: 16, fontWeight: '600', marginRight: 6, color: '#3d3d3d' },
  starsRow: { flexDirection: 'row' },
  star: { marginRight: 8 },
  
});


export default PriorityStars;
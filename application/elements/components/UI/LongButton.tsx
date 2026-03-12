import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface AuthButtonProps {
  label: string;
  icon?: string;
  onPress?: () => void;
  style?: any;
  inverted?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  label,
  icon,
  onPress,
  style,
  inverted = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.btn, inverted ? styles.btnInverted : styles.btnDefault, style]}
    >
      {icon && (
        <Icon
          name={icon}
          size={20}
          color={inverted ? '#fff' : '#000'}
          style={styles.btnIcon}
        />
      )}
      <Text style={[styles.btnLabel, inverted && styles.btnLabelInverted]}>{label}</Text>
    </TouchableOpacity>
  );
};





const styles = StyleSheet.create({

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  btnDefault: {
    backgroundColor: '#f5f5f5',
  },
  btnInverted: {
    backgroundColor: '#ff3300', // brand accent colour
  },
  btnIcon: {
    marginRight: 8,
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  btnLabelInverted: {
    color: '#ffffff',
  },
  googleBtn: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  appleBtn: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  emailBtn: {},
});

export default AuthButton;
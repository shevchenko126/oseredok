import React, { useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import TrashIcon from "../../components/icons/trash";
import * as Keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { deleteAccount } from "../../../api/auth";
import { AuthContext } from '../../../helpers/auth';
import { useTranslation } from '../../../helpers/lang';

export default function DeleteAccountScreen() {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  const auth = useContext(AuthContext);
  const t = useTranslation();
  const onDelete = async () => {
    Alert.alert(
      t('areYouSure'),
      t('actionCannotBeUndone'),
      [
        {
          text: t('no'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          onPress: async () => {
            await deleteAccount();
            await Keychain.resetGenericPassword();
            auth && auth.logout();
          },
          style: 'destructive', // делает кнопку красной на iOS
        },
      ],
      { cancelable: true }
    );
  }

  const onCancel = () => {
    navigation.goBack();
  }


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Center block */}
        <View style={styles.centerBlock}>
          <Text style={styles.title}>{t('allAccountDataDeleted')}</Text>
          <Text style={styles.warning}>
            {t('actionCannotBeUndone')}
          </Text>

          <Pressable
            onPress={onDelete}
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && styles.deleteBtnPressed,
            ]}
          >
            <TrashIcon />
            <Text style={styles.deleteText}>{t('deleteAccount')}</Text>
          </Pressable>
        </View>

        {/* Bottom */}
        <Pressable onPress={onCancel} style={styles.cancelWrap}>
          <Text style={styles.cancelText}>{t('cancel')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const RED = "#FF3B30"; // iOS system red
const TEXT = "#111827";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  centerBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40, // чтобы блок визуально был чуть выше центра
  },

  title: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
    color: TEXT,
    textAlign: "center",
  },
  warning: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: TEXT,
    textAlign: "center",
  },

  deleteBtn: {
    marginTop: 18,
    height: 44,
    minWidth: 210,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: RED,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  deleteBtnPressed: {
    opacity: Platform.OS === "ios" ? 0.6 : 0.8,
  },
  trashIcon: {
    fontSize: 16,
    lineHeight: 16,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: RED,
  },

  cancelWrap: {
    paddingVertical: 18,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
    color: '#3f515f',
  },
});
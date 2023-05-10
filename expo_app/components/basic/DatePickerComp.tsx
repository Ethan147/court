import React, { useState } from "react";
import {
  Button,
  Platform,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import TextInputComp from "./TextInputComp";

interface DatePickerCompProps {
  label: string;
  value: string;
  onDateChange: (text: string) => void;
  error?: string | false | undefined;
  passStyles?: {
    datePickerCompWebView?: StyleProp<ViewStyle>;
    datePickerCompWebInput?: StyleProp<ViewStyle>;
    datePickerCompAppView?: StyleProp<ViewStyle>;
    datePickerCompAppModal?: StyleProp<ViewStyle>;
    // text input
    textInputCompOuterView?: StyleProp<ViewStyle>;
    textInputCompTextContainer?: StyleProp<ViewStyle>;
    textInputCompIconContainer?: StyleProp<ViewStyle>;
    textInputCompViewStyle?: StyleProp<ViewStyle>;
    textInputCompText?: StyleProp<ViewStyle>;
    textInputCompHintMessage?: StyleProp<ViewStyle>;
    // error
    datePickerCompErrorText?: StyleProp<ViewStyle>;
  };
}

const DatePickerComp: React.FC<DatePickerCompProps> = ({
  label,
  value,
  onDateChange,
  error,
  passStyles,
}) => {
  const styles = {
    datePickerCompWebView: passStyles?.datePickerCompWebView || {},
    datePickerCompWebInput: passStyles?.datePickerCompWebInput || {},
    datePickerCompAppView: passStyles?.datePickerCompAppView || {},
    datePickerCompAppModal: passStyles?.datePickerCompAppModal || {},
    // text input for web
    textInputCompOuterView: passStyles?.textInputCompOuterView || {},
    textInputCompTextContainer: passStyles?.textInputCompTextContainer || {},
    textInputCompIconContainer: passStyles?.textInputCompIconContainer || {},
    textInputCompViewStyle: passStyles?.textInputCompViewStyle || {},
    textInputCompText: passStyles?.textInputCompText || {},
    textInputCompHintMessage: passStyles?.textInputCompHintMessage || {},
    // error text
    datePickerCompErrorText: passStyles?.datePickerCompErrorText || {},
  };

  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  const handleWebDateChange = (text: string) => {
    onDateChange(text);
    console.warn("A date has been picked: ", text);
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.datePickerCompWebView}>
        <TextInputComp
          label={label}
          value={value}
          onChangeText={handleWebDateChange}
          passStyles={styles}
        />
        {error && <Text style={styles.datePickerCompErrorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.datePickerCompAppView}>
      <Button title="Show Date Picker" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        style={styles.datePickerCompAppModal}
      />
      {error && <Text style={styles.datePickerCompErrorText}>{error}</Text>}
    </View>
  );
};

export default DatePickerComp;

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
  webFormatHint: string;
  value: string;
  onDateChange: (text: string) => void;
  error?: string | false | undefined;
  passStyles?: {
    datePickerCompWebView?: StyleProp<ViewStyle>;
    datePickerCompWebInput?: StyleProp<ViewStyle>;
    datePickerCompAppView?: StyleProp<ViewStyle>;
    datePickerCompAppModal?: StyleProp<ViewStyle>;
    datePickerCompAppButton?: StyleProp<ViewStyle>;
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
  webFormatHint,
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
    datePickerCompAppButton: passStyles?.datePickerCompAppButton || {},
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

  const [dateValue, setDateValue] = useState<string>("");
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
    const formattedDate = date.toLocaleDateString();
    setDateValue(formattedDate);
    onDateChange(formattedDate);
    hideDatePicker();
  };
  const handleWebDateChange = (text: string) => {
    let newText = "";
    let len = text.length;
    for (let i = 0; i < len; i++) {
      if (i == 2 || i == 5) {
        if (/[0-9]/.test(text[i])) newText = newText + "/";
      }
      newText = newText + text[i];
    }
    onDateChange(newText);
    console.warn("A date has been picked: ", newText);
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.datePickerCompWebView}>
        <TextInputComp
          label={label + " " + webFormatHint}
          value={value}
          onChangeText={handleWebDateChange}
          passStyles={styles}
        />
        {error && <Text style={styles.datePickerCompErrorText}>{error}</Text>}
      </View>
    );
  }

  const buttonText = dateValue ? dateValue : "select " + label;

  return (
    <View style={styles.datePickerCompAppView}>
      <Button title={buttonText} onPress={showDatePicker} />
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

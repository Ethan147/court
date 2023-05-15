import React, { useState } from "react";
import { Button, Platform, View, StyleProp, ViewStyle } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import TextInputComp from "./TextInputComp";

interface DatePickerCompProps {
  label: string;
  webFormatHint: string;
  value: string;
  onDateChange: (text: string) => void;
  onBlur?: () => void;
  error?: boolean;
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
  };
}

const DatePickerComp: React.FC<DatePickerCompProps> = ({
  label,
  webFormatHint,
  value,
  onDateChange,
  onBlur,
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

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const handleConfirm = (date: Date) => {
    console.warn("A date has been picked: ", date);
    const formattedDate = date.toLocaleDateString();
    setDateValue(formattedDate);
    onDateChange(formattedDate);
    hideDatePicker();
    handleBlur();
  };

  const handleWebDateChange = (text: string) => {
    // remove all non-numeric characters
    let newText = text.replace(/[^0-9]/g, "");

    // add slashes at the correct positions
    if (newText.length >= 2) {
      newText = newText.slice(0, 2) + "/" + newText.slice(2);
    }
    if (newText.length >= 5) {
      newText = newText.slice(0, 5) + "/" + newText.slice(5);
    }

    onDateChange(newText);
    console.warn("A date has been picked: ", newText);
    handleBlur();
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.datePickerCompWebView}>
        <TextInputComp
          label={label + " " + webFormatHint}
          value={value}
          error={error}
          onChangeText={handleWebDateChange}
          passStyles={styles}
        />
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
    </View>
  );
};

export default DatePickerComp;

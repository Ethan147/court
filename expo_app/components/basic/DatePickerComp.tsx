import React, { useState } from "react";
import {
  Button,
  Platform,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  StyleProp,
  ViewStyle,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Input } from "react-native-elements";

interface DatePickerCompProps {
  label: string;
  value: string;
  onDateChange: (text: string) => void;
  passStyles?: {
    datePickerCompWebView?: StyleProp<ViewStyle>;
    datePickerCompWebInput?: StyleProp<ViewStyle>;
    datePickerCompAppView?: StyleProp<ViewStyle>;
    datePickerCompAppModal?: StyleProp<ViewStyle>;
  };
}

const DatePickerComp: React.FC<DatePickerCompProps> = ({
  label,
  value,
  onDateChange,
  passStyles,
}) => {
  const styles = {
    datePickerCompWebView: passStyles?.datePickerCompWebView || {},
    datePickerCompWebInput: passStyles?.datePickerCompWebInput || {},
    datePickerCompAppView: passStyles?.datePickerCompAppView || {},
    datePickerCompAppModal: passStyles?.datePickerCompAppModal || {},
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

  const handleWebDateChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    onDateChange(event.nativeEvent.text);
    console.warn("A date has been picked: ", event.nativeEvent.text);
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.datePickerCompWebView}>
        <Input
          value={value || ""}
          onChange={handleWebDateChange}
          placeholder="date of birth (mm/dd/yyyy)"
          style={styles.datePickerCompWebInput}
        />
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
    </View>
  );
};

export default DatePickerComp;

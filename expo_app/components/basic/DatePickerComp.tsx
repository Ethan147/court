import React, { useState } from "react";
import { Button, Platform, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Input } from "react-native-elements";

const DatePickerComp = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  const handleWebDateChange = (event) => {
    setSelectedDate(event.target.value);
    console.warn("A date has been picked: ", event.target.value);
  };

  if (Platform.OS === "web") {
    return (
      <View>
        <Input
          type="date"
          value={selectedDate}
          onChange={handleWebDateChange}
        />
      </View>
    );
  }

  return (
    <View>
      <Button title="Show Date Picker" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default DatePickerComp;

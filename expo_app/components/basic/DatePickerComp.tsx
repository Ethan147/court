import React, { useState } from "react";
import {
  Platform,
  View,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  TextInput,
} from "react-native";
import DateTimePicker, {
  Event as DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerCompProps {
  label?: string;
  value?: Date | null;
  onDateChange?: (date: Date | null) => void;
  passStyles?: {
    dateOfBirthPickerContainer?: StyleProp<ViewStyle>;
    dateOfBirthPickerButton?: StyleProp<ViewStyle>;
    datePickerWeb?: StyleProp<ViewStyle>;
  };
}

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <TextInput
    ref={ref}
    style={{ borderWidth: 1, borderColor: "grey", padding: 5 }}
    value={value}
    placeholder="Date (MM/DD/YYYY)"
    onClick={onClick}
    readOnly
  />
));

const DatePickerComp: React.FC<DatePickerCompProps> = ({
  label,
  value,
  onDateChange,
  passStyles,
}) => {
  const styles = {
    dateOfBirthPickerContainer: passStyles?.dateOfBirthPickerContainer || {},
    dateOfBirthPickerButton: passStyles?.dateOfBirthPickerButton || {},
    datePickerWeb: passStyles?.datePickerWeb || {},
  };

  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value;
    setShowPicker(false);
    if (onDateChange && currentDate) {
      onDateChange(currentDate);
    }
  };

  const handlePress = () => {
    setShowPicker(true);
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.dateOfBirthPickerContainer}>
        <Text>{label}</Text>
        <DatePicker
          selected={value}
          onChange={(date: Date | [Date | null, Date | null] | null) => {
            if (onDateChange && date instanceof Date) {
              onDateChange(date);
            }
          }}
          dateFormat="MM/dd/yyyy"
          maxDate={new Date()}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          customInput={<CustomInput />}
        />
      </View>
    );
  }

  return (
    <View style={styles.dateOfBirthPickerContainer}>
      <Text>{label}</Text>
      <TouchableOpacity
        onPress={handlePress}
        style={styles.dateOfBirthPickerButton}
      >
        <Text>
          {value
            ? `Date: ${value.toLocaleDateString()}`
            : "Select Date (MM/DD/YYYY)"}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default DatePickerComp;

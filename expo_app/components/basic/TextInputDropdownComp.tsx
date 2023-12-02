import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import colors from "../../utils/colors";
import theme from "../../utils/theme";
import TextInputComp from "./TextInputComp";

const TextInputDropdownComp = ({
  label,
  value,
  dropdown,
  onChangeText,
  onBlur,
  error,
  secureTextEntry,
  passStyles,
}: {
  label?: string;
  value?: string;
  dropdown?: Array<string>;
  onChangeText?: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: boolean;
  secureTextEntry?: boolean;
  passStyles?: {
    textInputDropdownCompOuterView: StyleProp<ViewStyle>;
    textInputCompOuterView?: StyleProp<ViewStyle>;
    textInputCompTextContainer?: StyleProp<ViewStyle>;
    textInputCompIconContainer?: StyleProp<ViewStyle>;
    textInputCompText?: StyleProp<ViewStyle>;
  };
}) => {
  const styles = {
    textInputDropdownCompOuterView:
      passStyles?.textInputDropdownCompOuterView || {},
    textInputCompOuterView: passStyles?.textInputCompOuterView || {},
    textInputCompTextContainer: passStyles?.textInputCompTextContainer || {},
    textInputCompIconContainer: passStyles?.textInputCompIconContainer || {},
    textInputCompText: passStyles?.textInputCompText || {},
  };

  const handleSelectOption = (option: string) => {
    if (onChangeText) {
      onChangeText(option);
    }
  };

  return (
    <View style={styles.textInputDropdownCompOuterView}>
      <TextInputComp
        label={label}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        error={error}
        secureTextEntry={secureTextEntry}
        passStyles={passStyles}
      />
      {dropdown && dropdown.length > 0 && (
        // <View style={styles.dropdownContainer}>
        <View>
          {dropdown.map((option, index) => (
            <TouchableOpacity
              key={index}
              //   style={styles.dropdownOption}
              onPress={() => handleSelectOption(option)}
            >
              <Text>{option}</Text>
              {/* <Text style={styles.dropdownOptionText}>{option}</Text> */}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default TextInputDropdownComp;

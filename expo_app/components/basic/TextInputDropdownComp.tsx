import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Pressable,
  View,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import TextInputComp from "./TextInputComp";

const TextInputDropdownComp = ({
  label,
  value,
  dropdown,
  onChangeText,
  onDropdownSelect,
  onBlur,
  error,
  secureTextEntry,
  passStyles,
}: {
  label?: string;
  value?: string;
  dropdown?: Record<string, any>[];
  onChangeText: (text: string) => void;
  onDropdownSelect: (selectedOption: Record<string, any>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: boolean;
  secureTextEntry?: boolean;
  passStyles?: {
    textInputDropdownCompOuterView: StyleProp<ViewStyle>;
    textInputDropdownCompContainer: StyleProp<ViewStyle>;
    textInputDropdownCompPressable: StyleProp<ViewStyle>;
    textInputDropdownCompOptionText: StyleProp<ViewStyle>;
    // textInputComp
    textInputCompOuterView?: StyleProp<ViewStyle>;
    textInputCompTextContainer?: StyleProp<ViewStyle>;
    textInputCompIconContainer?: StyleProp<ViewStyle>;
    textInputCompText?: StyleProp<ViewStyle>;
  };
}) => {
  const styles = {
    textInputDropdownCompOuterView:
      passStyles?.textInputDropdownCompOuterView || {},
    textInputDropdownCompContainer:
      passStyles?.textInputDropdownCompContainer || {},
    textInputDropdownCompPressable:
      passStyles?.textInputDropdownCompPressable || {},
    textInputDropdownCompOptionText:
      passStyles?.textInputDropdownCompOptionText || {},
    textInputCompOuterView: passStyles?.textInputCompOuterView || {},
    textInputCompTextContainer: passStyles?.textInputCompTextContainer || {},
    textInputCompIconContainer: passStyles?.textInputCompIconContainer || {},
    textInputCompText: passStyles?.textInputCompText || {},
  };
  const passTextInputCompStyles = {
    textInputCompOuterView: styles.textInputCompOuterView,
    textInputCompTextContainer: styles.textInputCompTextContainer,
    textInputCompIconContainer: styles.textInputCompIconContainer,
    textInputCompText: styles.textInputCompText,
  };

  const handleSelectOption = (option: Record<string, any>) => {
    onDropdownSelect(option);
    onChangeText(option.description);
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
        passStyles={passTextInputCompStyles}
      />
      {dropdown &&
        dropdown.length > 0 &&
        !(
          value &&
          dropdown.length === 1 &&
          dropdown[0].description.toLowerCase() === value.toLowerCase()
        ) && (
          <View style={styles.textInputDropdownCompContainer}>
            {dropdown.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => handleSelectOption(option)}
                style={styles.textInputDropdownCompPressable}
              >
                <Text style={styles.textInputDropdownCompOptionText}>
                  {option.description}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
    </View>
  );
};

export default TextInputDropdownComp;

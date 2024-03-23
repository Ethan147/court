import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

interface ToggleButtonGroupCompProps {
  onValueChange?: (value: string) => void;
  buttons: string[];
  label: string;
  passStyles?: {
    toggleButtonGroupCompContainer?: StyleProp<ViewStyle>;
    toggleButtonGroupCompLabel?: StyleProp<TextStyle>;
    toggleButtonGroupCompButtons?: StyleProp<ViewStyle>;
    toggleButtonGroupCompButton?: StyleProp<ViewStyle>;
    toggleButtonGroupCompSelectedButton?: StyleProp<ViewStyle>;
    toggleButtonGroupCompButtonText?: StyleProp<TextStyle>;
    toggleButtonGroupCompButtonTextSelected?: StyleProp<TextStyle>;
  };
}

export const ToggleButtonGroupComp: React.FC<ToggleButtonGroupCompProps> = ({
  onValueChange,
  buttons,
  label,
  passStyles,
}) => {
  const styles = {
    toggleButtonGroupCompContainer:
      passStyles?.toggleButtonGroupCompContainer || {},
    toggleButtonGroupCompLabel: passStyles?.toggleButtonGroupCompLabel || {},
    toggleButtonGroupCompButtons:
      passStyles?.toggleButtonGroupCompButtons || {},
    toggleButtonGroupCompButton: passStyles?.toggleButtonGroupCompButton || {},
    toggleButtonGroupCompSelectedButton:
      passStyles?.toggleButtonGroupCompSelectedButton || {},
    toggleButtonGroupCompButtonText:
      passStyles?.toggleButtonGroupCompButtonText || {},
    toggleButtonGroupCompButtonTextSelected:
      passStyles?.toggleButtonGroupCompButtonTextSelected || {},
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const isSelected = (value: string) => selectedValue === value;

  return (
    <View style={styles.toggleButtonGroupCompContainer}>
      <Text style={styles.toggleButtonGroupCompLabel}>{label}</Text>
      <View style={styles.toggleButtonGroupCompButtons}>
        {buttons.map((buttonName) => (
          <Pressable
            key={buttonName}
            testID="button"
            style={[
              styles.toggleButtonGroupCompButton,
              isSelected(buttonName) &&
                styles.toggleButtonGroupCompSelectedButton,
            ]}
            onPress={() => handleValueChange(buttonName)}
          >
            <Text
              style={[
                styles.toggleButtonGroupCompButtonText,
                isSelected(buttonName) &&
                  styles.toggleButtonGroupCompButtonTextSelected,
              ]}
            >
              {buttonName}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default ToggleButtonGroupComp;

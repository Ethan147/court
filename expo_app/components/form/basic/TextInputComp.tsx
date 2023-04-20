import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../../utils/colors";
import theme from "../../../utils/theme";

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: colors.primary,
    placeholder: colors.text,
  },
};

const TextInputComp = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry,
  passStyles,
}: {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: boolean;
  secureTextEntry?: boolean;
  passStyles?: {
    textInputCompContainer?: StyleProp<ViewStyle>;
    textInputCompIconContainer?: StyleProp<ViewStyle>;
    textInputCompViewStyle?: StyleProp<ViewStyle>;
    textInputCompText?: StyleProp<ViewStyle>;
  };
}) => {
  const styles = {
    textInputCompContainer: passStyles?.textInputCompContainer || {},
    textInputCompIconContainer: passStyles?.textInputCompIconContainer || {},
    textInputCompViewStyle: passStyles?.textInputCompViewStyle || {},
    textInputCompText: passStyles?.textInputCompText || {},
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.textInputCompViewStyle}>
      <View style={styles.textInputCompContainer}>
        <TextInput
          label={label}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          error={error}
          autoComplete={undefined}
          style={styles.textInputCompText}
          theme={customTheme}
          secureTextEntry={secureTextEntry && !showPassword}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.textInputCompIconContainer}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={theme.font.size.large}
              color={"gray"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TextInputComp;

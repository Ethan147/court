import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  Text,
} from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../../utils/colors";
import theme from "../../utils/theme";

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
  hintMessage,
}: {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: boolean;
  secureTextEntry?: boolean;
  passStyles?: {
    textInputCompOuterView?: StyleProp<ViewStyle>;
    textInputCompTextContainer?: StyleProp<ViewStyle>;
    textInputCompIconContainer?: StyleProp<ViewStyle>;
    textInputCompViewStyle?: StyleProp<ViewStyle>;
    textInputCompText?: StyleProp<ViewStyle>;
    textInputCompHintMessage?: StyleProp<ViewStyle>;
  };
  hintMessage?: string;
}) => {
  const styles = {
    textInputCompOuterView: passStyles?.textInputCompOuterView || {},
    textInputCompTextContainer: passStyles?.textInputCompTextContainer || {},
    textInputCompIconContainer: passStyles?.textInputCompIconContainer || {},
    textInputCompViewStyle: passStyles?.textInputCompViewStyle || {},
    textInputCompText: passStyles?.textInputCompText || {},
    textInputCompHintMessage: passStyles?.textInputCompHintMessage || {},
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.textInputCompOuterView}>
      <View style={styles.textInputCompTextContainer}>
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
      {hintMessage && (
        <Text style={styles.textInputCompHintMessage}>{hintMessage}</Text>
      )}
    </View>
  );
};

export default TextInputComp;

import React from "react";
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInputFocusEventData,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useWindowDimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../utils/colors";
import theme from "../../../utils/theme";

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: colors.primary,
  },
};

const TextInputComp = ({
  label,
  value,
  onChangeText,
  onBlur,
  errors,
}: {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  errors?: boolean;
}) => {
  const windowDimensions = useWindowDimensions();

  const styles = StyleSheet.create({
    input: {
      ...Platform.select({
        web: {
          paddingVertical: windowDimensions.width * 0.01,
          width: windowDimensions.width * 0.8,
        },
        ios: {
          paddingVertical: wp("1%"),
          width: wp("80%"),
        },
        android: {
          // todo
        },
      }),
      borderColor: colors.text,
      selectionColor: colors.primary,
    },
  });

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      error={errors}
      autoCompleteType={undefined}
      style={styles.input}
      theme={customTheme}
    />
  );
};

export default TextInputComp;

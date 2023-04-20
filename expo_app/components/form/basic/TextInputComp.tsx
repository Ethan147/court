import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { TextInput } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
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

// TODO: find scalable method of style-pass-in (reusabliilty)
const TextInputComp = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry,
}: {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: boolean;
  secureTextEntry?: boolean;
}) => {
  const windowDimensions = useWindowDimensions();

  const styles = StyleSheet.create({
    input: {
      ...Platform.select({
        web: {
          width: windowDimensions.width * 0.65,
        },
        ios: {
          width: wp("65%"),
        },
        android: {
          // todo
        },
      }),
      borderColor: colors.text,
      selectionColor: colors.primary,
      backgroundColor: colors.setting,
    },
    container: {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
    },
    iconContainer: {
      ...Platform.select({
        web: {
          right: windowDimensions.width * 0.017,
        },
        ios: {
          right: wp("1.7%"),
        },
        android: {
          // todo
        },
      }),
      position: "absolute",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={styles.container}>
        <TextInput
          label={label}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          error={error}
          autoComplete={undefined}
          style={styles.input}
          theme={customTheme}
          secureTextEntry={secureTextEntry && !showPassword}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconContainer}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TextInputComp;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../../utils/colors";
import theme from "../../../utils/theme";

interface ToggleButtonGroupCompProps {
  onValueChange?: (value: string) => void;
}

export const ToggleButtonGroupComp: React.FC<ToggleButtonGroupCompProps> = ({
  onValueChange,
}) => {
  const windowDimensions = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      ...Platform.select({
        web: {
          paddingVertical: windowDimensions.width * 0.01,
          paddingHorizontal: windowDimensions.width * 0.01,
          marginRight: windowDimensions.width * 0.01,
        },
        ios: {
          paddingVertical: wp("1%"),
          paddingHorizontal: wp("1%"),
          marginRight: wp("1%"),
        },
        android: {
          // todo
        },
      }),
      justifyContent: "center",
      alignItems: "center",
    },
    label: {
      ...Platform.select({
        web: {
          marginBottom: windowDimensions.width * 0.02,
        },
        ios: {
          paddingVertical: wp("1%"),
        },
        android: {
          // todo
        },
      }),
      fontSize: theme.font.size.small,
      color: colors.textSecondary,
    },
    buttons: {
      flexDirection: "row",
    },
    button: {
      ...Platform.select({
        web: {
          paddingVertical: windowDimensions.width * 0.01,
          paddingHorizontal: windowDimensions.width * 0.01,
          marginRight: windowDimensions.width * 0.01,
        },
        ios: {
          paddingVertical: wp("1%"),
          paddingHorizontal: wp("1%"),
          marginRight: wp("1%"),
        },
        android: {
          // todo
        },
      }),
      borderColor: colors.textSecondary,
      borderWidth: 0.5,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: theme.font.size.medium,
    },
    selected: {
      backgroundColor: colors.primary,
    },
  });

  const [gender, setGender] = useState("male");

  const handleValueChange = (value: string) => {
    setGender(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const isSelected = (value: string) => gender === value;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>what's your gender?</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, isSelected("male") && styles.selected]}
          onPress={() => handleValueChange("male")}
        >
          <Text style={styles.buttonText}>male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isSelected("female") && styles.selected]}
          onPress={() => handleValueChange("female")}
        >
          <Text style={styles.buttonText}>female</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isSelected("other") && styles.selected]}
          onPress={() => handleValueChange("other")}
        >
          <Text style={styles.buttonText}>other / prefer not to say</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ToggleButtonGroupComp;

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
      color: colors.text,
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
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: theme.font.size.medium,
      color: colors.text,
    },
    buttonTextSelected: {
      fontSize: theme.font.size.medium,
      color: "white",
    },
    selectedButton: {
      backgroundColor: colors.settingSelect,
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
          style={[styles.button, isSelected("male") && styles.selectedButton]}
          onPress={() => handleValueChange("male")}
        >
          <Text
            style={[
              styles.buttonText,
              isSelected("male") && styles.buttonTextSelected,
            ]}
          >
            male
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isSelected("female") && styles.selectedButton]}
          onPress={() => handleValueChange("female")}
        >
          <Text
            style={[
              styles.buttonText,
              isSelected("female") && styles.buttonTextSelected,
            ]}
          >
            female
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isSelected("other") && styles.selectedButton]}
          onPress={() => handleValueChange("other")}
        >
          <Text
            style={[
              styles.buttonText,
              isSelected("other") && styles.buttonTextSelected,
            ]}
          >
            other / prefer not to say
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ToggleButtonGroupComp;

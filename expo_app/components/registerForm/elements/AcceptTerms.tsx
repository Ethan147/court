import React, { useState } from "react";
import {
  View,
  Text,
  TextStyle,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import colors from "../../../utils/colors";

interface AcceptTermsProps {
  acceptTerms?: boolean;
  onPress?: () => void;
  passStyles?: {
    termsSwitchOuterView?: StyleProp<ViewStyle>;
    termsSwitchView?: StyleProp<ViewStyle>;
    termsTextView?: StyleProp<ViewStyle>;
    termsAgreeText?: StyleProp<TextStyle>;
  };
}

type TermsNavigationProp = NavigationProp<any, "TermsAndConditions">;

const AcceptTerms: React.FC<AcceptTermsProps> = ({
  acceptTerms = false,
  onPress,
  passStyles,
}) => {
  const styles = {
    termsSwitchOuterView: passStyles?.termsSwitchOuterView || {},
    termsSwitchView: passStyles?.termsSwitchView || {},
    termsTextView: passStyles?.termsTextView || {},
    termsAgreeText: passStyles?.termsAgreeText || {},
  };

  const navigation = useNavigation<TermsNavigationProp>();
  const [isAccepted, setIsAccepted] = useState(acceptTerms);

  const handlePress = () => {
    navigation.navigate("TermsAndConditions");
    if (onPress) {
      onPress();
    }
  };

  const handleSwitch = () => {
    setIsAccepted(!isAccepted);
  };

  return (
    <View style={styles?.termsSwitchOuterView}>
      <View style={styles?.termsSwitchView}>
        <Switch
          value={isAccepted}
          onValueChange={handleSwitch}
          ios_backgroundColor={colors.setting}
          trackColor={{ false: colors.settingSelect, true: colors.accent }}
          testID="switch"
        />
      </View>
      <View style={styles?.termsTextView}>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles?.termsAgreeText}>
            Agree to Terms and Conditions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AcceptTerms;

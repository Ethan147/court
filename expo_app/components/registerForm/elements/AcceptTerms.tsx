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
    acceptTermsSwitchOuterView?: StyleProp<ViewStyle>;
    acceptTermsSwitchView?: StyleProp<ViewStyle>;
    acceptTermsTextView?: StyleProp<ViewStyle>;
    acceptTermsAgreeText?: StyleProp<TextStyle>;
  };
}

type TermsNavigationProp = NavigationProp<any, "TermsAndConditions">;

const AcceptTerms: React.FC<AcceptTermsProps> = ({
  acceptTerms = false,
  onPress,
  passStyles,
}) => {
  const styles = {
    acceptTermsSwitchOuterView: passStyles?.acceptTermsSwitchOuterView || {},
    acceptTermsSwitchView: passStyles?.acceptTermsSwitchView || {},
    acceptTermsTextView: passStyles?.acceptTermsTextView || {},
    acceptTermsAgreeText: passStyles?.acceptTermsAgreeText || {},
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
    <View style={styles?.acceptTermsSwitchOuterView}>
      <View style={styles?.acceptTermsSwitchView}>
        <Switch
          value={isAccepted}
          onValueChange={handleSwitch}
          ios_backgroundColor={colors.setting}
          trackColor={{ false: colors.settingSelect, true: colors.accent }}
          testID="switch"
        />
      </View>
      <View style={styles?.acceptTermsTextView}>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles?.acceptTermsAgreeText}>
            Agree to Terms and Conditions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AcceptTerms;

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
    termsAgreeText?: StyleProp<TextStyle>;
    termsSwitchOuterView?: StyleProp<ViewStyle>;
  };
}

type TermsNavigationProp = NavigationProp<any, "TermsAndConditions">;

const AcceptTerms: React.FC<AcceptTermsProps> = ({
  acceptTerms = false,
  onPress,
  passStyles,
}) => {
  const styles = {
    termsAgreeText: passStyles?.termsAgreeText || {},
    termsSwitchOuterView: passStyles?.termsSwitchOuterView || {},
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

  // TODO continue this individual view thought 
  return (
    <View style={styles?.termsSwitchOuterView}>
    <View style={styles?.termsSwitchView}>  
      <Switch
        value={isAccepted}
        onValueChange={handleSwitch}
        ios_backgroundColor={colors.setting}
        trackColor={{ false: colors.settingSelect, true: colors.accent }}
      />
      </View>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles?.termsAgreeText}>
          Agree to Terms and Conditions
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AcceptTerms;

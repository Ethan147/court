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
  defaultTermsState: boolean;
  onPress: (isAccepted: boolean) => void;
  passStyles?: {
    acceptTermsSwitchOuterView?: StyleProp<ViewStyle>;
    acceptTermsSwitchView?: StyleProp<ViewStyle>;
    acceptTermsTextView?: StyleProp<ViewStyle>;
    acceptTermsAgreeText?: StyleProp<TextStyle>;
  };
}

type TermsNavigationProp = NavigationProp<any, "TermsAndConditions">;

const AcceptTerms: React.FC<AcceptTermsProps> = ({
  defaultTermsState,
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
  const [isAccepted, setIsAccepted] = useState(defaultTermsState);

  const handlePress = () => {
    navigation.navigate("TermsAndConditions");
  };

  const handleSwitch = () => {
    setIsAccepted(!isAccepted);
    onPress(!isAccepted);
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

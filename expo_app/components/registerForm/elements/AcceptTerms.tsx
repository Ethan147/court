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
    collapsibleTermsAgreeText?: StyleProp<TextStyle>;
    collapsibleTermsCheckboxView?: StyleProp<ViewStyle>;
  };
}

type CollapsibleTermsNavigationProp = NavigationProp<any, "TermsAndConditions">;

const AcceptTerms: React.FC<AcceptTermsProps> = ({
  acceptTerms = false,
  onPress,
  passStyles,
}) => {
  const styles = {
    collapsibleTermsAgreeText: passStyles?.collapsibleTermsAgreeText || {},
    collapsibleTermsCheckboxView:
      passStyles?.collapsibleTermsCheckboxView || {},
  };

  const navigation = useNavigation<CollapsibleTermsNavigationProp>();
  const [isChecked, setIsChecked] = useState(acceptTerms);

  const handlePress = () => {
    navigation.navigate("TermsAndConditions");
    if (onPress) {
      onPress();
    }
  };

  const handleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <View>
      <View style={styles?.collapsibleTermsCheckboxView}>
        <Switch
          value={isChecked}
          onValueChange={handleCheckbox}
          // thumbColor={isChecked ? "red" : "blue"}
          trackColor={{ true: colors.accent, false: colors.setting }}
        />
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles?.collapsibleTermsAgreeText}>
            Agree to Terms and Conditions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AcceptTerms;

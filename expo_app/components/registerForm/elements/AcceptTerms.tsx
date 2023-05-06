import React, { useState } from "react";
import {
  View,
  Text,
  TextStyle,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";

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
  const [checked, setChecked] = useState(acceptTerms);

  const handlePress = () => {
    navigation.navigate("TermsAndConditions");
    if (onPress) {
      onPress();
    }
  };

  const handleCheckbox = () => {
    setChecked(!checked);
  };

  return (
    <View>
      <View style={styles?.collapsibleTermsCheckboxView}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={handleCheckbox}
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

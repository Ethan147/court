import React, { useState } from "react";
import {
  View,
  Text,
  TextStyle,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

interface ViewPrivacyPolicyProps {
  acceptTerms?: boolean;
  onPress?: () => void;
  passStyles?: {
    viewPrivacyPolicyView?: StyleProp<ViewStyle>;
    viewPrivacyPolicyText?: StyleProp<TextStyle>;
  };
}

type ViewPrivatePolicyNavigationProp = NavigationProp<any, "PrivacyPolicy">;

const ViewPrivacyPolicy: React.FC<ViewPrivacyPolicyProps> = ({
  passStyles,
}) => {
  const styles = {
    viewPrivacyPolicyView: passStyles?.viewPrivacyPolicyView || {},
    viewPrivacyPolicyText: passStyles?.viewPrivacyPolicyText || {},
  };

  const navigation = useNavigation<ViewPrivatePolicyNavigationProp>();

  const handlePress = () => {
    navigation.navigate("PrivacyPolicy");
  };

  return (
    <View>
      <View style={styles?.viewPrivacyPolicyView}>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles?.viewPrivacyPolicyText}>View Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewPrivacyPolicy;

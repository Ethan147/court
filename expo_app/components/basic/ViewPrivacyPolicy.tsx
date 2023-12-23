import React from "react";
import {
  View,
  Text,
  TextStyle,
  ViewStyle,
  StyleProp,
  Pressable,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

interface ViewPrivacyPolicyProps {
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
        <Pressable onPress={handlePress}>
          <Text style={styles?.viewPrivacyPolicyText}>View Privacy Policy</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ViewPrivacyPolicy;

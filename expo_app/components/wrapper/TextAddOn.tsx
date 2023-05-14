import React from "react";
import { View, Text, StyleProp, TextStyle, ViewStyle } from "react-native";

interface TextAddOnProps {
  component: React.ReactNode;
  value?: string;
  display?: boolean;
  passStyles?: {
    textAddOnView?: StyleProp<ViewStyle>;
    textAddOnText?: StyleProp<TextStyle>;
  };
}

const TextAddOn: React.FC<TextAddOnProps> = ({
  component,
  value,
  display,
  passStyles,
}) => {
  const styles = {
    textAddOnView: passStyles?.textAddOnView || {},
    textAddOnText: passStyles?.textAddOnText || {},
  };

  return (
    <View style={styles.textAddOnView}>
      {component}
      {display && <Text style={styles.textAddOnText}>{value}</Text>}
    </View>
  );
};

export default TextAddOn;

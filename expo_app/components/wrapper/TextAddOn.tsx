import React from "react";
import { View, Text, StyleProp, TextStyle, ViewStyle } from "react-native";

interface TextAddOnProps {
  component: React.ReactNode;
  value?: string;
  display?: boolean;
  passStyles?: {
    textAddOnContainerView?: StyleProp<ViewStyle>;
    textAddOnTextView?: StyleProp<ViewStyle>;
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
    textAddOnContainerView: passStyles?.textAddOnContainerView || {},
    textAddOnTextView: passStyles?.textAddOnTextView || {},
    textAddOnText: passStyles?.textAddOnText || {},
  };

  return (
    <View style={styles.textAddOnContainerView}>
      {component}
      {display && (
        <View style={styles.textAddOnTextView}>
          <Text style={styles.textAddOnText}>{value}</Text>
        </View>
      )}
    </View>
  );
};

export default TextAddOn;

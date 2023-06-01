import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

interface ButtonCompProps {
  text?: string;
  onPress?: () => void;
  passStyles?: {
    buttonCompTouchableOpacity?: StyleProp<ViewStyle>;
    buttonCompText?: StyleProp<TextStyle>;
  };
}

const ButtonComp: React.FC<ButtonCompProps> = ({
  text,
  onPress,
  passStyles,
}) => {
  const styles = {
    buttonCompTouchableOpacity: passStyles?.buttonCompTouchableOpacity || {},
    buttonCompText: passStyles?.buttonCompText || {},
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.buttonCompTouchableOpacity}
      testID="buttonComp"
    >
      <Text style={styles.buttonCompText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComp;

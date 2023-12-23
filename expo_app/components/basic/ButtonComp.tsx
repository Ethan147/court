import React from "react";
import {
  Pressable,
  Text,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

interface ButtonCompProps {
  text?: string;
  onPress?: () => void;
  passStyles?: {
    buttonCompPressable?: StyleProp<ViewStyle>;
    buttonCompText?: StyleProp<TextStyle>;
  };
}

const ButtonComp: React.FC<ButtonCompProps> = ({
  text,
  onPress,
  passStyles,
}) => {
  const styles = {
    buttonCompPressable: passStyles?.buttonCompPressable || {},
    buttonCompText: passStyles?.buttonCompText || {},
  };

  return (
    <Pressable
      onPress={onPress}
      style={styles.buttonCompPressable}
      testID="buttonComp"
    >
      <Text style={styles.buttonCompText}>{text}</Text>
    </Pressable>
  );
};

export default ButtonComp;

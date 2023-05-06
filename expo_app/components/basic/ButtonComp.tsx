import React from "react";
import {
  TouchableOpacity,
  Text,
  useWindowDimensions,
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
  const windowDimensions = useWindowDimensions();

  const styles = {
    buttonCompTouchableOpacity: passStyles?.buttonCompTouchableOpacity || {},
    buttonCompText: passStyles?.buttonCompText || {},
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.buttonCompTouchableOpacity}
    >
      <Text style={styles.buttonCompText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComp;

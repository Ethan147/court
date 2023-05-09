import React from "react";
import {
  NativeSyntheticEvent,
  StyleProp,
  Text,
  TextInputFocusEventData,
  View,
  ViewStyle,
} from "react-native";
import TextInputComp from "../../basic/TextInputComp";

interface FormInputProps {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: string | false | undefined;
  secureTextEntry?: boolean;
  passStyles?: {
    formInputViewContainer?: StyleProp<ViewStyle>;
    formInputViewErrorText?: StyleProp<ViewStyle>;
    textInputCompOuterView?: StyleProp<ViewStyle>;
    textInputCompTextContainer?: StyleProp<ViewStyle>;
    textInputCompIconContainer?: StyleProp<ViewStyle>;
    textInputCompViewStyle?: StyleProp<ViewStyle>;
    textInputCompText?: StyleProp<ViewStyle>;
    textInputCompHintMessage?: StyleProp<ViewStyle>;
  };
  hintMessage?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry,
  passStyles,
  hintMessage,
}) => {
  const styles = {
    // formInput styling
    formInputViewContainer: passStyles?.formInputViewContainer || {},
    formInputViewErrorText: passStyles?.formInputViewErrorText || {},
    // textInputComp styling
    textInputCompOuterView: passStyles?.textInputCompOuterView || {},
    textInputCompTextContainer: passStyles?.textInputCompTextContainer || {},
    textInputCompIconContainer: passStyles?.textInputCompIconContainer || {},
    textInputCompViewStyle: passStyles?.textInputCompViewStyle || {},
    textInputCompText: passStyles?.textInputCompText || {},
    textInputCompHintMessage: passStyles?.textInputCompHintMessage || {},
  };

  return (
    <View style={styles.formInputViewContainer}>
      <TextInputComp
        label={label}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        error={!!error}
        secureTextEntry={secureTextEntry}
        passStyles={passStyles}
        hintMessage={hintMessage}
      />
      {error && <Text style={styles.formInputViewErrorText}>{error}</Text>}
    </View>
  );
};

export default FormInput;

import React, { useState, useEffect } from "react";
import { View, ViewStyle, Platform, StyleProp } from "react-native";
import { debounce } from "lodash";
import TextInputDropdownComp from "./TextInputDropdownComp";
// import { API_URL } from '@env';

interface AddressInputCompProps {
  onPlaceSelected: (data: any, details: any) => void;
  error?: boolean;
  passStyles?: {
    addressInputCompViewContainer?: StyleProp<ViewStyle>;
    addressInputCompGooglePlacesAutoCompete?: StyleProp<ViewStyle>;
    // textInputDropdownComp
    textInputDropdownCompOuterView: StyleProp<ViewStyle>;
    textInputDropdownCompContainer: StyleProp<ViewStyle>;
    textInputDropdownCompTouchableOpacity: StyleProp<ViewStyle>;
    textInputDropdownCompOptionText: StyleProp<ViewStyle>;
    // textInputComp
    textInputCompOuterView?: StyleProp<ViewStyle>;
    textInputCompTextContainer?: StyleProp<ViewStyle>;
    textInputCompIconContainer?: StyleProp<ViewStyle>;
    textInputCompText?: StyleProp<ViewStyle>;
  };
}

const AddressInputComp: React.FC<AddressInputCompProps> = ({
  onPlaceSelected,
  passStyles,
}) => {
  const styles = {
    addressInputCompViewContainer:
      passStyles?.addressInputCompViewContainer || {},
    addressInputCompGooglePlacesAutoCompete:
      passStyles?.addressInputCompGooglePlacesAutoCompete || {},
    textInputDropdownCompOuterView:
      passStyles?.textInputDropdownCompOuterView || {},
    textInputDropdownCompContainer:
      passStyles?.textInputDropdownCompContainer || {},
    textInputDropdownCompTouchableOpacity:
      passStyles?.textInputDropdownCompTouchableOpacity || {},
    textInputDropdownCompOptionText:
      passStyles?.textInputDropdownCompOptionText || {},
    textInputCompOuterView: passStyles?.textInputCompOuterView || {},
    textInputCompTextContainer: passStyles?.textInputCompTextContainer || {},
    textInputCompIconContainer: passStyles?.textInputCompIconContainer || {},
    textInputCompText: passStyles?.textInputCompText || {},
  };

  const passTextInputDropdownStyles = {
    textInputDropdownCompOuterView: styles.textInputDropdownCompOuterView,
    textInputDropdownCompContainer: styles.textInputDropdownCompContainer,
    textInputDropdownCompTouchableOpacity:
      styles.textInputDropdownCompTouchableOpacity,
    textInputDropdownCompOptionText: styles.textInputDropdownCompOptionText,
    textInputCompOuterView: styles.textInputCompOuterView,
    textInputCompTextContainer: styles.textInputCompTextContainer,
    textInputCompIconContainer: styles.textInputCompIconContainer,
    textInputCompText: styles.textInputCompText,
  };

  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Array<Record<string, any>>>(
    []
  );

  // const API_URL = "http://127.0.0.1:3000";
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchPlaces = (text: string) => {
    fetch(`${API_URL}/google-places`, {
      // todo URL conditional selection
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input_text: text }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSuggestions(data.predictions);
      })
      .catch((error) => console.error("Error:", error));
  };

  const debouncedFetchPlaces = debounce((text) => {
    if (isTyping) {
      fetchPlaces(text);
    }
  }, 600);

  useEffect(() => {
    if (inputValue && isTyping) {
      debouncedFetchPlaces(inputValue);
    }

    return () => debouncedFetchPlaces.cancel();
  }, [inputValue, isTyping]);

  const dropdownOptions = suggestions.map(
    (suggestion) => suggestion.description
  );

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setIsTyping(true);
  };

  const handleSelectDropdown = (selectedOption: string) => {
    setInputValue(selectedOption);
    setSuggestions([]);
    setIsTyping(false);
  };

  return (
    <TextInputDropdownComp
      label="address"
      value={inputValue}
      dropdown={dropdownOptions}
      onChangeText={handleInputChange}
      onDropdownSelect={handleSelectDropdown}
      onBlur={() => {}}
      passStyles={passTextInputDropdownStyles}
    />
  );
};

export default AddressInputComp;

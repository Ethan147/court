import React, { useState, useEffect } from "react";
import { ViewStyle, StyleProp } from "react-native";
import { debounce } from "lodash";
import TextInputDropdownComp from "./TextInputDropdownComp";

interface AddressInputCompProps {
  onPlaceSelected: (selection: Record<string, any> | null) => void;
  error?: boolean;
  passStyles?: {
    addressInputCompViewContainer?: StyleProp<ViewStyle>;
    addressInputCompGooglePlacesAutoCompete?: StyleProp<ViewStyle>;
    // textInputDropdownComp
    textInputDropdownCompOuterView: StyleProp<ViewStyle>;
    textInputDropdownCompContainer: StyleProp<ViewStyle>;
    textInputDropdownCompPressable: StyleProp<ViewStyle>;
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
    textInputDropdownCompPressable:
      passStyles?.textInputDropdownCompPressable || {},
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
    textInputDropdownCompPressable: styles.textInputDropdownCompPressable,
    textInputDropdownCompOptionText: styles.textInputDropdownCompOptionText,
    textInputCompOuterView: styles.textInputCompOuterView,
    textInputCompTextContainer: styles.textInputCompTextContainer,
    textInputCompIconContainer: styles.textInputCompIconContainer,
    textInputCompText: styles.textInputCompText,
  };

  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [selection, setSelection] = useState<Record<string, any> | null>(null);
  const [suggestions, setSuggestions] = useState<Array<Record<string, any>>>(
    []
  );

  const fetchPlaces = (text: string) => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/google-places`, {
      // stored in .env
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
  }, 500);

  useEffect(() => {
    if (inputValue && isTyping) {
      debouncedFetchPlaces(inputValue);
    }

    return () => debouncedFetchPlaces.cancel();
  }, [inputValue, isTyping]);

  useEffect(() => {
    if (!(selection?.description.toLowerCase() === inputValue.toLowerCase())) {
      setSelection(null);
      onPlaceSelected(null);
    }
  }, [selection, inputValue]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setIsTyping(true);
  };

  const handleSelectDropdown = (selectedOption: Record<string, any>) => {
    setInputValue(selectedOption.description);
    setSuggestions([]);
    setIsTyping(false);
    setSelection(selectedOption);
    onPlaceSelected(selectedOption);
  };

  return (
    <TextInputDropdownComp
      label="address"
      value={inputValue}
      dropdown={suggestions}
      onChangeText={handleInputChange}
      onDropdownSelect={handleSelectDropdown}
      onBlur={() => {}}
      passStyles={passTextInputDropdownStyles}
    />
  );
};

export default AddressInputComp;

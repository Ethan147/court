import React, { useState, useEffect } from "react";
import { View, ViewStyle, Platform, StyleProp } from "react-native";
import { debounce } from "lodash";
import TextInputDropdownComp from "./TextInputDropdownComp";

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

  const passTextInputDropdownCompStyles = {};
  const [suggestions, setSuggestions] = useState([]);

  const fetchPlaces = (text: string) => {
    fetch("http://127.0.0.1:3000/google-places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input_text: text }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSuggestions(data.predictions); // Assuming 'data.predictions' contains your suggestions
      })
      .catch((error) => console.error("Error:", error));
  };

  const debouncedFetchPlaces = debounce(fetchPlaces, 300); // 300 ms

  useEffect(() => {
    return () => debouncedFetchPlaces.cancel();
  }, []);

  if (Platform.OS === "web") {
    const [inputValue, setInputValue] = useState("");
    // const dropdownOptions = suggestions.map(suggestion => suggestion.description); // Assuming each suggestion has a 'description'
    const dropdownOptions = ["Option 1", "Option 2", "Option 3"];

    const handleInputChange = (text: string) => {
      setInputValue(text);
      debouncedFetchPlaces(text);
    };

    const handleSelectDropdown = (selectedOption: string) => {
      setInputValue(selectedOption);
      // onPlaceSelected(selectedOption); // Additional handling when an option is selected (if needed)
    };

    return (
      <TextInputDropdownComp
        label="Address"
        value={inputValue}
        dropdown={dropdownOptions}
        onChangeText={handleInputChange}
        onBlur={() => {}}
        passStyles={passTextInputDropdownStyles}
        // onDropdownSelect={handleSelectDropdown}
      />
    );
  }

  // return (
  //   <View style={passStyles?.addressInputCompViewContainer}>
  //     <GooglePlacesAutocomplete
  //       placeholder="address"
  //       onPress={(data, details = null) => {
  //         onPlaceSelected(data, details);
  //       }}
  //       query={{
  //         key: "YOUR API KEY", // todo figure out API integration etc
  //         language: "en",
  //       }}
  //       styles={{
  //         textInput: styles.addressInputCompGooglePlacesAutoCompete,
  //       }}
  //     />
  //   </View>
  // );
};

export default AddressInputComp;

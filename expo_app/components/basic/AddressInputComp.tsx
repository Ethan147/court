import React, { useState, useEffect } from "react";
import { View, ViewStyle, Platform, StyleProp } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { debounce } from "lodash";
import TextInputComp from "./TextInputComp";

interface AddressInputCompProps {
  onPlaceSelected: (data: any, details: any) => void;
  error?: boolean;
  passStyles?: {
    addressInputCompViewContainer?: StyleProp<ViewStyle>;
    addressInputCompGooglePlacesAutoCompete?: StyleProp<ViewStyle>;
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
  };

  const [suggestions, setSuggestions] = useState([]); // State to store suggestions

  const fetchPlaces = (text: string) => {
    fetch("https://your-backend-endpoint.com/google-places", {
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

  // 300 ms debounce
  const debouncedFetchPlaces = debounce(fetchPlaces, 300);

  useEffect(() => {
    // Cleanup debounce
    return () => debouncedFetchPlaces.cancel();
  }, []);

  if (Platform.OS === "web") {
    return (
      <TextInputComp
        label="first name"
        // value={formik.values.firstName}
        // onChangeText={formik.handleChange("firstName")}
        // onBlur={handleBlurOnlyIfNotEmpty("firstName")}
        // error={!!formik.touched.firstName && !!formik.errors.firstName}
        // passStyles={passTextInputTopStyles}
      />
    );
  }

  return (
    <View style={passStyles?.addressInputCompViewContainer}>
      <GooglePlacesAutocomplete
        placeholder="address"
        onPress={(data, details = null) => {
          onPlaceSelected(data, details);
        }}
        query={{
          key: "YOUR API KEY", // todo figure out API integration etc
          language: "en",
        }}
        styles={{
          textInput: styles.addressInputCompGooglePlacesAutoCompete,
        }}
      />
    </View>
  );
};

export default AddressInputComp;

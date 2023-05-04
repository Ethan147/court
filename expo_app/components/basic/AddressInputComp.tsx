import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

interface AddressInputCompProps {
  onPlaceSelected: (data: any, details: any) => void;
  error?: boolean;
  passStyles?: {
    addressInputCompViewContainer?: StyleProp<ViewStyle>;
    addressInputCompViewGooglePlacesAutoComplete?: StyleProp<ViewStyle>;
    addressInputCompGooglePlacesAutoCompete?: StyleProp<ViewStyle>;
  };
}

const AddressInputComp: React.FC<AddressInputCompProps> = ({
  onPlaceSelected,
  error,
  passStyles,
}) => {
  const styles = {
    addressInputCompViewContainer:
      passStyles?.addressInputCompViewContainer || {},
    addressInputCompViewGooglePlacesAutoComplete:
      passStyles?.addressInputCompViewGooglePlacesAutoComplete || {},
    addressInputCompGooglePlacesAutoCompete:
      passStyles?.addressInputCompGooglePlacesAutoCompete || {},
  };

  return (
    <View style={styles.addressInputCompViewContainer}>
      <View style={styles.addressInputCompViewGooglePlacesAutoComplete}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            onPlaceSelected(data, details);
          }}
          query={{
            key: "YOUR API KEY", // todo figure out API integration etc
            language: "en",
          }}
        />
      </View>
    </View>
  );
};

export default AddressInputComp;

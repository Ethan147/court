import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

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

  return (
    <View style={styles.addressInputCompViewContainer}>
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

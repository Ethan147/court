import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import AcceptTerms from "../../../components/registerForm/elements/AcceptTerms";

const mockNavigation = { navigate: jest.fn() };

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => mockNavigation,
}));

jest.mock("react-native-google-places-autocomplete", () => ({
  GooglePlacesAutocomplete: jest.fn(() => null),
}));

describe("AcceptTerms", () => {
  it("renders correctly", () => {
    const { getByText } = render(<AcceptTerms />);
    const linkElement = getByText(/Agree to Terms and Conditions/i);
    expect(linkElement).toBeTruthy();
  });

  it("calls the onPress prop and navigation when the terms and conditions link is pressed", () => {
    const onPress = jest.fn();

    // Set up the behavior of the mock function
    mockNavigation.navigate.mockReturnValue(null);

    const { getByText } = render(<AcceptTerms onPress={onPress} />);
    const termsLink = getByText(/Agree to Terms and Conditions/i);

    fireEvent.press(termsLink);

    expect(onPress).toHaveBeenCalled();
    expect(mockNavigation.navigate).toHaveBeenCalledWith("TermsAndConditions");
  });

  it("toggles the switch when clicked", () => {
    const { getByTestId } = render(<AcceptTerms />);
    const switchComponent = getByTestId("switch");

    fireEvent(switchComponent, "onValueChange", true);
    expect(switchComponent.props.value).toBe(true);

    fireEvent(switchComponent, "onValueChange", false);
    expect(switchComponent.props.value).toBe(false);

    fireEvent(switchComponent, "onValueChange", true);
    expect(switchComponent.props.value).toBe(true);
  });

  it("snapshot", () => {
    const tree = render(<AcceptTerms />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

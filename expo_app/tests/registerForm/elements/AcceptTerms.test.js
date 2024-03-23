import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import AcceptTerms from "../../../components/registerForm/elements/AcceptTerms";

const mockNavigation = { navigate: jest.fn() };

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => mockNavigation,
}));

describe("AcceptTerms", () => {
  it("renders correctly", () => {
    const { getByText } = render(<AcceptTerms />);
    const linkElement = getByText(/Agree to Terms and Conditions/i);
    expect(linkElement).toBeTruthy();
  });

  it("terms navigation", () => {
    const { getByText } = render(
      <AcceptTerms defaultTermsState={false} onPress={() => {}} />
    );
    const termsLink = getByText(/Agree to Terms and Conditions/i);
    fireEvent.press(termsLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith("TermsAndConditions");
  });

  it("toggles the switch when clicked", () => {
    const { getByTestId } = render(<AcceptTerms onPress={() => {}} />);
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

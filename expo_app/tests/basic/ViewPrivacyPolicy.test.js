import { useNavigation } from "@react-navigation/native";
import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import ViewPrivacyPolicy from "../../components/basic/ViewPrivacyPolicy";

// Mock out the useNavigation hook
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(),
}));

describe("ViewPrivacyPolicy", () => {
  it("renders correctly", () => {
    const mockNavigation = { navigate: jest.fn() };
    useNavigation.mockReturnValue(mockNavigation);

    const { getByText } = render(<ViewPrivacyPolicy />);

    expect(getByText("View Privacy Policy")).toBeTruthy();
  });

  it("calls navigation on press", () => {
    const mockNavigation = { navigate: jest.fn() };
    useNavigation.mockReturnValue(mockNavigation);

    const { getByText } = render(<ViewPrivacyPolicy />);
    const policyLink = getByText("View Privacy Policy");

    fireEvent.press(policyLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith("PrivacyPolicy");
  });

  it("snapshot", () => {
    const tree = render(<ViewPrivacyPolicy />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

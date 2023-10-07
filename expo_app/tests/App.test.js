import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";

import App from "../App";

const mockNavigation = {
  navigate: jest.fn(),
  setOptions: jest.fn(),
};

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => mockNavigation,
}));

jest.mock("../components/basic/AddressInputComp", () => {
  return function MockedComponent() {
    return null;
  };
});

describe("App Navigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(<App />);
    expect(getByText("Submit")).toBeTruthy();
  });

  it("navigates to terms and conditions when 'Agree to terms and conditions' is clicked", async () => {
    const { getByText } = render(<App />);
    const termsButton = getByText("Agree to Terms and Conditions");
    fireEvent.press(termsButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith(
        "TermsAndConditions"
      );
    });
  });

  it("navigates to privacy policy when 'View Privacy Policy' is clicked", async () => {
    const { getByText } = render(<App />);
    const termsButton = getByText("View Privacy Policy");
    fireEvent.press(termsButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith("PrivacyPolicy");
    });
  });

  it("snapshot", () => {
    const tree = render(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

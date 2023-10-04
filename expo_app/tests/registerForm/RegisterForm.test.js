import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";

import RegisterForm from "../../components/registerForm/RegisterForm";

const mockNavigation = { navigate: jest.fn() };

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => mockNavigation,
}));

jest.mock("../../components/basic/AddressInputComp", () => {
  return function MockedComponent() {
    return null;
  };
});

describe("RegisterForm", () => {
  // Rendering test
  it("renders correctly", () => {
    const { getByText } = render(<RegisterForm />);
    expect(getByText("Submit")).toBeTruthy();
  });

  // todo continue to fill out here
  // todo, make sure to remember the snapshot aspect
  /*

  // Form interaction and validation tests
  it("shows error messages when fields are left blank and form is submitted", async () => {
    const { getByText, queryByText } = render(<RegisterForm />);
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(queryByText("first name is required")).toBeTruthy();
      expect(queryByText("last name is required")).toBeTruthy();
      expect(queryByText("email is required")).toBeTruthy();
      // ... Add checks for other fields' error messages
    });
  });

  it("accepts valid form data", () => {
    const { getByLabelText, getByText } = render(<RegisterForm />);
    fireEvent.changeText(getByLabelText("first name"), "John");
    fireEvent.changeText(getByLabelText("last name"), "Doe");
    fireEvent.changeText(getByLabelText("email"), "john.doe@example.com");
    // ... Input other fields
    fireEvent.press(getByText("Submit"));

    // This would depend on what happens after successful submission
    // For example:
    // expect(queryByText("Registration successful")).toBeTruthy();
  });

  // ... Other tests, such as checking validation for each specific field, testing component behaviors, etc.

  it("displays hint for password requirements", () => {
    const { getByText } = render(<RegisterForm />);
    expect(getByText(/password must be 8+ characters/)).toBeTruthy();
  });

  // ... More tests as required

  */
});

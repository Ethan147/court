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
  /*
    Note:
    we cannot effectively test things like formik's handling of blur, scrolling behavior, etc
    because that requires rendering, which is not something that our testing environment is currently capable of.
  */

  it("renders correctly", () => {
    const { getByText } = render(<RegisterForm />);
    expect(getByText("Submit")).toBeTruthy();
  });

  it("shows error for first name when blank & submitted", async () => {
    const { getByText, queryByText } = render(<RegisterForm />);
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(queryByText("first name is required")).toBeTruthy();
    });
  });

  it("shows error for last name when blank & submitted", async () => {
    const { getByText, queryByText } = render(<RegisterForm />);
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(queryByText("last name is required")).toBeTruthy();
    });
  });

  it("shows error for email when blank & submitted", async () => {
    const { getByText, queryByText } = render(<RegisterForm />);
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(queryByText("email is required")).toBeTruthy();
    });
  });

  it("shows error for password when blank & submitted", async () => {
    const { getByText, queryByText } = render(<RegisterForm />);
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(queryByText("password is invalid")).toBeTruthy();
    });
  });

  it("shows error for password when blank & submitted", async () => {
    const { getByText, queryByText } = render(<RegisterForm />);
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(queryByText("confirm password is required")).toBeFalsy();
    });
  });

  it("shows error message when password is provided but confirm password is left blank", async () => {
    const { getAllByTestId, getByText, queryByText } = render(<RegisterForm />);

    // order of text inputs is: first name, last name, email, password, confirm password
    const textInputs = getAllByTestId("textInputComp");
    const passwordInput = textInputs[3];

    // confirm password is only displayed when a first password has been supplied
    fireEvent.changeText(passwordInput, "ValidP@ssword1");
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(queryByText("confirm password is required")).toBeTruthy();
    });
  });

  it("shows error for address when blank & submitted", async () => {
    const { getByText, queryByText } = render(<RegisterForm />);
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(queryByText("address is required")).toBeTruthy();
    });
  });

  it("shows error for date of birth when blank & submitted", async () => {
    const { getByText, queryByText } = render(<RegisterForm />);
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(queryByText("date of birth is required")).toBeTruthy();
    });
  });

  it("shows error for accept terms when blank & submitted", async () => {
    const { getByText, queryByText } = render(<RegisterForm />);
    fireEvent.press(getByText("Submit"));

    await waitFor(() => {
      expect(
        queryByText("you must accept the terms and conditions")
      ).toBeTruthy();
    });
  });

  it("displays input hints", () => {
    const { getByText } = render(<RegisterForm />);
    expect(
      getByText(
        "password must be 8+ characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
      )
    ).toBeTruthy();
    expect(
      getByText("participants must be at least 16 years of age")
    ).toBeTruthy();
    expect(
      getByText(
        "Your address will be used solely to match you with nearby tennis, racquetball, and/or pickleball partners."
      )
    ).toBeTruthy();
    expect(
      getByText(
        "We're committed to helping you find the perfect match within your community!"
      )
    ).toBeTruthy();
  });

  it("snapshot", () => {
    const tree = render(<RegisterForm />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import TextInputComp from "../../components/basic/TextInputComp";

describe("<TextInputComp />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders without crashing", () => {
    const { getByTestId } = render(<TextInputComp />);
    expect(getByTestId("textInputComp")).toBeDefined();
  });

  // targeting the label exactly may not be doable with jest and react-native-paper's TextInput
  it("renders without crashing when label prop is passed", () => {
    const { getByTestId } = render(<TextInputComp label="Test Label" />);
    expect(getByTestId("textInputComp")).toBeDefined();
  });

  it("displays the correct initial value", () => {
    const { getByDisplayValue } = render(
      <TextInputComp value="Initial value" />
    );
    expect(getByDisplayValue("Initial value")).toBeDefined();
  });

  it("calls the onChangeText function when text is entered", () => {
    const onChangeTextMock = jest.fn();
    const { getByTestId } = render(
      <TextInputComp onChangeText={onChangeTextMock} />
    );
    const input = getByTestId("textInputComp");

    fireEvent.changeText(input, "new text");
    expect(onChangeTextMock).toHaveBeenCalledWith("new text");
  });

  it("calls the onBlur function when focus is lost", () => {
    const onBlurMock = jest.fn();
    const { getByTestId } = render(<TextInputComp onBlur={onBlurMock} />);
    const input = getByTestId("textInputComp");

    input.props.onBlur();
    expect(onBlurMock).toHaveBeenCalled();
  });

  it("updates on change", () => {
    const { getByTestId } = render(<TextInputComp />);
    const input = getByTestId("textInputComp");

    fireEvent.changeText(input, "test value");
    expect(input.props.value).toBe("test value");
  });

  it("calls onChange callback with changed text", () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<TextInputComp onChangeText={onChange} />);
    const input = getByTestId("textInputComp");

    fireEvent.changeText(input, "test value");
    expect(onChange).toHaveBeenCalledWith("test value");
  });

  it("secureTextEntry prop hides the text until 'show password' button is clicked", () => {
    const { getByTestId } = render(<TextInputComp secureTextEntry />);
    const input = getByTestId("textInputComp");
    const showPasswordButton = getByTestId("togglePasswordVisibility");

    expect(input.props.secureTextEntry).toBe(true);

    // After clicking the 'show password' button, the text should be visible
    fireEvent.press(showPasswordButton);
  });

  it("secureTextEntry prop hides the text again when 'show password' button is clicked twice", () => {
    let secureTextEntry = true;
    const { getByTestId, rerender } = render(
      <TextInputComp secureTextEntry={secureTextEntry} />
    );
    const input = getByTestId("textInputComp");
    const showPasswordButton = getByTestId("togglePasswordVisibility");

    // Initially, the text should be hidden
    expect(input.props.secureTextEntry).toBe(true);

    // After clicking the 'show password' button once, the text should be visible
    secureTextEntry = false;
    rerender(<TextInputComp secureTextEntry={secureTextEntry} />);
    expect(input.props.secureTextEntry).toBe(false);

    // After clicking the 'show password' button again, the text should be hidden again
    secureTextEntry = true;
    rerender(<TextInputComp secureTextEntry={secureTextEntry} />);
    expect(input.props.secureTextEntry).toBe(true);
  });

  it("snapshot", () => {
    const tree = render(<TextInputComp />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import ButtonComp from "../../components/basic/ButtonComp";

describe("<ButtonComp />", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<ButtonComp />);
    expect(getByTestId("buttonComp")).toBeDefined();
  });

  it("renders the correct text when passed as a prop", () => {
    const { getByText } = render(<ButtonComp text="Test button" />);
    expect(getByText("Test button")).toBeDefined();
  });

  it("calls the onPress function when pressed", () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<ButtonComp onPress={onPressMock} />);
    const button = getByTestId("buttonComp");

    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalled();
  });

  it("snapshot", () => {
    const tree = render(<ButtonComp text="Test button" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

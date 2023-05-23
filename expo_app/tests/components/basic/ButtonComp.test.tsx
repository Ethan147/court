import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ButtonComp from "../../../components/basic/ButtonComp";

test("button fires onPress event and displays correct text", () => {
  const onPressMock = jest.fn();
  const buttonText = "Test Button";

  const { getByText } = render(
    <ButtonComp text={buttonText} onPress={onPressMock} />
  );

  const button = getByText(buttonText);
  fireEvent.press(button);

  expect(button).toBeDefined();
  expect(onPressMock).toHaveBeenCalled();
});

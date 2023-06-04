import { render, fireEvent, cleanup } from "@testing-library/react-native";
import React from "react";

import ToggleButtonGroupComp from "../../components/basic/ToggleButtonGroupComp";

afterEach(cleanup); // Unmounts React trees to clean up between tests

describe("<ToggleButtonGroupComp />", () => {
  it("renders without crashing", () => {
    render(<ToggleButtonGroupComp buttons={[]} label="Test Label" />);
  });

  it("renders zero buttons when zero buttons are passed in", () => {
    const buttons = [];
    const { queryAllByTestId } = render(
      <ToggleButtonGroupComp buttons={buttons} label="Test Label" />
    );

    const renderedButtons = queryAllByTestId("button");
    expect(renderedButtons).toHaveLength(0);
  });

  it("renders three buttons when three buttons are passed in", () => {
    const buttons = ["button 1", "button 2", "button 3"];
    const { getAllByTestId } = render(
      <ToggleButtonGroupComp buttons={buttons} label="Test Label" />
    );

    const renderedButtons = getAllByTestId("button");
    expect(renderedButtons).toHaveLength(buttons.length);
  });

  it("renders nine buttons when nine buttons are passed in", () => {
    const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const { getAllByTestId } = render(
      <ToggleButtonGroupComp buttons={buttons} label="Test Label" />
    );

    const renderedButtons = getAllByTestId("button");
    expect(renderedButtons).toHaveLength(buttons.length);
  });

  it("isSelected returns true only if one of the buttons is selected", () => {
    const buttons = ["button 1", "button 2", "button 3"];
    const testStyles = {
      toggleButtonGroupCompButtonTextSelected: {
        color: "blue",
      },
    };
    const { getByText } = render(
      <ToggleButtonGroupComp
        buttons={buttons}
        label="Test Label"
        passStyles={testStyles}
      />
    );
    fireEvent.press(getByText("button 2"));

    expect(getByText("button 1")).not.toHaveStyle(
      testStyles.toggleButtonGroupCompButtonTextSelected
    );
    expect(getByText("button 2")).toHaveStyle(
      testStyles.toggleButtonGroupCompButtonTextSelected
    );
    expect(getByText("button 3")).not.toHaveStyle(
      testStyles.toggleButtonGroupCompButtonTextSelected
    );
  });

  it("sets selectedValue when a button is pressed", () => {
    const buttons = ["button 1", "button 2", "button 3"];
    const onValueChange = jest.fn();
    const { getByText } = render(
      <ToggleButtonGroupComp
        buttons={buttons}
        label="Test Label"
        onValueChange={onValueChange}
      />
    );
    fireEvent.press(getByText("button 1"));
    expect(onValueChange).toHaveBeenCalledWith("button 1");
  });

  it("renders the provided label", () => {
    const buttons = ["button 1", "button 2", "button 3"];
    const label = "Test Label";
    const { getByText } = render(
      <ToggleButtonGroupComp buttons={buttons} label={label} />
    );
    expect(getByText(label)).toBeTruthy();
  });

  it("matches the snapshot", () => {
    const buttons = ["button 1", "button 2", "button 3"];
    const tree = render(
      <ToggleButtonGroupComp buttons={buttons} label="Test Label" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

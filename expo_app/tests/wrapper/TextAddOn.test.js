import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import TextAddOn from "../../components/wrapper/TextAddOn";

describe("TextAddOn", () => {
  const TestComponent = <Text>Test Component</Text>;

  it("renders the component and text value correctly", () => {
    const { getByText } = render(
      <TextAddOn component={TestComponent} value="Test Value" display={true} />
    );
    expect(getByText("Test Component")).toBeTruthy();
    expect(getByText("Test Value")).toBeTruthy();
  });

  it("does not render the text value when 'display' prop is false", () => {
    const { getByText, queryByText } = render(
      <TextAddOn component={TestComponent} value="Test Value" display={false} />
    );
    expect(getByText("Test Component")).toBeTruthy();
    expect(queryByText("Test Value")).toBeNull();
  });

  it("snapshot", () => {
    const tree = render(<TextAddOn />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

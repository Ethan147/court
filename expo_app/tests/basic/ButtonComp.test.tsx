import React from "react";
import { render } from "@testing-library/react-native";

import ButtonComp from "../../components/basic/ButtonComp";

describe("<ButtonComp />", () => {
  it("has 1 child", () => {
    const { getByTestId } = render(<ButtonComp />);
    expect(getByTestId("buttonComp")).toBeDefined();
  });
});

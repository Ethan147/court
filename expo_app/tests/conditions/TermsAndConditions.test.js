import { render } from "@testing-library/react-native";
import React from "react";

import TermsAndConditions from "../../components/conditions/TermsAndConditions";

describe("TermsAndConditions", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<TermsAndConditions />);
    expect(getByTestId("terms-and-conditions-scroll-view")).toBeTruthy();
  });

  it("displays the Terms and Conditions text", () => {
    const { getByText } = render(<TermsAndConditions />);
    const termsAndConditionsText = getByText(
      /1\. Introduction\s+Welcome to .*! This app is designed to help you schedule games across singles and doubles/i
    );
    expect(termsAndConditionsText).toBeTruthy();
  });

  it("snapshot", () => {
    const tree = render(<TermsAndConditions />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

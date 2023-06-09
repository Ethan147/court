import { render } from "@testing-library/react-native";
import React from "react";

import PrivacyPolicy from "../../components/conditions/PrivacyPolicy";

describe("PrivacyPolicy", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<PrivacyPolicy />);
    expect(getByTestId("privacy-policy-scroll-view")).toBeTruthy();
  });

  it("displays the Privacy Policy text", () => {
    const { getByText } = render(<PrivacyPolicy />);
    const privacyPolicyText = getByText(
      /1\. Introduction\s+We value your privacy and are committed to protecting your personal information\./i
    );
    expect(privacyPolicyText).toBeTruthy();
  });

  it("snapshot", () => {
    const tree = render(<PrivacyPolicy />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

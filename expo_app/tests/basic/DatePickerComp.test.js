import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import DatePickerComp from "../../components/basic/DatePickerComp";

jest.mock("react-native-modal-datetime-picker");

describe("<DatePickerComp />", () => {
  const onDateChangeMock = jest.fn();
  const onBlurMock = jest.fn();

  const props = {
    label: "Test Date",
    webFormatHint: "(mm/dd/yyyy)",
    value: "01/01/2022",
    onDateChange: onDateChangeMock,
    onBlur: onBlurMock,
    error: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const originalError = console.error;

    console.error = jest.fn(); // mock console.error
    render(<DatePickerComp {...props} />);
    console.error = originalError; // restore console.error
  });

  // TODO: seems like I can't backspace through the first entered character, need to revisit
  // TODO: add text (and update code) so you can't enter things like 12/12/12120000 (currently allowed)
  describe("Web Platform", () => {
    const originalWarning = console.warn;
    const originalError = console.error;

    beforeAll(() => {
      Platform.OS = "web";

      // mock console warn & error
      console.warn = jest.fn();
      console.error = jest.fn();
    });

    afterAll(() => {
      // restore console
      console.warn = originalWarning;
      console.error = originalError;
    });

    it("displays the passed value", () => {
      const { getByDisplayValue } = render(<DatePickerComp {...props} />);
      expect(getByDisplayValue("01/01/2022")).toBeDefined();
    });

    it("calls onDateChange with the correct formatted date", () => {
      const { getByDisplayValue } = render(<DatePickerComp {...props} />);
      const input = getByDisplayValue("01/01/2022");
      fireEvent.changeText(input, "20012003");
      expect(onDateChangeMock).toHaveBeenCalledWith("20/01/2003");
    });

    test("handleWebDateChange should only allow numeric characters", () => {
      const { getByTestId, queryByDisplayValue } = render(
        <DatePickerComp
          label="Test"
          webFormatHint="mm/dd/yyyy"
          value=""
          onDateChange={onDateChangeMock}
        />
      );

      const input = getByTestId("textInputComp");

      // non-numeric values will not be displayed on the input
      // non-valid entries will not call onDateChangeMock
      fireEvent.changeText(input, "march");
      expect(queryByDisplayValue("march")).toBeNull();
      expect(onDateChangeMock).not.toHaveBeenCalled();

      // special-characters will not be displayed on the input
      // non-valid entries will not call onDateChangeMock
      fireEvent.changeText(input, "!");
      expect(queryByDisplayValue("!")).toBeNull();
      expect(onDateChangeMock).not.toHaveBeenCalled();

      // numeric values will be displayed on the input
      // each valid adition will call
      fireEvent.changeText(input, "1");
      expect(onDateChangeMock).toHaveBeenCalledWith("1");
      fireEvent.changeText(input, "2");
      expect(onDateChangeMock).toHaveBeenCalledWith("2");
    });

    test("handleWebDateChange should add slashes at the correct positions", () => {
      const { getByTestId } = render(
        <DatePickerComp
          label="Test"
          webFormatHint="mm/dd/yyyy"
          value=""
          onDateChange={onDateChangeMock}
        />
      );

      const input = getByTestId("textInputComp");

      fireEvent.changeText(input, "0");
      expect(onDateChangeMock).toHaveBeenCalledWith("0");

      fireEvent.changeText(input, "01");
      expect(onDateChangeMock).toHaveBeenCalledWith("01/");

      fireEvent.changeText(input, "0101");
      expect(onDateChangeMock).toHaveBeenCalledWith("01/01/");

      fireEvent.changeText(input, "01012023");
      expect(onDateChangeMock).toHaveBeenCalledWith("01/01/2023");
    });
  });

  /*
  describe('Non-web Platforms', () => {
    beforeAll(() => {
      Platform.OS = 'ios'; // or 'android'
    });

    it('opens DateTimePickerModal on button press', () => {
      const { getByText } = render(<DatePickerComp {...props} />);
      const button = getByText('select Test Date');
      fireEvent.press(button);
      expect(DateTimePickerModal).toBeVisible();
    });

    it('calls handleConfirm when date is selected', () => {
      const { getByText } = render(<DatePickerComp {...props} />);
      const button = getByText('select Test Date');
      fireEvent.press(button);
      // you can mock the confirm action of the DateTimePickerModal here
      // but as of the last update, there's no official way to do it using '@testing-library/react-native'
    });

    // More non-web tests go here...
  });
  */
});

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

  /*
  describe('Web Platform', () => {
    beforeAll(() => {
      Platform.OS = 'web';
    });

    it('displays the passed value', () => {
      const { getByDisplayValue } = render(<DatePickerComp {...props} />);
      expect(getByDisplayValue('01/01/2022')).toBeDefined();
    });

    it('calls onDateChange with the correct formatted date', () => {
      const { getByDisplayValue } = render(<DatePickerComp {...props} />);
      const input = getByDisplayValue('01/01/2022');
      fireEvent.changeText(input, '20012003');
      expect(onDateChangeMock).toHaveBeenCalledWith('20/01/2003');
    });

    // More web tests go here...
  });
  */

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

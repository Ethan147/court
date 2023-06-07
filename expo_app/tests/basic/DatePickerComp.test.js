import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import { Platform } from "react-native";

import DatePickerComp from "../../components/basic/DatePickerComp";

// TODO: unsure if it's possible to test the date-modal aspect of this component
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

  it("snapshot", () => {
    const tree = render(<DatePickerComp {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

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
      const component = render(
        <DatePickerComp
          label="Test"
          webFormatHint="mm/dd/yyyy"
          value=""
          onDateChange={onDateChangeMock}
        />
      );

      let input = component.getByTestId("textInputComp");

      fireEvent.changeText(input, "0");
      expect(onDateChangeMock).toHaveBeenCalledWith("0");

      fireEvent.changeText(input, "01");
      expect(onDateChangeMock).toHaveBeenCalledWith("01/");

      fireEvent.changeText(input, "0101");
      expect(onDateChangeMock).toHaveBeenCalledWith("01/01/");

      fireEvent.changeText(input, "01012023");
      expect(onDateChangeMock).toHaveBeenCalledWith("01/01/2023");

      fireEvent.changeText(input, "0101202311");
      expect(onDateChangeMock).toHaveBeenCalledWith("01/01/2023");
    });

    test("handleWebDateChange should allow backspacing through the first digit", () => {
      const onDateChange = jest.fn();

      const { getByTestId } = render(
        <DatePickerComp
          label="Test"
          webFormatHint="mm/dd/yyyy"
          value=""
          onDateChange={onDateChange}
        />
      );

      const input = getByTestId("textInputComp");

      fireEvent.changeText(input, "01012023");
      expect(onDateChange).toHaveBeenCalledWith("01/01/2023");

      // Start backspacing
      fireEvent.changeText(input, "0101202");
      expect(onDateChange).toHaveBeenCalledWith("01/01/202");

      fireEvent.changeText(input, "010120");
      expect(onDateChange).toHaveBeenCalledWith("01/01/20");

      // ... continue backspacing ...

      fireEvent.changeText(input, "0");
      expect(onDateChange).toHaveBeenCalledWith("0");

      fireEvent.changeText(input, ""); // Backspace through the first digit
      expect(onDateChange).toHaveBeenCalledWith("");
    });
  });
});

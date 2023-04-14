import { DefaultTheme } from "react-native-paper";
import colors from "./colors";

/*
Future thematic elements that may go in here:
- typography: font family, font size, line height, font weight
- spacing: margins, padding, border radius
- breakpoints
- component specific styling
- animations: duration, easing functions
*/
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    text: colors.text,
    background: colors.background,
    error: colors.error,
  },
};

export default theme;

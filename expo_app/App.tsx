import React from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-native-paper";
import theme from "./utils/theme";
import RegisterForm from "./components/registerForm/RegisterForm";
import TermsAndConditions from "./components/conditions/TermsAndConditions";
import PrivacyPolicy from "./components/conditions/PrivacyPolicy";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

require("dotenv").config();

const Stack = createNativeStackNavigator();

export default function App() {
  const windowDimensions = useWindowDimensions();

  const styles = StyleSheet.create({
    termsView: {
      ...Platform.select({
        web: {
          padding: windowDimensions.width * 0.08,
        },
        ios: {
          paddingVertical: wp("8%"),
        },
        android: {
          // todo
        },
      }),
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    termsText: {
      fontSize: theme.font.size.small,
      color: theme.colors.text,
    },
  });

  const disclaimerStyles = {
    privacyPolicyScrollView: styles.termsView,
    privacyPolicyText: styles.termsText,
  };

  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="RegisterForm">
          <Stack.Screen
            name="RegisterForm"
            component={RegisterForm}
            options={{ title: "Register" }}
          />
          <Stack.Screen
            name="TermsAndConditions"
            options={{ title: "Terms and Conditions" }}
            children={() => (
              <TermsAndConditions passStyles={disclaimerStyles} />
            )}
          />
          <Stack.Screen
            name="PrivacyPolicy"
            options={{ title: "Privacy Policy" }}
            children={() => <PrivacyPolicy passStyles={disclaimerStyles} />}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

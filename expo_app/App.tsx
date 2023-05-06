import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-native-paper";
import theme from "./utils/theme";
import RegisterForm from "./components/registerForm/RegisterForm";
import TermsAndConditions from "./components/conditions/TermsAndConditions";
import PrivacyPolicy from "./components/conditions/PrivacyPolicy";

const Stack = createNativeStackNavigator();

export default function App() {
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
            component={TermsAndConditions}
            options={{ title: "Terms and Conditions" }}
          />
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{ title: "Privacy Policy" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

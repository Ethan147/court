import React, { useState } from "react";
import { Provider } from "react-native-paper";
import theme from "./utils/theme";
import RegisterForm from "./components/registerForm/RegisterForm";

export default function App() {
  return (
    <Provider theme={theme}>
      <RegisterForm />
    </Provider>
  );
}

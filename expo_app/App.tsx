import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { Formik, Form, useFormik, FormikProvider } from "formik";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  error: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});

const MyForm = () => {
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  return (
    <FormikProvider value={formik}>
      <View>
        <Text>some form</Text>
      </View>
    </FormikProvider>
  );
};

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <MyForm />
      </View>
    </PaperProvider>
  );
}

import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Button,
  Provider as PaperProvider,
  TextInput,
} from "react-native-paper";
import { Formik, useFormik, FormikProvider } from "formik";
import * as Yup from "yup";

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

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
});

const MyForm = () => {
  const formik = useFormik({
    initialValues: { first_name: "" },
    validationSchema,
    onSubmit: (values) => {
      console.log("Submitted values:", values);
    },
  });

  return (
    <FormikProvider value={formik}>
      <View>
        <TextInput
          label="First Name"
          value={formik.values.first_name}
          onChangeText={formik.handleChange("first_name")}
          onBlur={formik.handleBlur("first_name")}
          error={!!formik.touched.first_name && !!formik.errors.first_name}
          autoCompleteType={undefined}
        />
        {formik.touched.first_name && formik.errors.first_name ? (
          <Text style={styles.error}>{formik.errors.first_name}</Text>
        ) : null}
      </View>
      <Button mode="contained" onPress={formik.handleSubmit}>
        Submit
      </Button>
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

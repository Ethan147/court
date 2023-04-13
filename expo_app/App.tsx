import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Button,
  Provider as PaperProvider,
  TextInput,
} from "react-native-paper";
import { Formik, useFormik, FormikProvider } from "formik";
import * as Yup from "yup";

import colors from "./utils/colors";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const baseFormElem = {
  paddingVertical: wp("1%"),
  width: wp("80%"),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginBottom: 10,
  },
  input: {
    ...baseFormElem,
  },
  button: {
    ...baseFormElem,
    color: colors.primary,
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
      <View style={styles.input}>
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
      <View style={styles.button}>
        <Button
          mode="contained"
          onPress={formik.handleSubmit}
          color={styles.button.color}
        >
          Submit
        </Button>
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

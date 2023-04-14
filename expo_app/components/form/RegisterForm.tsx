import React, { useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Text,
} from "react-native";
import TextInputComp from "./basic/TextInputComp";

import { Formik, useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import colors from "../../utils/colors";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
});

const RegisterForm = () => {
  const windowDimensions = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    error: {
      ...Platform.select({
        web: {
          // todo
        },
        ios: {
          // todd
        },
        android: {
          // todo
        },
      }),
      color: colors.error,
    },
  });

  const formik = useFormik({
    initialValues: { firstName: "" },
    validationSchema,
    onSubmit: (values) => {
      console.log("Submitted values:", values);
    },
  });

  return (
    <FormikProvider value={formik}>
      <View style={styles.container}>
        <TextInputComp
          label="First Name"
          value={formik.values.firstName}
          onChangeText={formik.handleChange("firstName")}
          onBlur={formik.handleBlur("firstName")}
          errors={!!formik.touched.firstName && !!formik.errors.firstName}
        />
      </View>
      {formik.touched.firstName && formik.errors.firstName ? (
        <Text style={styles.error}>{formik.errors.firstName}</Text>
      ) : null}
    </FormikProvider>
  );
};

export default RegisterForm;

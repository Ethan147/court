import React, { useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Text,
  Keyboard,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Formik, useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import colors from "../../utils/colors";
import TextInputComp from "./basic/TextInputComp";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(
      /^[a-zA-Z]+$/,
      "first name should only contain alphabetic characters"
    )
    .required("first name is required"),
  lastName: Yup.string()
    .matches(
      /^[a-zA-Z]+$/,
      "last name should only contain alphabetic characters"
    )
    .required("last name is required"),
  email: Yup.string()
    .email("email must be a valid email address")
    .required("email is required"),
});

const RegisterForm = () => {
  const windowDimensions = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    inputContainer: {
      ...Platform.select({
        web: {
          marginBottom: windowDimensions.width * 0.02,
          width: windowDimensions.width * 0.8,
        },
        ios: {
          marginBottom: wp("2%"),
          width: wp("80%"),
        },
        android: {
          // todo
        },
      }),
    },
    error: {
      color: colors.error,
    },
  });

  const formik = useFormik({
    initialValues: { firstName: "", lastName: "", email: "" },
    validationSchema,
    onSubmit: (values) => {
      console.log("Submitted values:", values);
    },
  });

  return (
    <FormikProvider value={formik}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="never"
      >
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInputComp
              label="first name"
              value={formik.values.firstName}
              onChangeText={formik.handleChange("firstName")}
              onBlur={formik.handleBlur("firstName")}
              error={!!formik.touched.firstName && !!formik.errors.firstName}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <Text style={styles.error}>{formik.errors.firstName}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInputComp
              label="last name"
              value={formik.values.lastName}
              onChangeText={formik.handleChange("lastName")}
              onBlur={formik.handleBlur("lastName")}
              error={!!formik.touched.lastName && !!formik.errors.lastName}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <Text style={styles.error}>{formik.errors.lastName}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInputComp
              label="email"
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              error={!!formik.touched.email && !!formik.errors.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <Text style={styles.error}>{formik.errors.email}</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </FormikProvider>
  );
};

export default RegisterForm;

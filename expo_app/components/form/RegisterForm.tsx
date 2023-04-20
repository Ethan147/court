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
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../utils/colors";
import TextInputComp from "./basic/TextInputComp";
import ToggleButtonGroupComp from "./basic/ToggleButtonGroupComp";
import theme from "../../utils/theme";

const badPassText =
  "password must be 8+ characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character";

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
  password: Yup.string()
    .min(8, badPassText)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      badPassText
    )
    .required("password is required"),
  gender: Yup.string()
    .oneOf(
      ["male", "female", "other", "prefer_not_to_say"],
      "please select a gender"
    )
    .required("gender is required"),
  age: Yup.number()
    .min(14, "must be at least 14 years old")
    .required("age is required"),
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
        },
        ios: {
          marginBottom: wp("2%"),
          width: wp("80%"),
        },
        android: {
          // todo
        },
      }),
      justifyContent: "center",
      alignItems: "center",
    },
    error: {
      ...Platform.select({
        web: {
          width: windowDimensions.width * 0.6,
        },
        ios: {
          width: wp("60%"),
        },
        android: {
          // todo
        },
      }),
      color: colors.error,
      // alignSelf: 'flex-start', -- TODO: must left-orient w/ space matching
      fontSize: theme.font.size.small,
    },
    backgroundGradient: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    // TextInputComp styling
    textInputCompContainer: {
      ...Platform.select({
        web: {
          width: windowDimensions.width * 0.65,
        },
        ios: {
          width: wp("65%"),
        },
        android: {
          // todo
        },
      }),
      borderColor: colors.text,
      selectionColor: colors.primary,
      backgroundColor: colors.setting,
    },
    textInputCompIconContainer: {
      ...Platform.select({
        web: {
          right: windowDimensions.width * 0.017,
        },
        ios: {
          right: wp("1.7%"),
        },
        android: {
          // todo
        },
      }),
      position: "absolute",
      top: 0,
      bottom: 0,
      justifyContent: "center",
    },
    textInputCompViewStyle: {
      flexDirection: "row",
      alignItems: "center",
    },
    textInputCompText: {
      ...Platform.select({
        web: {
          width: windowDimensions.width * 0.65,
        },
        ios: {
          width: wp("65%"),
        },
        android: {
          // todo
        },
      }),
      borderColor: colors.text,
      selectionColor: colors.primary,
      backgroundColor: colors.setting,
    },
  });

  const passTextInputCompStyles = {
    textInputCompContainer: styles.textInputCompContainer,
    textInputCompIconContainer: styles.textInputCompIconContainer,
    textInputCompViewStyle: styles.textInputCompViewStyle,
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      age: "",
    },
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
        <LinearGradient
          colors={[colors.primary, colors.background]}
          style={styles.backgroundGradient}
        >
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInputComp
                label="first name"
                value={formik.values.firstName}
                onChangeText={formik.handleChange("firstName")}
                onBlur={formik.handleBlur("firstName")}
                error={!!formik.touched.firstName && !!formik.errors.firstName}
                passStyles={passTextInputCompStyles}
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
                passStyles={passTextInputCompStyles}
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
                passStyles={passTextInputCompStyles}
              />
              {formik.touched.email && formik.errors.email ? (
                <Text style={styles.error}>{formik.errors.email}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <ToggleButtonGroupComp />
              {/* {formik.touched.email && formik.errors.email ? (
              <Text style={styles.error}>{formik.errors.email}</Text>
            ) : null} */}
            </View>

            <View style={styles.inputContainer}>
              <TextInputComp
                label="password"
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                error={!!formik.touched.password && !!formik.errors.password}
                secureTextEntry={true}
                passStyles={passTextInputCompStyles}
              />
              {formik.touched.password && formik.errors.password ? (
                <Text style={styles.error}>{formik.errors.password}</Text>
              ) : null}
            </View>

            {formik.values.password.length > 0 ? (
              <View style={styles.inputContainer}>
                <TextInputComp
                  label="confirm password"
                  value={formik.values.confirmPassword}
                  onChangeText={formik.handleChange("confirmPassword")}
                  onBlur={formik.handleBlur("confirmPassword")}
                  error={
                    !!formik.touched.confirmPassword &&
                    !!formik.errors.confirmPassword
                  }
                  secureTextEntry={true}
                  passStyles={passTextInputCompStyles}
                />
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <Text style={styles.error}>
                    {formik.errors.confirmPassword}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </LinearGradient>
      </ScrollView>
    </FormikProvider>
  );
};

export default RegisterForm;

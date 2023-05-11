import React, { useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Formik, useFormik, FormikProvider } from "formik";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../utils/colors";
import ToggleButtonGroupComp from "../basic/ToggleButtonGroupComp";
import theme from "../../utils/theme";
import validationSchema from "./elements/validationSchema";
import FormInput from "./elements/FormInput";
import DatePickerComp from "../basic/DatePickerComp";
import AddressInputComp from "../basic/AddressInputComp";
import AcceptTerms from "./elements/AcceptTerms";
import ViewPrivacyPolicy from "../basic/ViewPrivacyPolicy";
import ButtonComp from "../basic/ButtonComp";

const RegisterForm = () => {
  const windowDimensions = useWindowDimensions();

  // generalized styling
  const formInputWidthWeb = 0.45;
  const formInputWidthApp = `${formInputWidthWeb * 100}%`;

  const formInputMarginBottomWeb = 0.02;
  const formInputMarginBottomApp = `${formInputMarginBottomWeb * 100}%`;

  const borderRad = 12;
  const textInputHeight = theme.font.size.large * 2.5;

  const styles = StyleSheet.create({
    // RegisterForm styling
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    backgroundGradient: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    formInputViewContainer: {
      ...Platform.select({
        web: {
          marginBottom: windowDimensions.width * formInputMarginBottomWeb,
        },
        ios: {
          marginBottom: wp(formInputMarginBottomApp),
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
          width: windowDimensions.width * formInputWidthWeb,
        },
        ios: {
          width: wp(formInputWidthApp),
        },
        android: {
          // todo
        },
      }),
      color: colors.error,
      fontSize: theme.font.size.small,
    },
    // TextInputComp styling
    textInputCompOuterView: {},
    textInputCompTextContainer: {
      ...Platform.select({
        web: {
          width: windowDimensions.width * formInputWidthWeb,
        },
        ios: {
          width: wp(formInputWidthApp),
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
          width: windowDimensions.width * formInputWidthWeb,
        },
        ios: {
          width: wp(formInputWidthApp),
        },
        android: {
          // todo
        },
      }),
      height: textInputHeight,
      borderColor: colors.text,
      selectionColor: colors.primary,
      backgroundColor: colors.setting,
    },
    // ToggleButtonGroupComp styling
    toggleButtonGroupCompContainer: {
      ...Platform.select({
        web: {
          paddingVertical: windowDimensions.width * 0.01,
          paddingHorizontal: windowDimensions.width * 0.01,
          marginRight: windowDimensions.width * 0.01,
        },
        ios: {
          paddingVertical: wp("1%"),
          paddingHorizontal: wp("1%"),
          marginRight: wp("1%"),
        },
        android: {
          // todo
        },
      }),
      justifyContent: "center",
      backgroundColor: colors.setting,
      borderRadius: borderRad,
    },
    toggleButtonGroupCompLabel: {
      ...Platform.select({
        web: {
          marginBottom: windowDimensions.width * formInputMarginBottomWeb,
          marginLeft: windowDimensions.width * 0.005,
        },
        ios: {
          marginBottom: wp(formInputMarginBottomApp),
          marginLeft: wp("0.5%"),
        },
        android: {
          // todo
        },
      }),
      fontSize: theme.font.size.small,
      color: colors.text,
      alignItems: "flex-start",
    },
    toggleButtonGroupCompButtons: {
      flexDirection: "row",
    },
    toggleButtonGroupCompButton: {
      ...Platform.select({
        web: {
          paddingVertical: windowDimensions.width * 0.01,
          paddingHorizontal: windowDimensions.width * 0.01,
          marginRight: windowDimensions.width * 0.01,
        },
        ios: {
          paddingVertical: wp("1%"),
          paddingHorizontal: wp("1%"),
          marginRight: wp("1%"),
        },
        android: {
          // todo
        },
      }),
      borderRadius: borderRad,
      justifyContent: "center",
      alignItems: "center",
    },
    toggleButtonGroupCompButtonText: {
      fontSize: theme.font.size.medium,
      color: colors.text,
    },
    toggleButtonGroupCompButtonTextSelected: {
      fontSize: theme.font.size.medium,
      color: "white",
    },
    toggleButtonGroupCompSelectedButton: {
      backgroundColor: colors.settingSelect,
    },
    // in progress
    collapsibleTermsViewContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    // accept terms
    collapsibleTermsCheckboxView: {
      flexDirection: "row",
      alignItems: "center",
    },
    collapsibleTermsAgreeText: {
      color: colors.link,
      textDecorationLine: "underline",
    },
    // privacy policy
    viewPrivacyPolicyView: {},
    viewPrivacyPolicyText: {
      color: colors.link,
      textDecorationLine: "underline",
    },
    // date
    datePickerCompWebView: {
      marginBottom: windowDimensions.width * formInputMarginBottomWeb,
      justifyContent: "center",
      alignItems: "center",
    },
    datePickerCompWebInput: {
      width: windowDimensions.width * formInputWidthWeb,
      fontSize: theme.font.size.medium,
      backgroundColor: colors.setting,
      paddingLeft: windowDimensions.width * 0.01,
      height: textInputHeight,
    },
    datePickerCompAppView: {},
    datePickerCompAppModal: {},
    // address
    addressInputCompViewContainer: {
      ...Platform.select({
        web: {
          width: windowDimensions.width * formInputWidthWeb,
          marginBottom: windowDimensions.width * formInputMarginBottomWeb,
        },
        ios: {
          width: wp(formInputWidthApp),
          marginBottom: wp(formInputMarginBottomApp),
        },
        android: {
          // todo
        },
      }),
    },
    addressInputCompGooglePlacesAutoCompete: {
      height: textInputHeight,
      fontSize: theme.font.size.medium,
      color: colors.text,
      backgroundColor: colors.setting,
    },
  });

  const passFormInputStyles = {
    formInputViewContainer: styles.formInputViewContainer,
    formInputViewErrorText: styles.error,
    textInputCompContainer: styles.textInputCompOuterView,
    textInputCompText: styles.textInputCompText,
    textInputCompTextContainer: styles.textInputCompTextContainer,
    textInputCompIconContainer: styles.textInputCompIconContainer,
    textInputCompViewStyle: styles.textInputCompViewStyle,
  };

  const passToggleButtonGroupCompStyles = {
    toggleButtonGroupCompContainer: styles.toggleButtonGroupCompContainer,
    toggleButtonGroupCompLabel: styles.toggleButtonGroupCompLabel,
    toggleButtonGroupCompButtons: styles.toggleButtonGroupCompButtons,
    toggleButtonGroupCompButton: styles.toggleButtonGroupCompButton,
    toggleButtonGroupCompSelectedButton:
      styles.toggleButtonGroupCompSelectedButton,
    toggleButtonGroupCompButtonText: styles.toggleButtonGroupCompButtonText,
    toggleButtonGroupCompButtonTextSelected:
      styles.toggleButtonGroupCompButtonTextSelected,
  };
  const passAddressInputStyles = {
    addressInputCompViewContainer: styles.addressInputCompViewContainer,
    addressInputCompGooglePlacesAutoCompete:
      styles.addressInputCompGooglePlacesAutoCompete,
  };
  const passAcceptTermsStyles = {
    collapsibleTermsCheckboxView: styles.collapsibleTermsCheckboxView,
    collapsibleTermsAgreeText: styles.collapsibleTermsAgreeText,
  };
  const passViewPrivacyPolicyStyles = {
    viewPrivacyPolicyView: styles.viewPrivacyPolicyView,
    viewPrivacyPolicyText: styles.viewPrivacyPolicyText,
  };
  const passSubmitStyles = {
    buttonCompTouchableOpacity: {
      backgroundColor: colors.primary,
      borderRadius: wp("4%"),
      paddingHorizontal: wp("5%"),
      paddingVertical: wp("2%"),
      marginTop: wp("4%"),
    },
    buttonCompText: {
      color: "white",
      fontSize: theme.font.size.medium,
    },
  };
  const passDateStyles = {
    datePickerCompWebView: styles.datePickerCompWebView,
    datePickerCompWebInput: styles.datePickerCompWebInput,
    datePickerCompAppView: styles.datePickerCompAppView,
    datePickerCompAppModal: styles.datePickerCompAppModal,
    textInputCompText: styles.textInputCompText,
    textInputCompContainer: styles.textInputCompOuterView,
    textInputCompTextContainer: styles.textInputCompTextContainer,
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
      birthdate: "",
      address: {},
      termsAccepted: false,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Submitted values:", values);
    },
  });

  return (
    <LinearGradient
      colors={[colors.accent, colors.primary]}
      style={styles.backgroundGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <FormikProvider value={formik}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="never"
        >
          <View style={styles.container}>
            <FormInput
              label="first name"
              value={formik.values.firstName}
              onChangeText={formik.handleChange("firstName")}
              onBlur={formik.handleBlur("firstName")}
              error={formik.touched.firstName && formik.errors.firstName}
              passStyles={passFormInputStyles}
            />

            <FormInput
              label="last name"
              value={formik.values.lastName}
              onChangeText={formik.handleChange("lastName")}
              onBlur={formik.handleBlur("lastName")}
              error={formik.touched.lastName && formik.errors.lastName}
              passStyles={passFormInputStyles}
            />

            <FormInput
              label="email"
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              error={formik.touched.email && formik.errors.email}
              passStyles={passFormInputStyles}
            />

            <View style={styles.formInputViewContainer}>
              <ToggleButtonGroupComp
                label="what is your gender?"
                buttons={["male", "female", "other / unspecified"]}
                onValueChange={(value) => console.log("Selected value:", value)}
                passStyles={passToggleButtonGroupCompStyles}
              />
            </View>

            <FormInput
              label="password"
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              error={formik.touched.password && formik.errors.password}
              passStyles={passFormInputStyles}
              secureTextEntry={true}
            />

            {formik.values.password.length > 0 ? (
              <FormInput
                label="confirm password"
                value={formik.values.confirmPassword}
                onChangeText={formik.handleChange("confirmPassword")}
                onBlur={formik.handleBlur("confirmPassword")}
                error={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                passStyles={passFormInputStyles}
                secureTextEntry={true}
              />
            ) : null}

            <DatePickerComp
              label="date of birth (mm/dd/yyyy)"
              value={formik.values.birthdate}
              onDateChange={(date) => formik.setFieldValue("birthdate", date)}
              error={formik.touched.birthdate && formik.errors.birthdate}
              passStyles={passDateStyles}
            />

            <AddressInputComp // TODO - get API set up & continue from there
              onPlaceSelected={(data, details) =>
                formik.setFieldValue("address", {
                  place_id: data.place_id,
                  formatted_address: details.formatted_address,
                })
              }
              error={!!formik.touched.address && !!formik.errors.address}
              passStyles={passAddressInputStyles}
            />

            <AcceptTerms
              acceptTerms={formik.values.termsAccepted}
              onPress={() =>
                formik.setFieldValue(
                  "termsAccepted",
                  !formik.values.termsAccepted
                )
              }
              passStyles={passAcceptTermsStyles}
            />
            <ViewPrivacyPolicy passStyles={passViewPrivacyPolicyStyles} />
            <ButtonComp
              text="Submit"
              onPress={formik.handleSubmit}
              passStyles={passSubmitStyles}
            />
          </View>
        </ScrollView>
      </FormikProvider>
    </LinearGradient>
  );
};

export default RegisterForm;

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
import DatePickerComp from "../basic/DatePickerComp";
import AddressInputComp from "../basic/AddressInputComp";
import AcceptTerms from "./elements/AcceptTerms";
import ViewPrivacyPolicy from "../basic/ViewPrivacyPolicy";
import ButtonComp from "../basic/ButtonComp";
import TextAddOn from "../wrapper/TextAddOn";
import TextInputComp from "../basic/TextInputComp";

const RegisterForm = () => {
  const windowDimensions = useWindowDimensions();

  // generalized styling
  const formInputWidthWeb = 0.45;
  const formInputWidthApp = `${0.8 * 100}%`;

  const formInputMarginBottomWeb = 0.02;
  const formInputMarginBottomApp = `${0.04 * 100}%`;

  const formInputMarginEdgesWeb = 0.1;
  const formInputMarginEdgesApp = `${formInputMarginEdgesWeb * 100}%`;

  const borderRad = 12;
  const textInputHeight = theme.font.size.large * 2.5;

  // TODO password requirements show up before you begin typing
  // TODO slightly rounded corners to the text input boxes
  // TODO universal wrapper component for error text, tooltips, etc (pass in component to wrap)
  const styles = StyleSheet.create({
    // RegisterForm styling
    container: {
      ...Platform.select({
        web: {
          marginTop: windowDimensions.width * formInputMarginBottomWeb,
        },
        ios: {
          marginTop: wp(formInputMarginBottomApp),
        },
        android: {
          // todo
        },
      }),
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
    },
    formInputViewContainerTop: {
      ...Platform.select({
        web: {
          marginTop: windowDimensions.width * formInputMarginEdgesWeb,
          marginBottom: windowDimensions.width * formInputMarginBottomWeb,
        },
        ios: {
          marginTop: wp(formInputMarginEdgesApp),
          marginBottom: wp(formInputMarginBottomApp),
        },
        android: {
          // todo
        },
      }),
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
          marginTop: windowDimensions.width * 0.005,
          width: windowDimensions.width * formInputWidthWeb,
        },
        ios: {
          marginTop: wp("0.5%"),
          width: wp(formInputWidthApp),
        },
        android: {
          // todo
        },
      }),
      color: colors.setting,
      fontWeight: "bold",
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
      borderRadius: 10,
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
      color: colors.setting,
    },
    toggleButtonGroupCompSelectedButton: {
      backgroundColor: colors.primary,
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
    datePickerCompAppView: {
      borderRadius: wp("4%"),
      marginBottom: wp(formInputMarginBottomApp),
      paddingLeft: wp("1%"),
      paddingRight: wp("1%"),
      height: textInputHeight,
      backgroundColor: colors.setting,
      justifyContent: "center",
    },
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
    // accept terms
    collapsibleTermsCheckboxView: {
      flexDirection: "row",
      alignItems: "center",
    },
    collapsibleTermsAgreeText: {
      color: colors.accent,
      textDecorationLine: "underline",
    },
    // privacy policy
    viewPrivacyPolicyView: {
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
    },
    viewPrivacyPolicyText: {
      color: colors.accent,
      textDecorationLine: "underline",
    },
    // submit button
    buttonCompTouchableOpacity: {
      ...Platform.select({
        web: {
          borderRadius: windowDimensions.width * 0.04,
          paddingHorizontal: windowDimensions.width * 0.05,
          paddingVertical: windowDimensions.width * 0.02,
          padding: windowDimensions.width * 0.01,
          marginBottom: windowDimensions.width * formInputMarginEdgesWeb,
        },
        ios: {
          borderRadius: wp("4%"),
          paddingHorizontal: wp("10%"),
          paddingVertical: wp("4%"),
          marginBottom: wp(formInputMarginEdgesApp),
        },
        android: {
          // todo
        },
      }),
      backgroundColor: colors.accent,
    },
    buttonCompText: {
      color: colors.text,
      fontSize: theme.font.size.medium,
    },
  });

  // for top scroll element to establish some visual margin
  const passFormInputTextAddOnTop = {
    textAddOnView: styles.formInputViewContainerTop,
    textAddOnText: styles.error,
  };

  const passFormInputStylesTop = {
    textInputCompContainer: styles.textInputCompOuterView,
    textInputCompText: styles.textInputCompText,
    textInputCompTextContainer: styles.textInputCompTextContainer,
    textInputCompIconContainer: styles.textInputCompIconContainer,
    textInputCompViewStyle: styles.textInputCompViewStyle,
  };

  const passFormInputTextAddOn = {
    textAddOnView: styles.formInputViewContainer,
    textAddOnText: styles.error,
  };

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
    buttonCompTouchableOpacity: styles.buttonCompTouchableOpacity,
    buttonCompText: styles.buttonCompText,
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
      colors={[colors.primary, colors.primary]}
      style={styles.backgroundGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <FormikProvider value={formik}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="never"
        >
          {/*First name entry*/}
          <TextAddOn
            component={
              <TextInputComp
                label="first name"
                value={formik.values.firstName}
                onChangeText={formik.handleChange("firstName")}
                onBlur={formik.handleBlur("firstName")}
                error={!!formik.touched.firstName && !!formik.errors.firstName}
                passStyles={passFormInputStylesTop}
              />
            }
            value={formik.errors.firstName}
            display={!!formik.touched.firstName && !!formik.errors.firstName}
            passStyles={passFormInputTextAddOnTop}
          />

          {/*Last name entry*/}
          <TextAddOn
            component={
              <TextInputComp
                label="last name"
                value={formik.values.lastName}
                onChangeText={formik.handleChange("lastName")}
                onBlur={formik.handleBlur("lastName")}
                error={!!formik.touched.lastName && !!formik.errors.lastName}
                passStyles={passFormInputStyles}
              />
            }
            value={formik.errors.lastName}
            display={!!formik.touched.lastName && !!formik.errors.lastName}
            passStyles={passFormInputTextAddOn}
          />

          {/*Email entry*/}
          <TextAddOn
            component={
              <TextInputComp
                label="email"
                value={formik.values.email}
                onChangeText={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                error={!!formik.touched.email && !!formik.errors.email}
                passStyles={passFormInputStyles}
              />
            }
            value={formik.errors.email}
            display={!!formik.touched.email && !!formik.errors.email}
            passStyles={passFormInputTextAddOn}
          />

          {/*Gender entry*/}
          <View style={styles.formInputViewContainer}>
            <ToggleButtonGroupComp
              label="please select your gender"
              buttons={["male", "female", "other / unspecified"]}
              onValueChange={(value) => console.log("Selected value:", value)}
              passStyles={passToggleButtonGroupCompStyles}
            />
          </View>

          {/*Password entry*/}
          <TextAddOn
            component={
              <TextInputComp
                label="password"
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                error={!!formik.touched.password && !!formik.errors.password}
                passStyles={passFormInputStyles}
                secureTextEntry={true}
              />
            }
            value={formik.errors.password}
            display={!!formik.touched.password && !!formik.errors.password}
            passStyles={passFormInputTextAddOn}
          />

          {/*Password confirmation entry*/}
          {formik.values.password.length > 0 ? (
            <TextAddOn
              component={
                <TextInputComp
                  label="confirm password"
                  value={formik.values.confirmPassword}
                  onChangeText={formik.handleChange("confirmPassword")}
                  onBlur={formik.handleBlur("confirmPassword")}
                  error={
                    !!formik.touched.confirmPassword &&
                    !!formik.errors.confirmPassword
                  }
                  passStyles={passFormInputStyles}
                  secureTextEntry={true}
                />
              }
              value={formik.errors.confirmPassword}
              display={
                !!formik.touched.confirmPassword &&
                !!formik.errors.confirmPassword
              }
              passStyles={passFormInputTextAddOn}
            />
          ) : null}

          {/*dob entry*/}
          <TextAddOn
            component={
              <DatePickerComp
                label="date of birth"
                webFormatHint="(mm/dd/yyyy)"
                value={formik.values.birthdate}
                onDateChange={(date) => formik.setFieldValue("birthdate", date)}
                onBlur={() => formik.setFieldTouched("birthdate")}
                error={!!formik.touched.birthdate && !!formik.errors.birthdate}
                passStyles={passDateStyles}
              />
            }
            value={formik.errors.birthdate}
            display={!!formik.touched.birthdate && !!formik.errors.birthdate}
            passStyles={passFormInputTextAddOn}
          />

          {/*Address entry*/}
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

          {/*Terms, Private Policy, Submit*/}
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
        </ScrollView>
      </FormikProvider>
    </LinearGradient>
  );
};

export default RegisterForm;

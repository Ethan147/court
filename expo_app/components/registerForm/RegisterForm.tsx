import React, { useRef, useState } from "react";
import {
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
import { View } from "react-native";
import colors from "../../utils/colors";
import ToggleButtonGroupComp from "../basic/ToggleButtonGroupComp";
import theme from "../../utils/theme";
import validationSchema, {
  minAge,
  passReqText,
} from "./elements/validationSchema";
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

  const formInputMarginEdgesWeb = 0.05;
  const formInputMarginEdgesApp = `${formInputMarginEdgesWeb * 100}%`;

  const borderRad = 12;
  const textInputHeight = theme.font.size.large * 2.5;

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
    },
    errorView: {
      ...Platform.select({
        web: {
          marginTop: windowDimensions.width * 0.005,
        },
        ios: {
          marginTop: wp("0.5%"),
        },
        android: {
          // todo
        },
      }),
      backgroundColor: colors.setting,
      padding: 8,
      borderRadius: 10,
      alignSelf: "flex-start",
    },
    errorViewTerms: {
      ...Platform.select({
        web: {
          marginTop: windowDimensions.width * 0.005,
          marginBottom: windowDimensions.width * 0.005,
        },
        ios: {
          marginTop: wp("0.5%"),
          marginBottom: wp("0.5%"),
        },
        android: {
          // todo
        },
      }),
      backgroundColor: colors.setting,
      padding: 8,
      borderRadius: 10,
      alignSelf: "flex-start",
    },
    error: {
      color: colors.error,
      fontSize: theme.font.size.small,
    },
    hintView: {
      ...Platform.select({
        web: {
          marginTop: windowDimensions.width * 0.002,
          width: windowDimensions.width * formInputWidthWeb,
        },
        ios: {
          marginTop: wp("0.2%"),
          width: wp(formInputWidthApp),
        },
        android: {
          // todo
        },
      }),
      color: colors.error,
      alignSelf: "flex-start",
    },
    hint: {
      color: colors.setting,
      fontSize: theme.font.size.small,
    },
    // TextInputComp styling
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
          width: wp(formInputWidthApp),
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
          marginLeft: windowDimensions.width * 0.001,
          marginTop: windowDimensions.width * 0.005,
          marginBottom: windowDimensions.width * 0.005,
          fontSize: theme.font.size.small,
        },
        ios: {
          marginTop: wp("1%"),
          marginLeft: wp("1%"),
          marginBottom: wp(formInputMarginBottomApp),
          fontSize: theme.font.size.medium,
        },
        android: {
          // todo
        },
      }),
      color: colors.text,
    },
    toggleButtonGroupCompButtons: {
      flexDirection: "row",
      justifyContent: "center",
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
        },
        ios: {
          width: wp(formInputWidthApp),
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
    termsSwitchOuterView: {
      flexDirection: "row",
      justifyContent: "center",
    },
    termsSwitchView: {
      ...Platform.select({
        web: {
          paddingRight: windowDimensions.width * 0.005,
        },
        ios: {
          paddingRight: wp("2%"),
        },
        android: {
          // todo
        },
      }),
      justifyContent: "center",
    },
    termsAgreeText: {
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
      flexDirection: "row",
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

  // error styling
  const passTextAddOnErrorTopStyles = {
    textAddOnContainerView: styles.formInputViewContainerTop,
    textAddOnTextView: styles.errorView,
    textAddOnText: styles.error,
  };
  const passTextAddOnErrorStyles = {
    textAddOnContainerView: styles.formInputViewContainer,
    textAddOnTextView: styles.errorView,
    textAddOnText: styles.error,
  };
  const passTextAddOnErrorTermsStyles = {
    textAddOnTextView: styles.errorViewTerms,
    textAddOnText: styles.error,
  };

  // text hint styling
  const passFormInputTextAddOnHintStyles = {
    textAddOnTextView: styles.hintView,
    textAddOnText: styles.hint,
  };

  // component styling
  const passTextInputTopStyles = {
    textInputCompTextContainer: styles.textInputCompTextContainer,
    textInputCompIconContainer: styles.textInputCompIconContainer,
    textInputCompText: styles.textInputCompText,
  };
  const passTextInputStyles = {
    textInputCompTextContainer: styles.textInputCompTextContainer,
    textInputCompIconContainer: styles.textInputCompIconContainer,
    textInputCompText: styles.textInputCompText,
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
  const passDateStyles = {
    datePickerCompWebView: styles.datePickerCompWebView,
    datePickerCompWebInput: styles.datePickerCompWebInput,
    datePickerCompAppView: styles.datePickerCompAppView,
    datePickerCompAppModal: styles.datePickerCompAppModal,
    textInputCompTextContainer: styles.textInputCompTextContainer,
    textInputCompIconContainer: styles.textInputCompIconContainer,
    textInputCompText: styles.textInputCompText,
  };
  const passAddressInputStyles = {
    addressInputCompViewContainer: styles.addressInputCompViewContainer,
    addressInputCompGooglePlacesAutoCompete:
      styles.addressInputCompGooglePlacesAutoCompete,
  };
  const passAcceptTermsStyles = {
    acceptTermsSwitchOuterView: styles.termsSwitchOuterView,
    acceptTermsSwitchView: styles.termsSwitchView,
    acceptTermsAgreeText: styles.termsAgreeText,
  };
  const passViewPrivacyPolicyStyles = {
    viewPrivacyPolicyView: styles.viewPrivacyPolicyView,
    viewPrivacyPolicyText: styles.viewPrivacyPolicyText,
  };
  const passSubmitStyles = {
    buttonCompTouchableOpacity: styles.buttonCompTouchableOpacity,
    buttonCompText: styles.buttonCompText,
  };

  const scrollViewRef = useRef<ScrollView>(null);

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
      address: "",
      termsAccepted: false,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Submitted values:", values);
    },
  });

  const handleBlurOnlyIfNotEmpty = (name: string) => (e: any) => {
    if (e.target.value !== "") {
      formik.handleBlur(name)(e);
    }
  };

  const handleSubmit = () => {
    formik.handleSubmit();
    if (
      formik.errors &&
      Object.keys(formik.errors).length > 0 &&
      scrollViewRef.current
    ) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  return (
    <View style={{ backgroundColor: colors.primary }}>
      <FormikProvider value={formik}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
        >
          {/*First name entry*/}
          <TextAddOn
            component={
              <TextInputComp
                label="first name"
                value={formik.values.firstName}
                onChangeText={formik.handleChange("firstName")}
                onBlur={handleBlurOnlyIfNotEmpty("firstName")}
                error={!!formik.touched.firstName && !!formik.errors.firstName}
                passStyles={passTextInputTopStyles}
              />
            }
            value={formik.errors.firstName}
            display={!!formik.touched.firstName && !!formik.errors.firstName}
            passStyles={passTextAddOnErrorTopStyles}
          />
          {/*Last name entry*/}
          <TextAddOn
            component={
              <TextInputComp
                label="last name"
                value={formik.values.lastName}
                onChangeText={formik.handleChange("lastName")}
                onBlur={handleBlurOnlyIfNotEmpty("lastName")}
                error={!!formik.touched.lastName && !!formik.errors.lastName}
                passStyles={passTextInputStyles}
              />
            }
            value={formik.errors.lastName}
            display={!!formik.touched.lastName && !!formik.errors.lastName}
            passStyles={passTextAddOnErrorStyles}
          />
          {/*Email entry*/}
          <TextAddOn
            component={
              <TextInputComp
                label="email"
                value={formik.values.email}
                onChangeText={formik.handleChange("email")}
                onBlur={handleBlurOnlyIfNotEmpty("email")}
                error={!!formik.touched.email && !!formik.errors.email}
                passStyles={passTextInputStyles}
              />
            }
            value={formik.errors.email}
            display={!!formik.touched.email && !!formik.errors.email}
            passStyles={passTextAddOnErrorStyles}
          />
          {/*Gender entry*/}
          <TextAddOn
            component={
              <ToggleButtonGroupComp
                label="please select your gender"
                buttons={["male", "female", "other / unspecified"]}
                onValueChange={(value) => console.log("Selected value:", value)}
                passStyles={passToggleButtonGroupCompStyles}
              />
            }
            value={formik.errors.gender}
            display={!!formik.touched.gender && !!formik.errors.gender}
            passStyles={passTextAddOnErrorStyles}
          />
          {/*Password entry*/}
          <TextAddOn
            component={
              <TextAddOn
                component={
                  <TextInputComp
                    label="password"
                    value={formik.values.password}
                    onChangeText={formik.handleChange("password")}
                    onBlur={handleBlurOnlyIfNotEmpty("password")}
                    error={
                      !!formik.touched.password && !!formik.errors.password
                    }
                    passStyles={passTextInputStyles}
                    secureTextEntry={true}
                  />
                }
                value={passReqText}
                display={true}
                passStyles={passFormInputTextAddOnHintStyles}
              />
            }
            value={"password is invalid"}
            display={!!formik.touched.password && !!formik.errors.password}
            passStyles={passTextAddOnErrorStyles}
          />
          {/*Password confirmation entry*/}
          {formik.values.password.length > 0 ? (
            <TextAddOn
              component={
                <TextInputComp
                  label="confirm password"
                  value={formik.values.confirmPassword}
                  onChangeText={formik.handleChange("confirmPassword")}
                  onBlur={handleBlurOnlyIfNotEmpty("confirmPassword")}
                  error={
                    !!formik.touched.confirmPassword &&
                    !!formik.errors.confirmPassword
                  }
                  passStyles={passTextInputStyles}
                  secureTextEntry={true}
                />
              }
              value={formik.errors.confirmPassword}
              display={
                !!formik.touched.confirmPassword &&
                !!formik.errors.confirmPassword
              }
              passStyles={passTextAddOnErrorStyles}
            />
          ) : null}
          {/*dob entry*/}
          <TextAddOn
            component={
              <TextAddOn
                component={
                  <DatePickerComp
                    label="date of birth"
                    webFormatHint="(mm/dd/yyyy)"
                    value={formik.values.birthdate}
                    onDateChange={(date) =>
                      formik.setFieldValue("birthdate", date)
                    }
                    error={
                      !!formik.touched.birthdate && !!formik.errors.birthdate
                    }
                    passStyles={passDateStyles}
                  />
                }
                value={
                  "participants must be at least " + minAge + " years of age"
                }
                display={true}
                passStyles={passFormInputTextAddOnHintStyles}
              />
            }
            value={formik.errors.birthdate}
            display={!!formik.touched.birthdate && !!formik.errors.birthdate}
            passStyles={passTextAddOnErrorStyles}
          />
          {/*Address entry*/}
          <TextAddOn
            component={
              <TextAddOn
                component={
                  <TextAddOn
                    component={
                      <TextAddOn
                        component={
                          <AddressInputComp // TODO - get API set up & continue from there
                            onPlaceSelected={(data, details) =>
                              formik.setFieldValue("address", {
                                place_id: data.place_id,
                                formatted_address: details.formatted_address,
                              })
                            }
                            passStyles={passAddressInputStyles}
                          />
                        }
                        value={
                          "Enter an address as your play hub for tennis or pickleball - it could be home, work, or anywhere in between."
                        }
                        display={true}
                        passStyles={passFormInputTextAddOnHintStyles}
                      />
                    }
                    value={
                      "You can always expand your play zone by adding more locations later!"
                    }
                    display={true}
                    passStyles={passFormInputTextAddOnHintStyles}
                  />
                }
                value={
                  "Your address will be used solely to match you with nearby tennis and/or pickleball partners."
                }
                display={true}
                passStyles={passFormInputTextAddOnHintStyles}
              />
            }
            value={formik.errors.address}
            display={!!formik.touched.address && !!formik.errors.address}
            passStyles={passTextAddOnErrorStyles}
          />
          {/*Terms, Private Policy, Submit*/}
          <TextAddOn
            component={
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
            }
            value={formik.errors.termsAccepted}
            display={
              !!formik.touched.termsAccepted && !!formik.errors.termsAccepted
            }
            passStyles={passTextAddOnErrorTermsStyles}
          />
          <ViewPrivacyPolicy passStyles={passViewPrivacyPolicyStyles} />
          <ButtonComp
            text="Submit"
            onPress={handleSubmit}
            passStyles={passSubmitStyles}
          />
        </ScrollView>
      </FormikProvider>
    </View>
  );
};

export default RegisterForm;

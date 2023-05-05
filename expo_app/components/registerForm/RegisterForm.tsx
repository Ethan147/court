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
import CollapsibleTerms from "../basic/CollapsibleTerms";

// todo incorporated into components
const TermsAndConditions = `1. Introduction
Welcome to [app-name]! This app is designed to help you schedule games across singles and doubles, organize tournaments and challenge-ladders, find courts to play at, and maintain an internal ELO ranking system for players. The app also includes basic social media capabilities and geolocation features. By using our app, you agree to comply with these Terms of Service and our Privacy Policy.

2. User Conduct
As a user of our app, you are responsible for posting appropriate content. This includes, but is not limited to:

Respecting other users' privacy by not sharing their personal information without their consent
Refraining from posting lewd images or derogatory speech
Complying with all applicable laws and regulations
We reserve the right to remove any content that we deem inappropriate and to suspend or terminate the accounts of users who violate these rules.

3. Geolocation
Our app utilizes geolocation technology to provide you with a more personalized experience. By using our app, you consent to the collection and use of your location data for this purpose.

4. Premium Features and Subscriptions
Access to certain premium features of our app requires payment via a subscription-based model. By subscribing to our premium services, you agree to pay the associated fees and abide by any additional terms that may apply to these features.

5. Intellectual Property
All content, features, and functionality within our app are owned by us and are protected by copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to access and use the app for your personal, non-commercial purposes.

6. Limitation of Liability
We make no warranties, express or implied, regarding the availability, accuracy, or reliability of the app, its features, or its content. In no event shall we be liable for any damages, including but not limited to, direct, indirect, incidental, or consequential damages, arising out of your use of the app or your inability to use the app.

7. Changes to These Terms
We may update these Terms of Service from time to time. We will notify you of any significant changes and, where required by applicable law, obtain your consent to any such changes. Your continued use of our app following the posting of revised Terms of Service constitutes your acceptance of the updated terms.

8. Contact Us
If you have any questions or concerns regarding these Terms of Service or our app, please contact us at [your email address].`;

const PrivacyPolicy = `1. Introduction
We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and share your personal data when using our app. By using our app, you agree to the terms of this Privacy Policy.

2. Collection of Personal Data
When you use our app, we may collect the following types of personal data:

Name
Email address
Date of birth
Address
Geolocation data

3. Use of Personal Data
We use your personal data to provide and improve our app's features and services, such as:

Scheduling games
Organizing tournaments and challenge-ladders
Finding courts to play at
Maintaining an internal ELO ranking system
Personalizing your experience based on your location

4. Data Sharing and Disclosure
We will never sell your data to third parties. However, we may share your personal data with trusted third-party service providers to help us provide and improve our app's services. We require these service providers to maintain the confidentiality of your personal data and use it only for the purposes of providing services on our behalf. They must also comply with all applicable laws and regulations related to data protection and privacy.

5. Data Security
We take the security of your personal data seriously and implement appropriate technical and organizational measures to protect it from unauthorized access, disclosure, alteration, or destruction. However, please be aware that no method of data transmission or storage is 100% secure, and we cannot guarantee the absolute security of your personal data.

6. Data Retention
We will retain your personal data for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements. While we aim to maintain the best of intentions when handling your data, please be aware that there might not be a specific need for our app to delete or anonymize your data, unless the data load becomes exceptionally large. In such cases, we will assess the situation and take appropriate measures as needed.

7. Your Righst and Choices
Depending on your jurisdiction, you may have certain rights related to your personal data, such as the right to access, correct, delete, or restrict the processing of your data. If you would like to exercise any of these rights, please contact us at [your email address]. We will respond to your request in accordance with applicable data protection laws.

8. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. We will notify you of any significant changes and, where required by applicable law, obtain your consent to any such changes. Your continued use of our app following the posting of a revised Privacy Policy constitutes your acceptance of the updated policy.

9. Contact Us
If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact us at [your email address].
`;

const RegisterForm = () => {
  const windowDimensions = useWindowDimensions();

  const styles = StyleSheet.create({
    // RegisterForm styling
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    formInputViewContainer: {
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
    error2: {
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
    },
    backgroundGradient: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    // TextInputComp styling
    textInputCompOuterView: {},
    textInputCompTextContainer: {
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
      alignItems: "center",
    },
    toggleButtonGroupCompLabel: {
      ...Platform.select({
        web: {
          marginBottom: windowDimensions.width * 0.02,
        },
        ios: {
          paddingVertical: wp("1%"),
        },
        android: {
          // todo
        },
      }),
      fontSize: theme.font.size.small,
      color: colors.text,
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
      borderRadius: 12,
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
  });

  const passTextInputCompStyles = {
    textInputCompContainer: styles.textInputCompOuterView,
    textInputCompTextContainer: styles.textInputCompTextContainer,
    textInputCompIconContainer: styles.textInputCompIconContainer,
    textInputCompViewStyle: styles.textInputCompViewStyle,
  };

  const passFormInputStyles = {
    formInputViewContainer: styles.formInputViewContainer,
    formInputViewErrorText: styles.error2,
    textInputCompContainer: styles.textInputCompOuterView,
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

  const passAddressInputStyles = {}; // todo
  const passCollapsibleTermsStyles = {}; // todo

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      age: "",
      birthdate: null,
      address: {},
      termsAccepted: false,
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

              {/* {formik.touched.email && formik.errors.email ? (
              <Text style={styles.error}>{formik.errors.email}</Text>
            ) : null} */}
            </View>

            <FormInput
              label="password"
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              error={formik.touched.password && formik.errors.password}
              passStyles={passFormInputStyles}
            />

            {formik.values.password.length > 0 ? (
              <View style={styles.formInputViewContainer}>
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
                />
              </View>
            ) : null}

            <DatePickerComp
              value={formik.values.birthdate}
              onDateChange={(date) => formik.setFieldValue("birthdate", date)}
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

            <CollapsibleTerms
              acceptTerms={formik.values.termsAccepted}
              onPress={() =>
                formik.setFieldValue(
                  "termsAccepted",
                  !formik.values.termsAccepted
                )
              }
              passStyles={passCollapsibleTermsStyles}
            />
          </View>
        </LinearGradient>
      </ScrollView>
    </FormikProvider>
  );
};

export default RegisterForm;

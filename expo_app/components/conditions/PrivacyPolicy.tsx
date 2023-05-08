import { NavigationProp } from "@react-navigation/native";
import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

const policy = `1. Introduction
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

7. Your Rights and Choices
Depending on your jurisdiction, you may have certain rights related to your personal data, such as the right to access, correct, delete, or restrict the processing of your data. If you would like to exercise any of these rights, please contact us at [your email address]. We will respond to your request in accordance with applicable data protection laws.

8. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. We will notify you of any significant changes and, where required by applicable law, obtain your consent to any such changes. Your continued use of our app following the posting of a revised Privacy Policy constitutes your acceptance of the updated policy.

9. Contact Us
If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact us at [company email address].
`;

interface privacyPolicyProps {
  passStyles?: {
    privacyPolicyScrollView?: StyleProp<ViewStyle>;
    privacyPolicyText?: StyleProp<TextStyle>;
  };
}

const PrivacyPolicy: React.FC<privacyPolicyProps> = ({ passStyles }) => {
  const styles = {
    privacyPolicyScrollView: passStyles?.privacyPolicyScrollView || {},
    privacyPolicyText: passStyles?.privacyPolicyText || {},
  };

  return (
    <ScrollView style={styles?.privacyPolicyScrollView}>
      <Text style={styles?.privacyPolicyText}>{policy}</Text>
    </ScrollView>
  );
};

export default PrivacyPolicy;

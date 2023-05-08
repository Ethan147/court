import React from "react";
import {
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

const terms = `1. Introduction
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
If you have any questions or concerns regarding these Terms of Service or our app, please contact us at [company email address].`;

interface termsAndConditionsProps {
  passStyles?: {
    privacyPolicyScrollView?: StyleProp<ViewStyle>;
    privacyPolicyText?: StyleProp<TextStyle>;
  };
}

const TermsAndConditions: React.FC<termsAndConditionsProps> = ({
  passStyles,
}) => {
  const styles = {
    privacyPolicyScrollView: passStyles?.privacyPolicyScrollView || {},
    privacyPolicyText: passStyles?.privacyPolicyText || {},
  };

  return (
    <ScrollView style={styles.privacyPolicyScrollView}>
      <Text style={styles.privacyPolicyText}>{terms}</Text>
    </ScrollView>
  );
};

export default TermsAndConditions;

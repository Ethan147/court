import React, { useState } from "react";
import { View, Text, TextStyle, ViewStyle, StyleProp } from "react-native";
import { List, Checkbox } from "react-native-paper";

interface CollapsibleTermsProps {
  acceptTerms?: boolean;
  onPress?: () => void;
  passStyles?: {
    collapsibleTermsAccordionTitle?: StyleProp<TextStyle>;
    collapsibleTermsAccordionContent?: StyleProp<TextStyle>;
    collapsibleTermsCheckboxContainer?: StyleProp<ViewStyle>;
  };
}

const CollapsibleTerms: React.FC<CollapsibleTermsProps> = ({
  acceptTerms = false,
  onPress,
  passStyles,
}) => {
  const styles = {
    collapsibleTermsAccordionTitle:
      passStyles?.collapsibleTermsAccordionTitle || {},
    collapsibleTermsAccordionContent:
      passStyles?.collapsibleTermsAccordionContent || {},
    collapsibleTermsCheckboxContainer:
      passStyles?.collapsibleTermsCheckboxContainer || {},
  };

  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState(acceptTerms);

  const handlePress = () => {
    setExpanded(!expanded);
    if (onPress) {
      onPress();
    }
  };

  const handleCheckbox = () => {
    setChecked(!checked);
  };

  return (
    <View>
      <View style={styles?.collapsibleTermsCheckboxContainer}>
        <Checkbox
          status={checked ? "checked" : "unchecked"}
          onPress={handleCheckbox}
        />
        <List.Accordion
          titleStyle={styles?.collapsibleTermsAccordionTitle}
          title="Agree to Terms and Conditions"
          expanded={expanded}
          onPress={handlePress}
        >
          <Text style={styles?.collapsibleTermsAccordionContent}>
            1. Introduction{"\n"}
            Welcome to [app-name]! This app is designed to help you schedule
            games across singles and doubles, organize tournaments and
            challenge-ladders, find courts to play at, and maintain an internal
            ELO ranking system for players. The app also includes basic social
            media capabilities and geolocation features. By using our app, you
            agree to comply with these Terms of Service.{"\n"}
            {"\n"}
            2. Privacy{"\n"}
            We value your privacy and are committed to protecting your personal
            information. We will never sell your data to third parties. For more
            information about our data practices, please refer to our Privacy
            Policy.{"\n"}
            {"\n"}
            3. User Conduct{"\n"}
            As a user of our app, you are responsible for posting appropriate
            content. This includes, but is not limited to:{"\n"}
            Respecting other users' privacy by not sharing their personal
            information without their consent{"\n"}
            Refraining from posting lewd images or derogatory speech{"\n"}
            Complying with all applicable laws and regulations{"\n"}
            We reserve the right to remove any content that we deem
            inappropriate, and to suspend or terminate the accounts of users who
            violate these rules.{"\n"}
            {"\n"}
            4. Geolocation{"\n"}
            Our app utilizes geolocation technology to provide you with a more
            personalized experience. By using our app, you consent to the
            collection and use of your location data for this purpose.{"\n"}
            {"\n"}
            5. Premium Features and Subscriptions{"\n"}
            Access to certain premium features of our app requires payment via a
            subscription-based model. By subscribing to our premium services,
            you agree to pay the associated fees and abide by any additional
            terms that may apply to these features.{"\n"}
            {"\n"}
            6. Intellectual Property{"\n"}
            All content, features, and functionality within our app are owned by
            us and are protected by copyright, trademark, and other intellectual
            property laws. You are granted a limited, non-exclusive,
            non-transferable license to access and use the app for your
            personal, non-commercial purposes.{"\n"}
            {"\n"}
            7. Limitation of Liability{"\n"}
            We make no warranties, express or implied, regarding the
            availability, accuracy, or reliability of the app, its features, or
            its content. In no event shall we be liable for any damages,
            including but not limited to, direct, indirect, incidental, or
            consequential damages, arising out of your use of the app or your
            inability to use the app.{"\n"}
            {"\n"}
            8. Changes to These Terms{"\n"}
            We may update these Terms of Service from time to time. We will
            notify you of any significant changes and, where required by
            applicable law, obtain your consent to any such changes. Your
            continued use of our app following the posting of revised Terms of
            Service constitutes your acceptance of the updated terms.{"\n"}
            {"\n"}
            9. Contact Us{"\n"}
            If you have any questions or concerns regarding these Terms of
            Service or our app, please contact us at [your email address].`,
          </Text>
        </List.Accordion>
      </View>
    </View>
  );
};

export default CollapsibleTerms;

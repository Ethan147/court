import React, { Component } from "react";
import Accordion from "react-native-collapsible/Accordion";
import {
  View,
  Text,
  ViewStyle,
  StyleProp,
  TextStyle,
  GestureResponderEvent,
} from "react-native";
import { CheckBox } from "react-native-elements";

interface SectionData {
  title: string;
  content: string;
}

// todo get version information etc from API (to keep this up to date)
const SECTIONS: SectionData[] = [
  {
    title: "Agree to Terms and Conditions",
    content: `1. Introduction
    Welcome to [app-name]! This app is designed to help you schedule games across singles and doubles, organize tournaments and challenge-ladders, find courts to play at, and maintain an internal ELO ranking system for players. The app also includes basic social media capabilities and geolocation features. By using our app, you agree to comply with these Terms of Service.

    2. Privacy
    We value your privacy and are committed to protecting your personal information. We will never sell your data to third parties. For more information about our data practices, please refer to our Privacy Policy.

    3. User Conduct
    As a user of our app, you are responsible for posting appropriate content. This includes, but is not limited to:

    Respecting other users' privacy by not sharing their personal information without their consent
    Refraining from posting lewd images or derogatory speech
    Complying with all applicable laws and regulations
    We reserve the right to remove any content that we deem inappropriate, and to suspend or terminate the accounts of users who violate these rules.

    4. Geolocation
    Our app utilizes geolocation technology to provide you with a more personalized experience. By using our app, you consent to the collection and use of your location data for this purpose.

    5. Premium Features and Subscriptions
    Access to certain premium features of our app requires payment via a subscription-based model. By subscribing to our premium services, you agree to pay the associated fees and abide by any additional terms that may apply to these features.

    6. Intellectual Property
    All content, features, and functionality within our app are owned by us and are protected by copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to access and use the app for your personal, non-commercial purposes.

    7. Limitation of Liability
    We make no warranties, express or implied, regarding the availability, accuracy, or reliability of the app, its features, or its content. In no event shall we be liable for any damages, including but not limited to, direct, indirect, incidental, or consequential damages, arising out of your use of the app or your inability to use the app.

    8. Changes to These Terms
    We may update these Terms of Service from time to time. We will notify you of any significant changes and, where required by applicable law, obtain your consent to any such changes. Your continued use of our app following the posting of revised Terms of Service constitutes your acceptance of the updated terms.

    9. Contact Us
    If you have any questions or concerns regarding these Terms of Service or our app, please contact us at [your email address].`,
  },
];

interface CollapsibleTermsProps {
  passStyles: {
    collapsibleTermsViewHeader: StyleProp<ViewStyle>;
    collapsibleTermsHeaderText: StyleProp<ViewStyle>;
    collapsibleTermsContent: StyleProp<TextStyle>;
    collapsibleTermsContentText: StyleProp<TextStyle>;
  };
}

interface CollapsibleTermsState {
  activeSections: number[];
}

class AccordionComp extends Component<
  CollapsibleTermsProps,
  CollapsibleTermsState
> {
  state: CollapsibleTermsState = {
    activeSections: [],
  };

  _renderHeader = (section: SectionData) => {
    return (
      <View style={this.props.passStyles.collapsibleTermsViewHeader}>
        <Text style={this.props.passStyles.collapsibleTermsHeaderText}>
          {section.title}
        </Text>
      </View>
    );
  };

  _renderContent = (section: SectionData) => {
    return (
      <View style={this.props.passStyles.collapsibleTermsContent}>
        <Text style={this.props.passStyles.collapsibleTermsContentText}>
          {section.content}
        </Text>
      </View>
    );
  };

  _updateSections = (activeSections: number[]) => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <Accordion
        sections={SECTIONS}
        activeSections={this.state.activeSections}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
      />
    );
  }
}

// todo: split out styles, clicking is an unpleasant experience at the moment
const CollapsibleTerms = ({
  acceptTerms,
  onPress,
  passStyles,
}: {
  acceptTerms?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  passStyles?: {
    collapsibleTermsViewContainer?: StyleProp<ViewStyle>;
    collapsibleTermsViewHeader?: StyleProp<ViewStyle>;
    collapsibleTermsHeaderText?: StyleProp<ViewStyle>;
    collapsibleTermsContent?: StyleProp<TextStyle>;
    collapsibleTermsContentText?: StyleProp<TextStyle>;
  };
}) => {
  const styles = {
    collapsibleTermsViewContainer:
      passStyles?.collapsibleTermsViewContainer || {
        flexDirection: "row",
        alignItems: "center",
      },
    collapsibleTermsViewHeader: passStyles?.collapsibleTermsViewHeader || {},
    collapsibleTermsHeaderText: passStyles?.collapsibleTermsHeaderText || {},
    collapsibleTermsContent: passStyles?.collapsibleTermsContent || {},
    collapsibleTermsContentText: passStyles?.collapsibleTermsContentText || {},
  };

  return (
    <View style={styles.collapsibleTermsViewContainer}>
      <CheckBox
        checked={acceptTerms}
        onPress={onPress}
        containerStyle={{
          borderWidth: 0,
          paddingHorizontal: 0,
          backgroundColor: "transparent",
        }}
      />
      <AccordionComp passStyles={styles} />
    </View>
  );
};

export default CollapsibleTerms;

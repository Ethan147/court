import React, { Component } from "react";
import Accordion from "react-native-collapsible/Accordion";
import { View, Text, ViewStyle, StyleProp, TextStyle } from "react-native";
import { CheckBox } from "react-native-elements";

interface SectionData {
  title: string;
  content: string;
}

// todo get version information etc from API (to keep this up to date)
const SECTIONS: SectionData[] = [
  {
    title: "Agree to Terms and Conditions",
    content: "Lorem ipsum...",
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
        <Text style={this.props.passStyles.collapsibleTermsContentText} t>
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

const CollapsibleTerms = ({
  acceptTerms,
  passStyles,
}: {
  acceptTerms?: boolean;
  passStyles?: {
    collapsibleTermsViewContainer?: StyleProp<ViewStyle>;
    collapsibleTermsViewHeader: StyleProp<ViewStyle>;
    collapsibleTermsHeaderText: StyleProp<ViewStyle>;
    collapsibleTermsContent: StyleProp<TextStyle>;
    collapsibleTermsContentText: StyleProp<TextStyle>;
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

  const [checked, setChecked] = React.useState(false);

  return (
    <View style={styles.collapsibleTermsViewContainer}>
      <CheckBox
        checked={checked}
        onPress={() => setChecked(!checked)}
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

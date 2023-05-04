import React, { Component } from "react";
import Accordion from "react-native-collapsible/Accordion";
import { View, Text, ViewStyle, StyleProp } from "react-native";

interface SectionData {
  title: string;
  content: string;
}

const SECTIONS: SectionData[] = [
  {
    title: "First",
    content: "Lorem ipsum...",
  },
  {
    title: "Second",
    content: "Lorem ipsum...",
  },
];

interface CollapsibleTermsProps {}

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
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  _renderContent = (section: SectionData) => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
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

const styles = {
  content: {},
  header: {},
  headerText: {},
};

const CollapsibleTerms = ({
  acceptTerms,
  passStyles,
}: {
  acceptTerms?: boolean;
  passStyles?: {
    collapsibleTermsViewContainer?: StyleProp<ViewStyle>;
  };
}) => {
  const styles = {
    collapsibleTermsViewContainer:
      passStyles?.collapsibleTermsViewContainer || {},
    content: {},
    header: {},
    headerText: {},
  };

  return (
    <View style={styles.collapsibleTermsViewContainer}>
      <AccordionComp />
    </View>
  );
};

export default CollapsibleTerms;

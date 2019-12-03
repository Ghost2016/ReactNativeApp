/* @flow */
import React, { PureComponent } from "react";
//import { StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { TouchableOpacity, View as STView } from "@shoutem/ui";
import IntlText from "./IntlText";

type Props = {
  title: string,
  styleName: string,
  onPress: () => void
};

export default class TextLink extends PureComponent<Props> {
  props: Props;
  onPressAction = () => this.props.onPress();

  render() {
    const { style, title, styleName, txtStyle } = this.props;
    return (
      <TouchableOpacity
        style={{ alignItems: "center" }}
        onPress={this.onPressAction.bind(this)}
      >
        <STView styleName={styleName}>
          <IntlText style={[{ paddingVertical: 10 }, txtStyle]} title={title} />
        </STView>
      </TouchableOpacity>
    );
  }
}

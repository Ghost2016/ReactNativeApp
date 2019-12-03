/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  StatusBar
} from "react-native";
import PropTypes from "prop-types";
import SDTouchOpacity from "../common/SDTouchOpacity";
import { CSS } from "../common/SDCSS";
import { SDMainColor } from "../styles";
import Highlighter from "react-native-highlight-words";

let wHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({});

type Props = {
  word: string,
  textValue: string,
  highlightColor: string,
  item: object
};

export default class SearchBoxItem extends PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  _onPress(item) {
    this.props.onPress(item);
  }
  render() {
    return (
      <SDTouchOpacity
        style={{
          height: CSS.pixel(100, true),
          paddingLeft: CSS.pixel(30),
          borderBottomWidth: 1,
          borderBottomColor: "#efefef"
        }}
        onPress={this.props.onPress ? this._onPress.bind(this, this.props.item) : null}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Highlighter
            highlightStyle={{ color: this.props.highlightColor ? this.props.highlightColor : SDMainColor }}
            searchWords={[this.props.word]}
            textToHighlight={this.props.textValue}
          />
        </View>
      </SDTouchOpacity>
    );
  }
}

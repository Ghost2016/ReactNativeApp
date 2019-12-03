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

export default class SearchSchoolItem extends PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  _onPress(item) {
    this.props.onPress(item);
  }
  render() {
    return (
        <SDTouchOpacity
          onPress={this.props.onPress ? this.props.onPress : null}
          style={{
            height: CSS.pixel(122, true),
            paddingHorizontal: CSS.pixel(20),
            justifyContent: "center",
            borderBottomColor: "#efefef",
            borderBottomWidth: this.props.bodered === false ? 0 : 1
          }}
        >
          <Highlighter
            highlightStyle={{ color: "#fed200" }}
            searchWords={[this.props.searchText]}
            textToHighlight={this.props.fullText}
            style={{marginBottom: CSS.pixel(10,true), fontSize: CSS.pixel(30), fontWeight: '600', color: '#333'}}
          />
          <Highlighter
            highlightStyle={{ color: "#fed200" }}
            searchWords={[this.props.searchText]}
            textToHighlight={this.props.subFullText}
            style={{color: '#666', fontSize: CSS.pixel(24)}}
          />
        </SDTouchOpacity>
      );
  }
}

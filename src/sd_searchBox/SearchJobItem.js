/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import Highlighter from "react-native-highlight-words";
import { SDMainColor } from "../styles";
import SDTouchOpacity from "../common/SDTouchOpacity";
import { CSS } from "../common/SDCSS";

type Props = {
  placeholder: string
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: CSS.pixel(120, true),
    borderColor: "#eeeeee",
    borderBottomWidth: 1,
    paddingLeft: CSS.pixel(30),
    paddingRight: CSS.pixel(30)
  },
  schoolNameText: {
    color: "#666",
    fontSize: 18
  },
  remarkText: {
    color: "#999"
  }
});
export default class SearchJobItem extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <SDTouchOpacity
          style={{ flex: 1, justifyContent: "center" }}
          onPress={this.props.onPress ? this.props.onPress : null}
        >
          <View>
            <Highlighter
              highlightStyle={{
                color: this.props.highlightColor
                  ? this.props.highlightColor
                  : SDMainColor
              }}
              searchWords={[this.props.word]}
              textToHighlight={this.props.fullText}
              style={{
                color: "#333",
                fontSize: CSS.pixel(30),
                fontWeight: "600"
              }}
            />
          </View>
          {this.props.industry ? (
            <View style={{ marginTop: CSS.pixel(10, true) }}>
              <Text style={styles.remarkText}>{this.props.industry}</Text>
            </View>
          ): null}
        </SDTouchOpacity>
      </View>
    );
  }
}

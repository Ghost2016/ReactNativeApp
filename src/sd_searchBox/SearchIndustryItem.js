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
import SDTouchOpacity from "../common/SDTouchOpacity";
import { SDMainColor } from "../styles";
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
  remarkText: {
    color: "#c5c5c5"
  }
});
export default class SearchIndustryItem extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <SDTouchOpacity style={{flex: 1, justifyContent: 'center'}} onPress={this.props.onPress ? this.props.onPress : null}>
          <View>
            <Highlighter
                highlightStyle={{ color: this.props.highlightColor ? this.props.highlightColor : SDMainColor }}
                searchWords={[this.props.word]}
                textToHighlight={this.props.fullText}
                style={{color: '#333', fontSize: CSS.textSize(30), fontWeight: '600'}}
            />
          </View>
        </SDTouchOpacity>
      </View>
    );
  }
}

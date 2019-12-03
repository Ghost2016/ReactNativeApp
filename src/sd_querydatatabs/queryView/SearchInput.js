/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TextInput
} from "react-native";
import PropTypes from "prop-types";
import { SearchBar } from "antd-mobile";
import { CSS } from "../../common/SDCSS";
import SDTouchOpacity from "../../common/SDTouchOpacity";
type Props = {
  placeholder: string,
  onKeyChange: Function
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f6",
    borderRadius: CSS.pixel(50),
    height: CSS.pixel(58, true),
    borderColor: "#eee"
  }
});
export default class SearchInput extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      textValue: ""
    };
  }
  onKeyPress(e) {
    // Backspace
    // " "
    switch (e.nativeEvent.key) {
      case "Backspace":
        if (this.state.textValue !== "") {
          this.state.textValue = this.state.textValue.slice(0, -1);
        }
        break;
      default:
        this.state.textValue = this.state.textValue + e.nativeEvent.key;
        break;
    }
    this.handleOnChange();
  }
  onChange(text) {
    this.state.textValue = text;
    this.handleOnChange();
  }
  handleOnChange() {
    if (this.props.onKeyChange && this.props.onKeyChange instanceof Function) {
      this.props.onKeyChange(this.state.textValue);
    }
  }
  render() {
    return (
      <SDTouchOpacity
        style={{
          paddingTop: CSS.pixel(20, true),
          paddingBottom: CSS.pixel(20, true)
        }}
        onPress={
          Platform.OS == "android"
            ? this.props.onPress
              ? this.props.onPress
              : null
            : null
        }
      >
        {/* <SearchBar
          style={styles.container}
          maxLength={8}
          showCancelButton={false}
          autoCorrect={false}
          spellCheck={false}
          enablesReturnKeyAutomatically={true}
          onKeyPress={this.onKeyPress.bind(this)}
          onChange={this.onChange.bind(this)}
          {...this.props}
        /> */}
        <SearchBar
          placeholder={this.props.placeholder}
          style={styles.container}
          onTouchStart={
            Platform.OS == "ios"
              ? this.props.onTouchStart
                ? this.props.onTouchStart
                : null
              : null
          }
          disabled={true}
        />
      </SDTouchOpacity>
    );
  }
}

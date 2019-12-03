/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform
} from "react-native";
import PropTypes from "prop-types";
import { navScreen } from "@styles";

const styles = StyleSheet.create({
  container: {
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc"
    // backgroundColor: '#f9f9f9',
    backgroundColor: "#f9f9f9",
    // paddingLeft: 20,
    // paddingRight: 20,
    paddingBottom: 0,
    marginTop: 20,
    alignItems: "center",
    top: -20
  }
});

export default class DirectInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  onPressMore() {
    // this.goToScreen("example.DirectInfoTabsScreen");
    this.context.navigator.push(navScreen("DirectInfoTabsScreen", "资讯直击"));
  }
  render() {
    return (
      <View style={styles.container}>
        {this.props.isShowTitle == false ? null : (
          <TitleWrap
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              marginBottom: 5
            }}
            title="资讯直击"
            onPress={this.onPressMore.bind(this)}
          />
        )}
        <InfoList />
      </View>
    );
  }
}

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
import TitleWrap from "../sd_employmentinfo/titlelistwarp/TitleWrap";
import InfoList from "./infolist/InfoList";
import { navScreen } from "@styles";
import { CSS } from "../common/SDCSS";
import DirectInfoTabsScreen from "../screens/pushScreen/directInfoTab/DirectInfoTabScreen";

const styles = StyleSheet.create({
  container: {
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc"
    // backgroundColor: '#f9f9f9',
    backgroundColor: "#f1f1f1",
    // paddingLeft: 20,
    // paddingRight: 20,
    paddingBottom: 0,
    // marginBottom: 10,
    alignItems: "center",
    flex: 1
  }
});

export default class DirectInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };
  onPressMore() {
    this.context.navigator.push(
      navScreen("PushScreen", "资讯直击", {
        passProps: {
          screen: () => <DirectInfoTabsScreen />
        }
      })
    );
    // this.goToScreen("example.DirectInfoTabsScreen");
  }
  setItemShouldCheck(should) {
    this.context.refs["_flatList"].setItemShouldCheck(should);
  }
  fetchData(params) {
    return this.context.refs["_flatList"]
      .getHeaderNews(params)
      .then(res => res)
      .catch(err => {});
  }
  render() {
    const { newsType } = this.props;
    return (
      <View style={styles.container}>
        {this.props.isShowTitle == false ? null : (
          <TitleWrap
            style={{
              paddingLeft: CSS.pixel(30),
              paddingRight: CSS.pixel(30),
              paddingTop: CSS.pixel(30, true),
              paddingBottom: CSS.pixel(30, true)
            }}
            title="资讯直击"
            onPress={this.onPressMore.bind(this)}
          />
        )}
        <InfoList
          onFooterRefresh={this.props.onFooterRefresh}
          onHeaderRefresh={this.props.onHeaderRefresh}
          newsType={newsType}
          gRef="_flatList"
          isNeedCheck={false}
        />
      </View>
    );
  }
}

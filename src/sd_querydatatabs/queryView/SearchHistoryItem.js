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
  TouchableOpacity,
  Image
} from "react-native";
import { Toast } from "antd-mobile";
import PropTypes from "prop-types";
import { Navigation } from "react-native-navigation";
import { CSS } from "../../common/SDCSS";
import ConnectWithActions from "../../connectWithActions";
import config from "../../config";
import { navLightBox, navScreen } from "../../styles";
import { Popup } from "../../common";
import SchoolDetail from "../../screens/pushScreen/searchData/tabs/SchoolDetail";
import MajorDetail from "../../screens/pushScreen/searchData/tabs/MajorDetail";
import JobDetail from "../../screens/pushScreen/searchData/tabs/JobDetail";
import IndustryDetail from "../../screens/pushScreen/searchData/tabs/IndustryDetail";
import SDTouchOpacity from "../../common/SDTouchOpacity";

type Props = {
  placeholder: string
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: CSS.pixel(84, true),
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#efefef",
    paddingLeft: CSS.pixel(40),
    paddingRight: CSS.pixel(40)
  },
  leftBox: {
    flex: 1,
    justifyContent: "center"
  },
  textNormal: {
    textAlign: "left",
    color: "#333",
    fontSize: CSS.textSize(30)
  },
  rightBox: {
    justifyContent: "center"
  },
  icon: {
    color: "#fff"
  }
});
class SearchHistoryItem extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: () => null
  };
  searchSuggest() {
    // 直接弹出详情
    if (this.props.searchType === "school") {
      this.context.navigator.push(
        navScreen("PushScreen", "数据解析", {
          passProps: {
            screen: () => (
              <SchoolDetail
                is_liked={
                  this.context.refs["g_queryDataTabs"]
                    ? this.context.refs[
                        "g_queryDataTabs"
                      ].state.collectData.filter(c => {
                        return c.id == this.props.id;
                      }).length > 0
                      ? true
                      : false
                    : false
                }
                id={this.props.id}
                type={"searcher_school"}
                schoolText={this.props.content}
              />
            ),
            fullScreen: true,
            noScrollView: true
          }
        })
      );
    } else if (this.props.searchType === "major") {
      this.context.navigator.push(
        navScreen("PushScreen", "数据解析", {
          passProps: {
            screen: () => (
              <MajorDetail
                is_liked={
                  this.context.refs["g_queryDataTabs"]
                    ? this.context.refs[
                        "g_queryDataTabs"
                      ].state.collectData.filter(c => {
                        return c.id == this.props.id;
                      }).length > 0
                      ? true
                      : false
                    : false
                }
                id={this.props.id}
                type={"searcher_major"}
                majorText={this.props.content}
              />
            ),
            fullScreen: true,
            noScrollView: true
          }
        })
      );
    } else if (this.props.searchType === "position") {
      this.context.navigator.push(
        navScreen("PushScreen", "数据解析", {
          passProps: {
            screen: () => (
              <JobDetail
                is_liked={
                  this.context.refs["g_queryDataTabs"]
                    ? this.context.refs[
                        "g_queryDataTabs"
                      ].state.collectData.filter(c => {
                        return c.id == this.props.id;
                      }).length > 0
                      ? true
                      : false
                    : false
                }
                id={this.props.id}
                type={"searcher_job"}
                jobText={this.props.content}
              />
            ),
            fullScreen: true,
            noScrollView: true
          }
        })
      );
    } else if (this.props.searchType === "industry") {
      this.context.navigator.push(
        navScreen("PushScreen", "数据解析", {
          passProps: {
            screen: () => (
              <IndustryDetail
                is_liked={
                  this.context.refs["g_queryDataTabs"]
                    ? this.context.refs[
                        "g_queryDataTabs"
                      ].state.collectData.filter(c => {
                        return c.id == this.props.id;
                      }).length > 0
                      ? true
                      : false
                    : false
                }
                id={this.props.id}
                type={"searcher_profession"}
                industryText={this.props.content}
                industryId={parseInt(this.props.value)}
              />
            ),
            fullScreen: true,
            noScrollView: true
          }
        })
      );
    }
  }

  onPressDeleteItem() {
    this.props.actions.deleteRecordAction(
      this.props.id,
      this.props.searchType,
      res => {}
    );
  }

  render() {
    return (
      <SDTouchOpacity
        onPress={this.searchSuggest.bind(this)}
        style={{
          marginLeft: CSS.pixel(20),
          backgroundColor: "#eee",
          borderRadius: CSS.pixel(60),
          paddingLeft: CSS.pixel(20),
          paddingRight: CSS.pixel(20),
          paddingTop: CSS.pixel(15),
          paddingBottom: CSS.pixel(15),
          marginBottom: CSS.pixel(20)
        }}
      >
        <Text style={{ fontSize: CSS.textSize(30), color: "#333" }}>
          {this.props.content}
        </Text>
      </SDTouchOpacity>
    );

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.searchSuggest.bind(this)}
          style={styles.leftBox}
        >
          <Text style={styles.textNormal}>{this.props.content}</Text>
        </TouchableOpacity>
        <View style={styles.rightBox}>
          <TouchableOpacity onPress={this.onPressDeleteItem.bind(this)}>
            <Image source={require("@img/home/home_ico_delete.png")} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(SearchHistoryItem);

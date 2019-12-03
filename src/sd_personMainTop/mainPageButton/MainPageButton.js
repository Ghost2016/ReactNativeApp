/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  Image,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import { navScreen } from "@styles";
import { CSS } from "../../common/SDCSS";
import { isIphoneX } from "../../utils/iphonex";
import MyCollectionScreen from "../../screens/pushScreen/myCollection/MyCollectionScreen";
import TrackRecordScreen from "../../screens/pushScreen/trackRecord/TrackRecordScreen";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f3f3",
    flexDirection: "row",
    padding: CSS.pixel(30)
  },
  pageButtonBox: {
    width: CSS.pixel(330),
    height: isIphoneX() ? CSS.pixel(120, true) : CSS.pixel(140, true),
    borderColor: "#fff",
    // borderWidth: 1,
    borderRadius: CSS.pixel(10),
    backgroundColor: "#fff"
  }
});
let icons = {
  left: require("../../../img/home/home_ico_Resume.png"),
  right: require("../../../img/my/mine_ico_Collection.png")
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default class MainPageButton extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "center"
          }}
        >
          <PageButtonItem
            title="我的履历"
            icon={icons.left}
            style={{ marginRight: CSS.pixel(30) }}
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "我的履历", {
                  passProps: {
                    screen: () => <TrackRecordScreen />,
                    fullScreen: true,
                    noScrollView: true,
                    header: {
                      title: "我的履历",
                    },
                    navigatorButtons: {
                      rightButtons: [
                        {
                          icon: () => <Image source={require("@img/salary/home_ico_share02.png")}/>,
                          id: "track_share"
                        }
                      ]
                    }
                  }
                }),
              );
            }}
          />
          <PageButtonItem
            title="我的收藏"
            icon={icons.right}
            style={{ marginRight: 0 }}
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "我的收藏", {
                  passProps: {
                    screen: () => <MyCollectionScreen />,
                    header: {
                      title: "我的收藏"
                    },
                    fullScreen: true,
                    noScrollView: true
                  },
                  navigatorButtons: {
                    rightButtons: [
                      {
                        title: "管理", // for icon button, provide the local image asset name
                        id: "collect_manage" // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                      }
                    ]
                  }
                })
              );
            }}
          />
        </View>
      </View>
    );
  }
}

class PageButtonItem extends React.Component {
  render() {
    return (
      <View style={[styles.pageButtonBox, { ...this.props.style }]}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={this.props.onPress ? this.props.onPress : null}
        >
          <View
            style={{
              marginRight: CSS.pixel(30)
            }}
          >
            <Image source={this.props.icon} />
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#333", fontSize: 16 }}>
              {this.props.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

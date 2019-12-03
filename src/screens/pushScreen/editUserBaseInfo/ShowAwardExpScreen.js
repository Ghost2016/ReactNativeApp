import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { navScreen, navRightButton } from "@styles";
import { Toast, Modal } from "antd-mobile";
import { Icon } from "@shoutem/ui";
import ConnectWithActions from "../../../connectWithActions";
import { UserState, awardExpModel } from "../../../types";
import { navLightBox } from "@styles";
import AddAwardExpScreen from "./AddAwardExpScreen";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { CSS } from "../../../common/SDCSS";
import { SDMainColor } from "../../../styles";
import EditAwardExpScreen from "./EditAwardExpScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
  },
  saveBtnBox: {
    marginTop: 20,
    marginBottom: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

type Props = {
  userInfo: UserState,
  awardExpList: awardExpModel[]
};

// 显示获奖经历
class ShowAwardExpScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };
  onPressDeleteItem(id) {
    navLightBox("ConfirmLightBoxScreen", {
      passProps: {
        title: "你确定要删除?",
        onOk: () => {
          Toast.loading("删除中");
          this.props.actions.deleteAwardExpItemAction(
            {
              id: id
            },
            () => {
              Toast.info("删除成功");
            }
          );
        }
      }
    });
  }
  componentWillUnmount() {
    // 刷新我的数据
    this.props.actions.getUserInfoAction();
  }

  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "show_add_awardExp_btn"
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "show_add_awardExp_btn") {
        this.context.navigator.push(
          navScreen("PushScreen", "添加获奖经历", {
            passProps: {
              screen: () => <AddAwardExpScreen />,
              fullScreen: true,
              noScrollView: true,
              header: {
                title: "添加获奖经历"
              }
            },
            ...navRightButton("save_addAwardExpBtn", "保存")
          })
        );
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {this.props.awardExpList.map(item => {
            return (
              <AwardExpItem
                key={item.id + ""}
                award={item}
                onPressDeleteItem={this.onPressDeleteItem.bind(this, item.id)}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
type PropsAward = {
  award: awardExpModel,
  onPressDeleteItem: ?Function
};
class AwardExpItem extends React.PureComponent<PropsAward> {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={{ marginTop: 10, padding: 10, backgroundColor: "#fff" }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: 20,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Icon
              name="checkbox-on"
              style={{
                color:
                  this.props.award.audit_status == "audit_pass"
                    ? "#fed200"
                    : "#E5E5E5",
                fontSize: 14
              }}
            />
          </View>
          <View
            style={{
              flexWrap: "wrap",
              flex: 1,
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <Text style={{ color: "#333", fontSize: 14}}>
              {this.props.award.acquire_date.slice(0, 7).replace(/-/, ".")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.context.navigator.push(
                  navScreen("PushScreen", "编辑获奖经历", {
                    passProps: {
                      screen: () => (
                        <EditAwardExpScreen award={this.props.award} />
                      ),
                      noScrollView: true,
                      fullScreen: true,
                      header: {
                        title: "编辑获奖经历"
                      }
                    },
                    ...navRightButton("edit_awardExpBtn", this.props.award.audit_status == 'audit_pass' ? "" : "保存")
                  })
                );
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Image
                source={require("@img/my/TrackRecord/mine_Resume_btn_edit.png")}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            paddingVertical: CSS.pixel(10),
            flexDirection: "row",
            paddingHorizontal: CSS.pixel(30),
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#333", fontSize: 14 }}>
            {this.props.award.name}
          </Text>
        </View>

        {this.props.award.images.length > 0 ? (
          <ScrollView
            style={{ marginTop: 5, marginLeft: 5, flexDirection: "row", marginBottom: 5}}
            horizontal={true}
          >
            {this.props.award.images.map((image, index) => {
              return (
                <View
                  key={index + ""}
                  style={{ height: CSS.pixel(200), width: CSS.pixel(300), marginRight: 10 }}
                >
                  <Image
                    source={{ uri: image.url + "?imageView2/2/w/600/h/400" }}
                    style={{ height: CSS.pixel(200), width: CSS.pixel(300) }}
                  />
                  <Image
                    style={{ position: "absolute", right: 0, top: 0 }}
                    source={
                      this.props.award.audit_status == "audit_pass"
                        ? null
                        : this.props.award.audit_status == "doing"
                          ? require("@img/my/TrackRecord/mine_Resume_ico_ShenHe.png")
                          : this.props.award.audit_status ==
                            "audit_failure"
                            ? require("@img/my/TrackRecord/mine_Resume_ico_BuTongGuo.png")
                            : null
                    }
                  />
                </View>
              );
            })}
          </ScrollView>
        ) : null}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user,
  awardExpList: state.userAwardExpList
}))(ShowAwardExpScreen);

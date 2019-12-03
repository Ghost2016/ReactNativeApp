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
import ConnectWithActions from "../connectWithActions";
import { UserState, certificateModel } from "../types";
import { navLightBox } from "@styles";
import SDTouchOpacity from "../common/SDTouchOpacity";
import { SDMainColor } from "../styles";
import { CSS } from "../common/SDCSS";
import AddCertificateScreen from "../screens/pushScreen/addCertificate/AddCertificateScreen";
import EditCertificateScreen from '../screens/pushScreen/editCertificate/EditCertificateScreen';

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
  certificateList: certificateModel[]
};

// 显示获奖经历
class ShowCertificateScreen extends React.PureComponent<Props> {
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
          this.props.actions.delUserCertificateAction(
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
      "show_add_certificate_btn"
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "show_add_certificate_btn") {
        this.context.navigator.push(
          navScreen("PushScreen", "添加证书", {
            passProps: {
              screen: () => <AddCertificateScreen />,
              fullScreen: true,
              noScrollView: true,
              header: {
                title: "添加证书"
              }
            },
            ...navRightButton("save_CertificateBtn", "保存")
          })
        );
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {this.props.certificateList.map(item => {
            return (
              <CertificateItem
                key={item.id + ""}
                certificate={item}
                onPressDeleteItem={this.onPressDeleteItem.bind(this, item.id)}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
type PropsCertificate = {
  certificate: certificateModel,
  onPressDeleteItem: ?Function
};
class CertificateItem extends React.PureComponent<PropsCertificate> {
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
              style={{ color: this.props.certificate.audit_status == 'audit_pass' ? "#fed200" : '#e5e5e5', fontSize: 14 }}
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
              {this.props.certificate.acquire_date
                .slice(0, 7)
                .replace(/-/, ".")}
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
                  navScreen("PushScreen", "编辑证书", {
                    passProps: {
                      screen: () => <EditCertificateScreen certificate={this.props.certificate}/>,
                      fullScreen: true,
                      noScrollView: true,
                      header: {
                        title: "编辑证书"
                      }
                    },
                    ...navRightButton("edit_CertificateBtn", this.props.certificate.audit_status == 'audit_pass' ? '' : "保存")
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
        <View style={{paddingVertical: CSS.pixel(10), flexDirection: 'row', paddingHorizontal: CSS.pixel(30), alignItems: 'center'}}>

            <Text style={{ color: "#333", fontSize: 14 }}>
              {this.props.certificate.certificate.name}
            </Text>
            {
              this.props.certificate.audit_status == 'audit_pass' && this.props.certificate.score ? 
              <Text style={{ color: "#333", fontSize: 14}}>
                {"/" + this.props.certificate.score}
              </Text> : null
            }
        </View>
        {this.props.certificate.attachments &&
        this.props.certificate.attachments.length ? (
          <ScrollView
            style={{ marginTop: 5, marginLeft: CSS.pixel(24), marginBottom: 5, flexDirection: "row" }}
            horizontal={true}
          >
            {this.props.certificate.attachments.map((c, index) => {
              return (
                <View
                  key={index + ""}
                  style={{ height: CSS.pixel(200), width: CSS.pixel(300), marginRight: 5 }}
                >
                  <Image
                    source={{ uri: c.url + "?imageView2/2/w/600/h/400" }}
                    style={{ height: CSS.pixel(200), width: CSS.pixel(300) }}
                  />
                  <Image style={{position: 'absolute', right: 0, top: 0}} source={this.props.certificate.audit_status == 'audit_pass' ? null : this.props.certificate.audit_status == 'doing' ? require("@img/my/TrackRecord/mine_Resume_ico_ShenHe.png") : this.props.certificate.audit_status == 'audit_failure' ? require("@img/my/TrackRecord/mine_Resume_ico_BuTongGuo.png") : null}/>
                  
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
  certificateList: state.certificateList
}))(ShowCertificateScreen);

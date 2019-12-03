import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import PropTypes from "prop-types";
import { navScreen, navRightButton } from "@styles";
import LabelInput from "../../../common/SDLabelInput";
import ConnectWithActions from "../../../connectWithActions";
import { UserState } from "../../../types";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor } from "../../../styles";
import CitySelect from "../../../sd_citySelect/CitySelect";
import { Toast } from "antd-mobile";
import SDList from "../../../common/SDList";
import ActionSheet from "react-native-actionsheet";
import ImagePicker from "react-native-image-crop-picker";
import { notValidField } from "@utils/funcs";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import KeyboardSpacer from "../../../common/SDKeyboardSpacer";
import { isIphoneX } from "../../../utils/iphonex";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

type Props = {
  userInfo: UserState
};

// 编辑用户基本信息
class EditUserbaseInfoScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      gender: this.props.userInfo.gender,
      avatarData: null,
      realEmail: this.props.userInfo.email
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };

  componentDidMount() {
    this.props.actions.getUploadTokenAction({
      isPrivate: false
    });

    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "user_profile_save"
    );
  }

  // 上传图片
  async uploadPic(list) {
    let resultUpload = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      let data = new FormData();
      let picName = element.filename
        ? element.filename.slice(0, element.filename.lastIndexOf(".")) +
          new Date().getTime() +
          ".JPG"
        : new Date().getTime() + ".JPG";
      // console.warn(this.props.uploadToken)
      data.append("token", this.props.uploadToken);
      data.append("file", {
        uri: element.path,
        name: picName,
        type: "image/jpeg"
      });
      data.append("key", picName);

      data.append("x:userid", this.props.userInfo.id);
      data.append("x:usage", "post");
      const result = await this.uploadItem(data);
      // console.log(result);
      if (!result.error) {
        if (result.status == "ok") {
          resultUpload.push(result);
        }
      }
    }
    return resultUpload;
  }

  uploadItem(data) {
    return new Promise((reso, rej) => {
      this.props.actions.uploadFileAction(data, res => {
        reso(res);
      });
    });
  }

  pickerPhoto(index) {
    switch (index) {
      case 0: // 打开相机
        ImagePicker.openCamera({
          // cropping: true,
          // cropperChooseText: "选择",
          // cropperCancelText: "取消",
          loadingLabelText: "获取中"
          // cropperToolbarTitle: "编辑图片"
        }).then(async images => {
          Toast.loading("上传头像中", 0);
          let timer = setTimeout(() => {
            if (timer) {
              clearTimeout(timer);
              timer = null;
              Toast.fail("上传图片超时");
            }
          }, 100000);
          const result = await this.uploadPic([images]);
          if (timer) {
            clearTimeout(timer);
            timer = null;
            Toast.hide();
          }
          if (result && result.length > 0) {
            this.setState({
              avatarData: result[0]
            });
            Toast.info("请记得保存哦...", 0.5);
          }
        });
        break;
      case 1:
        ImagePicker.openPicker({
          loadingLabelText: "获取中"
          // cropping: true
        }).then(async images => {
          Toast.loading("上传头像中", 0);
          let timer = setTimeout(() => {
            if (timer) {
              clearTimeout(timer);
              timer = null;
              Toast.fail("上传图片超时");
            }
          }, 100000);
          const result = await this.uploadPic([images]);
          if (timer) {
            clearTimeout(timer);
            timer = null;
            Toast.hide();
          }
          if (result && result.length > 0) {
            this.setState({
              avatarData: result[0]
            });
            Toast.info("请记得保存哦...", 0.5);
          }
        });
        break;
      default:
        break;
    }
  }

  async onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "user_profile_save") {
        Toast.loading("保存中");

        // 判断是在个人设置保存
        // 还是在个人履历中设置保存
        if(this.props.noPic) {
          if(this.refs["_nameInput"].state.value.length < 2 || this.refs["_nameInput"].state.value.length > 20) {
            Toast.fail("用户名过长或者过短", 1);
            return;
          }

          // 判断联系方式
          if(this.refs["_cantactInput"].state.value != "") {
            if(notValidField(this.refs["_cantactInput"].state.value, "phone")) {
              return;
            }
          }

          let _email = "";
          if (this.refs["_emailInput"].state.value != "") {
            // 邮箱
            if(notValidField(this.refs["_emailInput"].state.value, "email", "输入正确的邮箱地址")) {
              return false;
            } else {
              _email = this.refs["_emailInput"].state.value;
            }
          } else {
            // 判断原来是否有邮箱
            if(this.props.userInfo.email != "") {
              Toast.info("邮箱不能为空", 1);
              return;
            }
          }

          if (this.refs["_nameInput"].state.value != "") {
              let cityData = {};
              if(this.state.cityName != "" && this.state.provinceName != "") {
                cityData = {
                  city_name: this.state.cityName,
                  province_name: this.state.provinceName
                }
              }
            await this.props.actions.updateBaseInfoAction({
              // nickname: this.refs["_nameInput"].state.value,
              real_name: this.refs["_nameInput"].state.value,
              contact: this.refs["_cantactInput"].state.value || "",
              gender: this.state.gender,
              ...cityData
            });
          }

          try {
            if(_email != "") {
              await this.props.actions.updateUserEmailAction({
                email: _email
              });
            }
          } catch (error) {}
        } else {
          if(this.refs["_nameInput"].state.value.length < 2 || this.refs["_nameInput"].state.value.length > 20) {
            Toast.fail("用户名过长或者过短", 1);
            return;
          }
          
          if (this.refs["_nameInput"].state.value != "") {
            let avatarInfo = this.state.avatarData
              ? { avatar_id: this.state.avatarData.id }
              : {};
              let cityData = {};
              if(this.state.cityName != "" && this.state.provinceName != "") {
                cityData = {
                  city_name: this.state.cityName,
                  province_name: this.state.provinceName
                }
              }
            await this.props.actions.updateBaseInfoAction({
              real_name: this.refs["_nameInput"].state.value,
              // nickname: this.refs["_nameInput"].state.value,
              gender: this.state.gender,
              ...cityData,
              ...avatarInfo
            });
          }
        }

        this.props.actions.getUserInfoAction();

        setTimeout(() => {
          Toast.hide();
          this.context.navigator.pop();
        }, 1000);
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f3f3f3'}}>
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">
        <View
          style={{
            marginTop: CSS.pixel(20),
            backgroundColor: "#fff",
          }}
        >
          {!this.props.noPic && (
            <View style={{borderBottomColor: '#f3f3f3', borderBottomWidth: 1}}>
            <SDList
              listOptions={[
                {
                  name: "更换头像",
                  direction: ">",
                  subInfo: {
                    avatar: this.state.avatarData
                      ? this.state.avatarData.url + "?imageView2/2/h/60"
                      : this.props.userInfo.avatar
                        ? this.props.userInfo.avatar.url + "?imageView2/2/h/60"
                        : this.props.userInfo.gender === "male"
                          ? require("@img/avator/male.png")
                          : require("@img/avator/female.png")
                  },
                  onPress: () => {
                    this.actionSheet.show();
                  },
                  listItemNameStyle: {
                    fontSize: CSS.textSize(30),
                    color: "#666"
                  },
                  bottomBorder: false
                }
              ]}
            />
            </View>
          )}
          <LabelInput
            placeholder="姓名"
            placeholderRight="请输入姓名"
            defaultValue={this.props.userInfo.real_name}
            // defaultValue={this.props.userInfo.nickname}
            ref="_nameInput"
          />
          <LabelInput
            placeholder="性别"
            other={() => {
              return (
                <View
                  style={{
                    paddingRight: CSS.pixel(20),
                    height: "100%",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end"
                  }}
                >
                  <SDTouchOpacity
                    onPress={() => {
                      this.setState({
                        gender: "male"
                      });
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor:
                          this.state.gender == "female"
                            ? "#bfbfbf"
                            : SDMainColor,
                        backgroundColor:
                          this.state.gender == "female"
                            ? "transparent"
                            : SDMainColor,
                        borderRadius: CSS.pixel(20),
                        width: CSS.pixel(20),
                        height: CSS.pixel(20)
                      }}
                    >
                      <View />
                    </View>
                    <View style={{ marginLeft: CSS.pixel(10) }}>
                      <Text
                        style={{ color: "#333", fontSize: CSS.textSize(30) }}
                      >
                        男
                      </Text>
                    </View>
                  </SDTouchOpacity>
                  <SDTouchOpacity
                    onPress={() => {
                      this.setState({
                        gender: "female"
                      });
                    }}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: CSS.pixel(60)
                    }}
                  >
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor:
                          this.state.gender == "male" ? "#bfbfbf" : SDMainColor,
                        backgroundColor:
                          this.state.gender == "male"
                            ? "transparent"
                            : SDMainColor,
                        borderRadius: CSS.pixel(20),
                        width: CSS.pixel(20),
                        height: CSS.pixel(20)
                      }}
                    >
                      <View />
                    </View>
                    <View style={{ marginLeft: CSS.pixel(10) }}>
                      <Text
                        style={{ color: "#333", fontSize: CSS.textSize(30) }}
                      >
                        女
                      </Text>
                    </View>
                  </SDTouchOpacity>
                </View>
              );
            }}
          />
          <LabelInput
            ref="_cityInput"
            placeholder="所在地区"
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "选择地区", {
                  passProps: {
                    screen: () => (
                      <CitySelect
                        isNeedNext
                        onGetPosition={(p, c, a) => {
                          // this.props.actions
                          //   .updateBaseInfoAction({
                          //     city_name: c ? c.name : "",
                          //     province_name: p ? p.name : ""
                          //   })
                          //   .then(res => {})
                          //   .catch(err => {});
                          this.state.provinceName = p ? p.name : "";
                          this.state.cityName = c ? c.name : "";
                          this.refs["_cityInput"].setState({
                            value: c ? c.name : ""
                          });
                        }}
                      />
                    ),
                    noScrollView: true,
                    fullScreen: true,
                    header: {
                      title: "选择地区"
                    }
                  }
                })
              );
            }}
            defaultValue={
              this.props.userInfo.city ? this.props.userInfo.city.name : ""
            }
            editable={false}
            direction=">"
          />
          {
            this.props.noPic && 
            <LabelInput
              ref="_cantactInput"
              placeholder="联系方式"
              placeholderRight="请输入联系方式"
              defaultValue={this.props.userInfo.contact || this.props.userInfo.phone}
            />
          }
          {this.props.noPic && 
          <LabelInput
            onChange={(t) => {
              this.state.realEmail = t;
            }}
            ref="_emailInput"
            placeholder="电子邮箱"
            placeholderRight="请输入电子邮箱"
            defaultValue={this.state.realEmail}
          />
          }
        </View>

        <ActionSheet
          ref={o => (this.actionSheet = o)}
          title={"请选择打开图片方式"}
          options={["相机", "图库", "取消"]}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={this.pickerPhoto.bind(this)}
        />

     </ScrollView>
     <KeyboardSpacer topSpacing={isIphoneX() ? -34 : 0}/>
     </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  userInfo: state.user,
  uploadToken: state.uploadToken
}))(EditUserbaseInfoScreen);

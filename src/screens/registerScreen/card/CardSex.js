import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  TextInput,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { InputItem } from "antd-mobile";
import { CSS } from "../../../common/SDCSS";
import ConnectWithActions from "../../../connectWithActions";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import ActionSheet from "react-native-actionsheet";
import { _pickerPhoto } from "@utils/funcs";
import ImagePicker from "react-native-image-crop-picker";
import { notValidField } from "@utils/funcs";
import { Toast } from "antd-mobile";

const no01 = require("@img/login/login_ico_female_normal.png");
const se01 = require("@img/login/login_ico_female_selected.png");

const no02 = require("@img/login/login_ico_male_normal.png");
const se02 = require("@img/login/login_ico_male_selected.png");

const no03 = require("@img/my/mine_btn_Release.png");
const se03 = require("@img/my/mine_btn_Release.png");

const styles = StyleSheet.create({
  btnGroupItem: {
    // borderColor: "#999",
    // borderRadius: 2,
    // borderWidth: 1,
    // paddingLeft: 20,
    // paddingRight: 20,
    // paddingTop: 4,
    // paddingBottom: 4,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 14,
    color: "#999",
    marginTop: 5
  }
});

// 性别
class CardSex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sexText: "",
      nickText: "",
      avatorText: "",
      photoBtns: ["相机", "图库", "取消"],
      photoBtnsCancelIndex: 2,
      photoBtnsFocusIndex: 1,
      photoBtnsCameraIndex: 0,
      photoBtnsTitle: "请选择打开图片方式?",
      avatarData: null, /* {
        url: 'https://cdn-beat.zhimekaimen.com/IMG_00011545293099015.JPG',
        id: 2504,
      },//null */
    };
  }

  componentWillMount() {
    this.props.actions.getUploadTokenAction({
      isPrivate: false
    });
  }

  componentDidMount = () => { }

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
      data.append("token", this.props.uploadToken);
      data.append("file", {
        uri: element.path,
        name: picName,
        type: "image/jpeg"
      });
      data.append("key", picName);

      data.append("x:userid", this.props.user.id);
      data.append("x:usage", "post");
      const result = await this.uploadItem(data);
      //console.log("[][]uplolad result", result)
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

  onEnterNickText(text) {
    //console.log("^^^ === onEnterNickText", text)
  }

  onChangeNickText(text) {
    //console.log("onChangeNickText", text)
    /* if(notValidField(text, 'nickname')){
      return
    } */
    //昵称
    this.setState({
      nickText: text
    });
    this.context.refs["regis_Screen"].setState({
      nickText : text
    });
    if(this.context.refs["regis_Screen"].state.sexText && text.trim().length >= 2){
      this.context.refs["regis_Screen"].setState({
        isDisabled: false,
        snapX: CSS.width() * 5
      });
    } else {
      this.context.refs["regis_Screen"].setState({
        isDisabled: true,
        snapX: CSS.width() * 5
      });
    }

  }

  onPressSex(text) {
    // if (this.state.sexText == text) {
    //   // 跳转到下一步
    //   this.context.refs["regis_Screen"]._carousel.snapToItem(5);
    // } else {
    this.setState({
      sexText: text
    });
    this.context.refs["regis_Screen"].setState({
      sexText : text
    });
    if(this.context.refs["regis_Screen"].state.nickText) this.context.refs["regis_Screen"].setState({
      isDisabled: false,
      snapX: CSS.width() * 5
    });
    // }
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };

  onPressAvator() {
    this.actionSheet.show();
  }

  pickerPhoto(index) {
    switch (index) {
      case 0: // 打开相机
        ImagePicker.openCamera({
          // cropping: true,
          // cropperChooseText: "选择",
          // cropperCancelText: "取消",
          loadingLabelText: "获取中",
          // cropperToolbarTitle: "编辑图片"
        }).then(async images => {
          Toast.loading("上传头像中", 0);
          let timer = setTimeout(() => {
            if (timer) {
              clearTimeout(timer);
              timer = null;
              Toast.hide();
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

            if(result[0].id) this.context.refs["regis_Screen"].setState({
              avatorText : result[0].id
            });
          }
        });
        break;
      case 1:
        ImagePicker.openPicker({
          loadingLabelText: "获取中",
          // cropping: true
        }).then(async images => {
          Toast.loading("上传头像中", 0);
          let timer = setTimeout(() => {
            if (timer) {
              clearTimeout(timer);
              timer = null;
              Toast.hide();
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
          }
        });
        break;
      default:
        break;
    }
  }

  render() {
    const { user } = this.props;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#fff",
            borderWidth: 2,
            borderRadius: 4,
            borderColor: "#fff",
            padding: 20
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            <Text
              style={{
                color: "#333",
                fontSize: 18,
                marginBottom: 10,
                fontWeight: "bold"
              }}
            >
              性别
            </Text>
            <View
              style={{
                width: 30,
                borderBottomColor: "#333",
                borderBottomWidth: 3
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              //flex: 1,
              justifyContent: "space-around",
              alignContent: "space-around",
              width: '100%',
              height: 100,
              borderWidth: 0,
              borderColor: '#f00',
            }}
          >
            <View
              style={{
                width: 110,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                style={{
                  marginTop: 10
                }}
                onPress={this.onPressSex.bind(this, "male")}
              >
                <View style={styles.btnGroupItem}>
                  <Image
                    source={this.state.sexText === "male" ? se02 : no02}
                    style={{ width: 60, height: 60 }}
                    resizeMode="stretch"
                  />
                  <Text style={styles.title}>安静的美男子</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: 110,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                style={{
                  marginTop: 10
                }}
                onPress={this.onPressSex.bind(this, "female")}
              >
                <View style={styles.btnGroupItem}>
                  <Image
                    source={this.state.sexText === "female" ? se01 : no01}
                    style={{ width: 60, height: 60 }}
                    resizeMode="stretch"
                  />
                  <Text style={styles.title}>豪迈的萌妹子</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "#333",
                fontSize: 18,
                marginBottom: 10,
                fontWeight: "bold"
              }}
            >
              设置昵称
            </Text>
            <View
              style={{
                width: 30,
                borderBottomColor: "#333",
                borderBottomWidth: 3
              }}
            />
          </View>

          <SDTouchOpacity
            style={{
              marginTop: CSS.pixel(30, true),
              marginBottom: CSS.pixel(30, true),
              // height: CSS.pixel(40, true),
              left: CSS.pixel(10),
              height: CSS.pixel(80, true),
              borderBottomColor: "#efefef",
              borderBottomWidth: 1,
              justifyContent: "center"
            }}
            //onPress={Platform.OS == "android" ? this.pushSearch.bind(this) : null}
          >
            <TextInput
              ref="inputNick"
              style={{ padding: 0, color: '#333'}}
              value={this.state.nickText}
              //onSubmitEditing={this.onEnterNickText.bind(this)}
              onChangeText={this.onChangeNickText.bind(this)}
              underlineColorAndroid="transparent"
              type="text"
              placeholder="输入昵称"
              returnKeyType="done"
              returnKeyLabel="完成"
              editable={true}
              //onTouchStart={
                //Platform.OS == "ios" ? this.pushSearch.bind(this) : null
              //}
            />
          </SDTouchOpacity>

          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "#333",
                fontSize: 18,
                marginBottom: 10,
                fontWeight: "bold"
              }}
            >
              上传头像
            </Text>
            <View
              style={{
                width: 30,
                borderBottomColor: "#333",
                borderBottomWidth: 3
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              marginTop: 10,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.onPressAvator.bind(this)}
          >
            <View style={[{
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: 2,
              borderColor: '#ccc',
              overflow: 'hidden',
            }, styles.btnGroupItem]}>
              <Image
                source={(this.state.avatarData && this.state.avatarData.url)
                  ? { uri: this.state.avatarData.url + "?imageView2/2/h/60"}
                  : no03}
                style={(this.state.avatarData && this.state.avatarData.url) ? { width: 60, height: 60 } : { width: 26, height: 20 }}
                resizeMode="stretch"
              />
              <View style={{
                position: 'absolute',
                top: -2,
                bottom: -2,
                right: -2,
                left: -2,
                borderRadius: 60 / 2 + 2 / 2,
                borderWidth: 2,
                borderColor: '#fff'
              }}/>
            </View>
          </TouchableOpacity>

          <View
            style={{
              position: "absolute",
              bottom: 10,
              left: 0,
              right: 0,
              alignItems: "center",
              paddingHorizontal: 20
            }}
          >
            <Text
              style={{ color: "#f98a24", fontSize: 12, textAlign: "center" }}
            >
              信息提交后不可修改，请确保信息真实有效
            </Text>
          </View>

        </View>

        <ActionSheet
          ref={o => (this.actionSheet = o)}
          title={"请选择打开图片方式"}
          options={["相机", "图库", "取消"]}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={this.pickerPhoto.bind(this)}
        />
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: state.user,
  uploadToken: state.uploadToken
}))(CardSex);

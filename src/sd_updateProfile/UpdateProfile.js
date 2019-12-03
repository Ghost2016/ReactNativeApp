/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import store from "@boot/store";
import ConnectWithActions from "@src/connectWithActions";
import { setUserState, setAppToken, prepareUserInfo } from "@boot/actions";
import { Toast } from "antd-mobile";
import { List } from "../common/index";
import SchoolTimeLine from "./schoolTimeLine/SchoolTimeLine";
import { Navigation } from "react-native-navigation";
import { navLightBox } from "@styles";
import { _pickerPhoto } from "@utils/funcs";
import ActionSheet from "react-native-actionsheet";
import { getUserBaseInfo } from "@src/users/usersSelector";
import TakePhoto from "../common/SDTakePhoto";
import { getUserAllInfo } from "../users/usersSelector";
import ImagePicker from "react-native-image-crop-picker";
import { navScreen, navRightButton } from "../styles";
import { UserState } from "../types";

const imagePickerOptions = {
  title: "请选择打开图片方式",
  takePhotoButtonTitle: "拍照",
  chooseFromLibraryButtonTitle: "图库",
  cancelButtonTitle: "取消",
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

type Props = {
  user: UserState
}

// 修改资料界面
class UpdateProfile extends PureComponent<Props> {
  constructor(props) {
    super(props);
    store.subscribe(this.onStoreUpdate.bind(this));
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  state = {
    nickname: "",
    city: "",
    province: "",
    area: "",
    photoBtns: ["相机", "图库", "取消"],
    photoBtnsCancelIndex: 2,
    photoBtnsFocusIndex: 1,
    photoBtnsCameraIndex: 0,
    photoBtnsTitle: "请选择打开图片方式?",
    avatarData: null
  };

  onStoreUpdate() {
    let isEdit = false;
    if (store.getState().prepareToupdate.nickname) {
      isEdit = true;
      this.setState({
        nickname: store.getState().prepareToupdate.nickname
      });
    }

    if (store.getState().prepareToupdate.city) {
      isEdit = true;
      this.setState({
        city: store.getState().prepareToupdate.city
      });
    }

    if (store.getState().prepareToupdate.province) {
      isEdit = true;
      this.setState({
        province: store.getState().prepareToupdate.province
      });
    }

    if (
      store.getState().prepareToupdate.city &&
      store.getState().prepareToupdate.province
    )
      this.setState({
        area:
          store.getState().prepareToupdate.province +
          store.getState().prepareToupdate.city
      });

    if (
      store.getState().user.nickname !== this.props.user.nickname &&
      !isEdit
    ) {
      this.setState({
        nickname: store.getState().user.nickname
      });
    }

    if (store.getState().user.city !== this.props.user.city && !isEdit) {
      this.setState({
        city: store.getState().user.city,
        area: store.getState().user.province + store.getState().user.city
      });
    }

    if (
      store.getState().user.province !== this.props.user.province &&
      !isEdit
    ) {
      this.setState({
        province: store.getState().user.province,
        area: store.getState().user.province + store.getState().user.city
      });
    }
  }

  componentWillMount() {
    const { prepareToupdate, user } = this.props;
    const nickname =
      prepareToupdate && prepareToupdate.nickname
        ? prepareToupdate.nickname
        : user.nickname || "";
    const city =
      prepareToupdate && prepareToupdate.city
        ? prepareToupdate.city
        : user.city ? user.city.name : "";
    const province =
      prepareToupdate && prepareToupdate.province
        ? prepareToupdate.province
        : user.city && user.city.province ? user.city.province.name : "";
    const area = province + city;
    this.setState({
      nickname: nickname,
      city: city,
      province: province,
      area: area
    });

    this.props.actions.getUploadTokenAction({
      isPrivate: false
    });
  }

  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }

  onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "user_profile_save") {
        //console.log("this.props.prepareToupdate", store.getState().prepareToupdate)
        //return
        //统一保存

        let postData = {
          nickname: store.getState().prepareToupdate.nickname,
          // city_title: store.getState().prepareToupdate.city,
          // province_title: store.getState().prepareToupdate.province
        };
        if (this.state.avatarData) {
          postData.avatar_id = this.state.avatarData.id;
        }
        this.props.actions.updateUserProfileAction(postData, res => {
          if (res.status == "ok") {
            // zxy todo
            // store.dispatch(
            //   prepareUserInfo({
            //     nickname: "",
            //     city: "",
            //     province: ""
            //   })
            // );
            // store.dispatch(setAppToken(res.results));
            Toast.success("保存成功");
            // 无需此操作
            // 已经在action里完成了
            // this.props.actions.getUserInfoAction();
            this.context.navigator.pop();
          } else {
            Toast.fail("修改个人信息失败");
          }
        });
      }
    }
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
    //console.warn(user)
    return (
      <ScrollView style={styles.container}>
        <View>
          <List
            listOptions={[
              {
                name: "更换头像",
                direction: ">",
                listItemNameStyle: {
                  color: "#999"
                },
                subInfo: {
                  avatar: this.state.avatarData
                    ? this.state.avatarData.url + "?imageView2/2/h/60"
                    : user.avatar
                      ? user.avatar.url + "?imageView2/2/h/60"
                      : user.gender === "male"
                        ? require("@img/avator/male.png")
                        : require("@img/avator/female.png")
                },
                onPress: () => {
                  this.actionSheet.show();
                }
              },
              {
                name: "昵称",
                direction: ">",
                subInfo: this.state.nickname || user.nickname || "",
                listItemNameStyle: {
                  color: "#999"
                },
                onPress: () => {
                  navLightBox("UpdateNameLightBoxScreen");
                  // this.context.navigator.push(
                  //   navScreen(
                  //     "EditUserAddressScreen",
                  //     "地区",
                  //     navRightButton("save_userAddress", "保存")
                  //   )
                  // );
                }
              },
              {
                name: "所在地区",
                direction: ">",
                subInfo: this.props.user.city && this.props.user.city.province ? this.props.user.city.province.name + this.props.user.city.name : "",
                listItemNameStyle: {
                  color: "#999"
                },
                onPress: () => {
                  // navLightBox("UpdateAddressLightBoxScreen");
                  this.context.navigator.push(
                    navScreen(
                      "EditUserAddressScreen",
                      "地区",
                      navRightButton("save_userAddress", "保存")
                    )
                  );
                }
              },
              {
                name: "性别",
                direction: ">",
                subInfo: this.props.user.gender == "female" ? "女" : "男",
                listItemNameStyle: {
                  color: "#999"
                },
                onPress: () => {
                  // navLightBox("UpdateAddressLightBoxScreen");
                  this.context.navigator.push(
                    navScreen(
                      "EditUserSexScreen",
                      "性别",
                      navRightButton("save_userSex", "保存")
                    )
                  );
                }
              },
              {
                name: "联系方式",
                direction: ">",
                subInfo: this.props.user.contact || this.props.user.phone || "",
                listItemNameStyle: {
                  color: "#999"
                },
                onPress: () => {
                  // navLightBox("UpdateAddressLightBoxScreen");
                  this.context.navigator.push(
                    navScreen(
                      "EditUserPhoneScreen",
                      "联系方式",
                      navRightButton("save_userPhone", "保存")
                    )
                  );
                }
              },
              {
                name: "电子邮箱",
                direction: ">",
                listItemNameStyle: {
                  color: "#999"
                },
                subInfo: this.props.user.email,
                onPress: () => {
                  // navLightBox("UpdateAddressLightBoxScreen");
                  this.context.navigator.push(
                    navScreen(
                      "EditUserEmailScreen",
                      "电子邮箱",
                      navRightButton("save_userEmail", "保存")
                    )
                  );
                }
              }

            ]}
          />
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
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: state.user,
  prepareToUpdate: state.prepareToUpdate,
  uploadToken: state.uploadToken
}))(UpdateProfile);

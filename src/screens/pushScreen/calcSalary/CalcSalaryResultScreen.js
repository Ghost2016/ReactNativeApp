import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Image,
  Alert
} from "react-native";
import PropTypes from "prop-types";
import { SDMainColor, navScreen, navLightBox, dismissLightBox } from "../../../styles/index";
import { CSS } from "../../../common/SDCSS";
import ConnectWithActions from "../../../connectWithActions";
import config from "../../../config";
import { Toast } from "antd-mobile";
import { isIphoneX } from "../../../utils/iphonex";
import ShareButton from "../../../sd_shareButton/ShareButton";
import CalcSalaryHomeScreen from "./CalcSalaryHomeScreen";
import { getUserBaseInfo } from "../../../users/usersSelector";
import { colorHashFromName } from "../../../utils/color";
import { initialsFromName } from "../../../sd_components/TextAvatar";
import ViewShot from "react-native-view-shot";
import * as WeChat from 'react-native-wechat';
import * as HOSTS from '@src/host';

const sWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    backgroundColor: "#fb7f49",
    position: "relative"
  },
  resultContainer: {}
});

// 计算薪资结果
class CalcSalaryResultScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otherText: "",
      workText: "",
      constellationText: "",
      jobText: "",
      areaText: "",
      domainText: ""
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.context.refs["calcSalaryScreen"] = this;

    this.props.actions.getUploadTokenAction({
      isPrivate: false
    });
  }

  // 上传图片
  async uploadPic(images) {
    let resultUpload = [];
    for (let i = 0; i < images.length; i++) {
      const element = images[i];
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, backgroundColor: "#fc7f4a" }}>
          <ViewShot ref="viewShot">
            <View
              style={{
                width: sWidth,
                height: CSS.pixel(2651, true),
                position: "absolute",
                left: 0,
                top: 0
              }}
            >
              <Image
                style={{ width: sWidth, height: CSS.pixel(2651, true) }}
                source={
                  isIphoneX()
                    ? require("@img/salary/home_Salary_Result_bg_iPhone_x.png")
                    : require("@img/salary/home_Salary_Result_bg.png")
                }
                resizeMode="stretch"
              />
            </View>
            <View
              style={{
                marginHorizontal: CSS.pixel(40),
                marginTop: isIphoneX()
                  ? CSS.pixel(680, true)
                  : CSS.pixel(710, true),
                alignItems: "center"
              }}
            >
              <Image
                source={require("@img/salary/home_Salary_Title_box.png")}
                style={{ width: CSS.pixel(670), height: CSS.pixel(260, true) }}
                resizeMode="stretch"
              />

              <View
                style={{
                  position: "absolute",
                  width: CSS.pixel(120),
                  height: CSS.pixel(120),
                  top: -CSS.pixel(40, true),
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: SDMainColor,
                  borderRadius: CSS.pixel(60)
                }}
              >
                <View
                  style={{
                    overflow: "hidden",
                    width: CSS.pixel(110),
                    height: CSS.pixel(110),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: SDMainColor,
                    borderRadius: CSS.pixel(55)
                  }}
                >
                  {/* {this.props.user.avatar ? (
                  <Image
                    style={{
                      width: CSS.pixel(110),
                      height: CSS.pixel(110)
                    }}
                    source={
                      this.props.user.avatar
                        ? {
                            uri:
                              this.props.user.avatar.url + "?imageView2/2/h/110"
                          }
                        : this.props.user.gender == "female"
                          ? require("@img/avator/female.png")
                          : require("@img/avator/male.png")
                    }
                    resizeMode="stretch"
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      width: '100%',
                      backgroundColor: colorHashFromName(this.props.user.name),
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: CSS.textSize(44) }}>
                      {initialsFromName(this.props.user.name)}
                    </Text>
                  </View>
                )} */}
                  <Image
                    style={{
                      width: CSS.pixel(110),
                      height: CSS.pixel(110)
                    }}
                    source={
                      this.props.user.avatar
                        ? {
                            uri:
                              this.props.user.avatar.url + "?imageView2/2/h/110"
                          }
                        : this.props.user.gender == "female"
                          ? require("@img/avator/female.png")
                          : require("@img/avator/male.png")
                    }
                    resizeMode="cover"
                  />
                </View>
              </View>

              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: CSS.pixel(60, true)
                  }}
                >
                  {("¥" + this.props.calcSalaryResult.current)
                    .split("")
                    .map((item, index, self) => {
                      return (
                        <View
                          style={{
                            marginLeft: index !== 0 ? CSS.pixel(20) : 0,
                            position: "relative",
                            justifyContent: "center",
                            alignItems: "center",
                            width: CSS.pixel(50),
                            height: CSS.pixel(70, true)
                          }}
                          key={index + ""}
                        >
                          <Image
                            style={{ position: "absolute", left: 0, top: 0 }}
                            source={require("@img/my/home_Salary_number_bg.png")}
                          />
                          <Text
                            style={{
                              fontSize: CSS.textSize(60),
                              color: "#fed200"
                            }}
                          >
                            {item}
                          </Text>
                        </View>
                      );
                    })}
                </View>

                <View
                  style={{
                    marginTop: CSS.pixel(20, true),
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontSize: CSS.pixel(28),
                      color: SDMainColor
                    }}
                  >
                    -能拿到的月薪-
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                top: CSS.pixel(-30, true),
                marginBottom: CSS.pixel(-30, true)
              }}
            >
              <View style={{ alignItems: "flex-end" }}>
                <Image
                  source={require("@img/salary/home_Salary_loft_right.png")}
                  resizeMode="stretch"
                  style={{
                    width: CSS.pixel(74),
                    height: CSS.pixel(103, true),
                    right: CSS.pixel(70)
                  }}
                />
              </View>
            </View>

            <View
              style={{
                width: CSS.pixel(670),
                height: CSS.pixel(260, true),
                marginHorizontal: CSS.pixel(40),
                alignItems: "center",
                marginTop: CSS.pixel(-20, true)
              }}
            >
              <Image
                source={require("@img/salary/home_Salary_Title_box2.png")}
                style={{
                  position: "absolute",
                  width: CSS.pixel(670),
                  height: CSS.pixel(260, true)
                }}
                resizeMode="stretch"
              />
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: CSS.pixel(330),
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      fontSize: CSS.textSize(54),
                      fontWeight: "600",
                      color: "#fed200"
                    }}
                  >{`独立${
                    this.props.calcSalaryResult.para.data.gender
                  }`}</Text>
                </View>
                <View
                  style={{
                    position: "absolute",
                    right: CSS.pixel(60),
                    bottom: CSS.pixel(60, true)
                  }}
                >
                  <Image
                    source={require("@img/salary/home_Salary_Title_box3_Mapping.png")}
                    resizeMode="stretch"
                    style={{
                      width: CSS.pixel(273),
                      height: CSS.pixel(88, true)
                    }}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                top: CSS.pixel(-30, true),
                marginBottom: CSS.pixel(-30, true)
              }}
            >
              <View style={{ alignItems: "flex-start" }}>
                <Image
                  source={require("@img/salary/home_Salary_loft_left.png")}
                  resizeMode="stretch"
                  style={{
                    width: CSS.pixel(74),
                    height: CSS.pixel(103, true),
                    left: CSS.pixel(70)
                  }}
                />
              </View>
            </View>

            <View
              style={{
                width: CSS.pixel(670),
                height: CSS.pixel(260, true),
                marginHorizontal: CSS.pixel(40),
                alignItems: "center",
                marginTop: CSS.pixel(-20, true)
              }}
            >
              <Image
                source={require("@img/salary/home_Salary_Title_box2.png")}
                style={{
                  position: "absolute",
                  width: CSS.pixel(670),
                  height: CSS.pixel(260, true)
                }}
                resizeMode="stretch"
              />
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: CSS.pixel(60),
                    bottom: CSS.pixel(60, true)
                  }}
                >
                  <Image
                    source={require("@img/salary/home_Salary_Title_box2_Mapping.png")}
                    resizeMode="stretch"
                    style={{
                      width: CSS.pixel(260),
                      height: CSS.pixel(120, true)
                    }}
                  />
                </View>
                <View
                  style={{
                    position: "absolute",
                    left: CSS.pixel(320),
                    top: 0,
                    bottom: 0,
                    right: 0,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <View style={{ marginTop: CSS.pixel(30, true) }}>
                    <Text
                      style={{
                        fontSize: CSS.pixel(54),
                        color: SDMainColor,
                        fontWeight: "600",
                        textAlign: "center"
                      }}
                    >
                      {this.props.calcSalaryResult.para.data.jobType}
                    </Text>
                  </View>
                  <View style={{ marginTop: CSS.pixel(20, true) }}>
                    <Text
                      style={{
                        fontSize: CSS.pixel(28),
                        color: SDMainColor
                      }}
                    >
                      -毕业后从事的职业-
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                top: CSS.pixel(-30, true),
                marginBottom: CSS.pixel(-30, true)
              }}
            >
              <View style={{ alignItems: "flex-end" }}>
                <Image
                  source={require("@img/salary/home_Salary_loft_right.png")}
                  resizeMode="stretch"
                  style={{
                    width: CSS.pixel(74),
                    height: CSS.pixel(103, true),
                    right: CSS.pixel(70)
                  }}
                />
              </View>
            </View>

            <View
              style={{
                width: CSS.pixel(670),
                height: CSS.pixel(260, true),
                marginHorizontal: CSS.pixel(40),
                alignItems: "center",
                marginTop: CSS.pixel(-20, true)
              }}
            >
              <Image
                source={require("@img/salary/home_Salary_Title_box2.png")}
                style={{
                  position: "absolute",
                  width: CSS.pixel(670),
                  height: CSS.pixel(260, true)
                }}
                resizeMode="stretch"
              />

              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: CSS.pixel(300),
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <View style={{ marginTop: CSS.pixel(30, true) }}>
                    <Text
                      style={{
                        fontSize: CSS.pixel(54),
                        color: SDMainColor,
                        fontWeight: "600",
                        textAlign: "center"
                      }}
                    >
                      {this.props.calcSalaryResult.buy_house_year
                        ? this.props.calcSalaryResult.buy_house_year
                        : "许多"}年
                    </Text>
                  </View>
                  <View style={{ marginTop: CSS.pixel(20, true) }}>
                    <Text
                      style={{
                        fontSize: CSS.pixel(28),
                        color: SDMainColor
                      }}
                    >
                      -不吃不喝在{this.props.calcSalaryResult.city}买房-
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    position: "absolute",
                    right: CSS.pixel(30),
                    bottom: CSS.pixel(60, true)
                  }}
                >
                  <Image
                    source={require("@img/my/home_Salary_Title_box4_Mapping.png")}
                    resizeMode="stretch"
                    style={{
                      width: CSS.pixel(270),
                      height: CSS.pixel(108, true)
                    }}
                  />
                </View>
              </View>
            </View>

            <View
              style={{
                top: CSS.pixel(-30, true),
                marginBottom: CSS.pixel(-30, true)
              }}
            >
              <View style={{ alignItems: "flex-start" }}>
                <Image
                  source={require("@img/salary/home_Salary_loft_left.png")}
                  resizeMode="stretch"
                  style={{
                    width: CSS.pixel(74),
                    height: CSS.pixel(103, true),
                    left: CSS.pixel(70)
                  }}
                />
              </View>
            </View>

            <View
              style={{
                width: CSS.pixel(670),
                height: CSS.pixel(260, true),
                marginHorizontal: CSS.pixel(40),
                alignItems: "center",
                marginTop: CSS.pixel(-20, true)
              }}
            >
              <Image
                source={require("@img/salary/home_Salary_Title_box2.png")}
                style={{
                  position: "absolute",
                  width: CSS.pixel(670),
                  height: CSS.pixel(260, true)
                }}
                resizeMode="stretch"
              />
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: CSS.pixel(30),
                    bottom: CSS.pixel(60, true)
                  }}
                >
                  <Image
                    source={require("@img/my/home_Salary_Title_box5_Mapping.png")}
                    resizeMode="stretch"
                    style={{
                      width: CSS.pixel(310),
                      height: CSS.pixel(116)
                    }}
                  />
                </View>
                <View
                  style={{
                    position: "absolute",
                    left: CSS.pixel(340),
                    top: 0,
                    bottom: 0,
                    right: 0,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: CSS.pixel(34),
                        color: SDMainColor,
                        marginTop: CSS.pixel(30, true)
                      }}
                    >
                      赶上一年黄金周
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: CSS.pixel(34),
                        color: SDMainColor,
                        marginTop: CSS.pixel(20, true)
                      }}
                    >
                      祖国河山随便游
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ViewShot>

          <View
            style={{
              paddingHorizontal: CSS.pixel(50),
              marginTop: CSS.pixel(50),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around"
            }}
          >
            <View
              style={{
                width: CSS.pixel(290),
                height: CSS.pixel(80, true),
                marginRight: CSS.pixel(30),
                backgroundColor: SDMainColor,
                borderRadius: CSS.pixel(40),
                borderWidth: 1,
                borderColor: SDMainColor
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.context.navigator.push(
                    navScreen("PushScreen", "算薪资", {
                      passProps: {
                        header: false,
                        noScrollView: true,
                        fullScreen: true,
                        screen: () => <CalcSalaryHomeScreen /> // 自定义传递props
                      }
                    })
                  );
                }}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#fff" }}>再玩一次</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: CSS.pixel(290),
                height: CSS.pixel(80, true),
                borderRadius: CSS.pixel(40),
                borderWidth: 1,
                borderColor: "#fff"
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
                onPress={() => {
                  this.context.navigator.popToRoot({
                    animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
                    animationType: "fade"
                  });
                }}
              >
                <Text style={{ color: "#fff" }}>返回首页</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              marginTop: CSS.pixel(60, true),
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: CSS.pixel(50)
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                borderBottomColor: "#fff",
                borderBottomWidth: 1
              }}
            />
            <View>
              <Text style={{ color: "#fff" }}>分享至</Text>
            </View>
            <View
              style={{
                flex: 1,
                height: 1,
                borderBottomColor: "#fff",
                borderBottomWidth: 1
              }}
            />
          </View>

          <View
            style={{
              marginTop: CSS.pixel(30, true),
              marginBottom: CSS.pixel(30, true),
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              style={{
                marginRight: CSS.pixel(184),
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                // 进行微信分享
                WeChat.isWXAppInstalled()
                  .then(installed => {
                    Toast.hide();
                    if (installed) {
                      this.refs["viewShot"].capture().then(async uri => {
                        Toast.loading("正在请求微信", 0);
                        const uploadSaveImg = await this.uploadPic([
                          {
                            filename: null,
                            path: uri
                          }
                        ]);
                        Toast.hide();
                        WeChat.shareToSession({
                          type: "news",
                          // thumbImage:
                          //   "https://share.zhimekaimen.com/images/logo.png",
                          title: `我在职么开门里算出薪资为¥${
                            this.props.calcSalaryResult.current
                          },你也来试试👊`,
                          description: `我在职么开门里算出薪资为¥${
                            this.props.calcSalaryResult.current
                          },你也来试试👊`,
                          webpageUrl: `${HOSTS.SHARE}/#/salary?pic=${
                            uploadSaveImg[0].file_name
                          }`
                        });
                      });
                      if (this.props.onClose) {
                        this.props.onClose();
                      } else {
                        dismissLightBox();
                      }
                    } else {
                      Alert.alert("微信未安装");
                    }
                  })
                  .catch(err => {
                    Alert.alert("err:" + err);
                  });
              }}
            >
              <Image
                source={require("@img/salary/home_Salary_share_WeChat.png")}
              />
              <Text style={{ color: "#fff", marginTop: CSS.pixel(20) }}>
                微信好友
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => {
                WeChat.isWXAppInstalled()
                  .then(installed => {
                    if (installed) {
                      this.refs["viewShot"].capture().then(async uri => {
                        Toast.loading("正在请求微信", 0);
                        // debugger;
                        const uploadSaveImg = await this.uploadPic([
                          {
                            filename: null,
                            path: uri
                          }
                        ]);

                        Toast.hide();

                        WeChat.shareToTimeline({
                          type: "news",
                          // thumbImage:
                          //   "https://share.zhimekaimen.com/images/logo.png",
                          title: `${
                            this.props.user.name
                          }在职么开门里算出薪资为¥${
                            this.props.calcSalaryResult.current
                          },你也来试试👊`,
                          description: `${
                            this.props.user.name
                          }在职么开门里算出薪资为¥${
                            this.props.calcSalaryResult.current
                          },你也来试试👊`,
                          webpageUrl: `${HOSTS.SHARE}/#/salary?pic=${
                            uploadSaveImg[0].file_name
                          }`
                        });
                      });

                      if (this.props.onClose) {
                        this.props.onClose();
                      } else {
                        dismissLightBox();
                      }
                    } else {
                      Alert.alert("微信未安装");
                    }
                  })
                  .catch(err => {
                    Alert.alert("err:" + err);
                  });
              }}
            >
              <Image
                source={require("@img/salary/home_Salary_share_PengYouQuan.png")}
              />
              <Text style={{ color: "#fff", marginTop: CSS.pixel(20) }}>
                朋友圈
              </Text>
            </TouchableOpacity>
          </View>
          {isIphoneX() ? <View style={{ height: 34 }} /> : null}
        </ScrollView>

        <View
          style={{
            position: "absolute",
            left: CSS.pixel(30),
            top: isIphoneX() ? CSS.pixel(125, true) : CSS.pixel(65, true),
            width: 40,
            height: 30,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            zIndex: 9
          }}
        >
          <TouchableOpacity
            style={{
              width: 40,
              height: 30
            }}
            onPress={() => {
              this.context.navigator.popToRoot({
                animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
                animationType: "fade" // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
              });
            }}
          >
            <Image source={require("@img/salary/home_Salary_back.png")} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: "absolute",
            right: CSS.pixel(30),
            top: isIphoneX() ? CSS.pixel(125, true) : CSS.pixel(65, true),
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navLightBox("LightBoxScreen", {
                passProps: {
                  screen: () => (
                    // <ShareButton
                    //   timeLineOptions={{
                    //     type: "news",
                    //     thumbImage:
                    //       "https://share.zhimekaimen.com/images/logo.png",
                    //     title: `${this.props.user.name}在职么开门里算出薪资为¥${
                    //       this.props.calcSalaryResult.current
                    //     },大家也来试试👊`,
                    //     description: `${
                    //       this.props.user.name
                    //     }在职么开门里算出薪资为¥${
                    //       this.props.calcSalaryResult.current
                    //     },大家也来试试👊`,
                    //     webpageUrl: "http://suanxinzi.com/"
                    //   }}
                    //   sessionOptions={{
                    //     type: "news",
                    //     thumbImage:
                    //       "https://share.zhimekaimen.com/images/logo.png",
                    //     title: `我在职么开门里算出薪资为¥${
                    //       this.props.calcSalaryResult.current
                    //     },你也来试试👊`,
                    //     description: `我期望的职位是${
                    //       this.props.calcSalaryResult.para.data.jobType
                    //     }`,
                    //     webpageUrl: "http://suanxinzi.com/"
                    //   }}
                    // />
                    <ShareButton
                      sessionPress={() => {

                        dismissLightBox();
                        // 进行微信分享
                        WeChat.isWXAppInstalled()
                          .then(installed => {
                            if (installed) {
                              this.refs["viewShot"]
                                .capture()
                                .then(async uri => {
                                  // debugger;
                                  Toast.loading("正在请求微信", 0);
                                  const uploadSaveImg = await this.context.refs[
                                    "_shareButton"
                                  ].uploadPic([
                                    {
                                      filename: null,
                                      path: uri
                                    }
                                  ]);

                                  Toast.hide();

                                  WeChat.shareToSession({
                                    type: "news",
                                    // thumbImage:
                                    //   "https://share.zhimekaimen.com/images/logo.png",
                                    title: `我在职么开门里算出薪资为¥${
                                      this.props.calcSalaryResult.current
                                    },你也来试试👊`,
                                    description: `我在职么开门里算出薪资为¥${
                                      this.props.calcSalaryResult.current
                                    },你也来试试👊`,
                                    webpageUrl: `${HOSTS.SHARE}/#/salary?pic=${
                                      uploadSaveImg[0].file_name
                                    }`
                                  });
                                })
                                .catch(err => {
                                  Toast.hide();
                                });
                            } else {
                              Alert.alert("微信未安装");
                            }
                          })
                          .catch(err => {
                            Alert.alert("err:" + err);
                          });
                      }}
                      timeLinePress={() => {
                        // 进行微信分享
                        dismissLightBox();
                        WeChat.isWXAppInstalled()
                          .then(installed => {
                            if (installed) {
                              this.refs["viewShot"]
                                .capture()
                                .then(async uri => {
                                  Toast.loading("正在请求微信", 0);
                                  // debugger;
                                  const uploadSaveImg = await this.context.refs[
                                    "_shareButton"
                                  ].uploadPic([
                                    {
                                      filename: null,
                                      path: uri
                                    }
                                  ]);

                                  Toast.hide();
                                  WeChat.shareToTimeline({
                                    type: "news",
                                    // thumbImage:
                                    //   "https://share.zhimekaimen.com/images/logo.png",
                                    title: `${
                                      this.props.user.name
                                    }在职么开门里算出薪资为¥${
                                      this.props.calcSalaryResult.current
                                    },你也来试试👊`,
                                    description: `${
                                      this.props.user.name
                                    }在职么开门里算出薪资为¥${
                                      this.props.calcSalaryResult.current
                                    },你也来试试👊`,
                                    webpageUrl: `${HOSTS.SHARE}/#/salary?pic=${
                                      uploadSaveImg[0].file_name
                                    }`
                                  });
                                })
                                .catch(err => {
                                  Toast.hide();
                                });
                            } else {
                              Alert.alert("微信未安装");
                            }
                          })
                          .catch(err => {
                            Alert.alert("err:" + err);
                          });
                      }}
                    />
                  )
                }
              });
            }}
          >
            <Image source={require("@img/salary/home_ico_share02.png")} />
          </TouchableOpacity>
        </View>

        {/* <ShareButton
          ref="_shareButton"
          height={Dimensions.get("window").height}
        /> */}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  calcSalaryResult: state.calcSalaryResult,
  user: getUserBaseInfo(state),
  uploadToken: state.uploadToken
}))(CalcSalaryResultScreen);

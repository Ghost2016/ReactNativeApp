import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  AlertIOS,
  Image,
  Linking,
  TextInput
} from "react-native";
import { Toast } from 'antd-mobile';
import PropTypes from "prop-types";
import SDKeyboardSpacer from "../../../common/SDKeyboardSpacer";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";
import ConnectWithActions from "@src/connectWithActions";
import { getUserBaseInfo } from "@src/users/usersSelector";
//import defaultStyle from "@styles";
import { navScreen } from "@styles";
import SDList from "../../../common/SDList";
import TosScreen from "../../registerScreen/TosScreen";
import AboutVersionScreen from "../../registerScreen/AboutVersionScreen";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import ApiConfig from "../../../api/apiConfig";
import { isIphoneX } from "../../../utils/iphonex";
import * as HOSTS from "@src/host";
import { AndroidWebsite, IosWebsite } from "../../../host";
const packageConfig = require("../../../../package.json");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3"
  }
});

// 我的-App关于
class AppAboutScreen extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      clickConut: 0,
      isDeveloper: false,
      host: ApiConfig.newAapiHost,
      port: ApiConfig.port
    }
  }

  _onScrollView(e) {

  }

  render() {
    const ViewWrap = this.state.isDeveloper ? ScrollView : View;
    return (
      <ViewWrap ref="containerScroll" style={styles.container}>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#efefef",
            justifyContent: "center",
            alignItems: "center",
            padding: 50,
            backgroundColor: '#fff'
          }}
        >
          <Image
            source={require("@img/my/mine_ico_about.png")}
          />
          <Text
            style={{
              color: sdStyles.SDFontColorMain,
              fontSize: 14,
              marginTop: 10,
              textAlign: "center"
            }}
          >
            版本号：{packageConfig.version}
          </Text>
        </View>
        <SDList
          listOptions={[
            // {
            //   name: "版本说明",
            //   direction: ">",
            //   onPress: e => {
            //     this.context.navigator.push(
            //       navScreen("PushScreen", "版本说明", {
            //         passProps: {
            //           screen: () => <AboutVersionScreen />,
            //           header: {
            //             title: '版本说明'
            //           }
            //         }
            //       })
            //     );
            //   }
            // },
            {
              name: "去评分",
              direction: ">",
              onPress: e => {
                if(Platform.OS == "android"){
                  Linking.openURL(AndroidWebsite).catch(err =>
                      console.error("An error occurred", err)
                    );
                } else {
                  Linking.openURL(IosWebsite).catch(err =>
                      console.error("An error occurred", err)
                    );
                }
              }
            },
            {
              bottomBorder: 0,
              name: "用户协议",
              direction: ">",
              onPress: e => {
                this.context.navigator.push(navScreen("PushScreen", "用户协议", {
                  passProps: {
                    screen: () => <TosScreen />,
                    header: {
                      title: "用户协议"
                    }
                  }
                }));
              }
            }
          ]}
        />

        {
          this.state.isDeveloper && (<View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', width: '100%'}}>
          <View style={{marginTop: CSS.pixel(20), width: '100%', height: CSS.pixel(100), justifyContent: 'center', paddingHorizontal: CSS.pixel(30)}}><TextInput onChangeText={t => {
            this.state.host = t;
          }} style={{padding: 0, width: '100%'}} defaultValue={ApiConfig.newAapiHost} placeholder={"输入Host如http://"} underlineColorAndroid="transparent"/></View>
          <View style={{marginTop: CSS.pixel(20), width: '100%', height: CSS.pixel(100), justifyContent: 'center', paddingHorizontal: CSS.pixel(30)}}><TextInput onChangeText={t => {
            this.state.port = t;
          }} style={{padding: 0, width: '100%'}} defaultValue={ApiConfig.port + ""} placeholder={"输入Port"} underlineColorAndroid="transparent"/></View>
          <SDTouchOpacity style={{marginVertical: CSS.pixel(20)}} onPress={() => {
            ApiConfig.newAapiHost = this.state.host;
            ApiConfig.port = this.state.port;
            Toast.info("设置成功");
          }}>
            <Text>确定</Text>
          </SDTouchOpacity>
        </View>)
        }

        {
          !this.state.isDeveloper && 
        
        <SDTouchOpacity noDelay activeOpacity={1} onPress={() => {
          this.state.clickConut = this.state.clickConut + 1;
          if (this.state.clickConut >= 10) {
            Toast.info("你已经进入开发者模式", 1);
            this.setState({
              isDeveloper: true
            })
          }
        }} style={{
            // marginVertical: CSS.pixel(40, true),
            position: "absolute",
            bottom: CSS.pixel(40),
            width: '100%'
          }}>
          <View style={{width: '100%',
            justifyContent: 'center',
            alignItems: 'center'}}>
            <Text style={{
              textAlign: 'center',
              fontSize: CSS.textSize(24),
              color: sdStyles.SDFontColorSubtitle,
              lineHeight: 25
            }}>Copyright &copy; 2018-2028 </Text>
            <Text style={{
              textAlign: 'center',
              fontSize: CSS.textSize(24),
              lineHeight: 25,
              color: sdStyles.SDFontColorSubtitle,
            }}>成都善读数据有限公司  版权所有</Text>
            <Text style={{
              textAlign: 'center',
              fontSize: CSS.textSize(24),
              color: sdStyles.SDFontColorSubtitle,
            }}>{HOSTS.WWW.replace("https://", "")}</Text>
          </View>
        </SDTouchOpacity>
        }

        <SDKeyboardSpacer
          topSpacing={isIphoneX() ? -34 : 0}
          onToggle={open => {
            if (open) {
              setTimeout(() => {
                this.refs["containerScroll"].scrollToEnd();
              });
            }
          }}
        />
      </ViewWrap>
    );
  }
}
export default ConnectWithActions((state, props) => ({
  user: getUserBaseInfo(state)
}))(AppAboutScreen);

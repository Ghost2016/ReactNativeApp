/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import ConnectWithActions from "@src/connectWithActions";
import { navScreen } from "@styles";
//import { List } from "../common/index";
import * as navHelper from "@utils/navigationHelper";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { Toast } from "antd-mobile";
import IntlText from "@sd_components/IntlText";
import ButtonSection from "@sd_components/ButtonSection";
import FootSpace from "@sd_components/FootSpace";
import SDTag from "@sd_components/SDTag";
import SDLoading from "@sd_components/SDLoading";
import FlowTitle from "@sd_components/FlowTitle";
import GrowMakeGoal2 from '@sd_components/GrowMakeGoal2'
import GrowBoxMsg from "@sd_components/BoxMsg";
import { Navigation } from "react-native-navigation";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const bgHeader = require("@img/grow/growing_pic_plan_bg.png")

// 成长 - 制定目标行业
class GrowMakeGoal extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const {road, positionArea} = props;
    console.log("road, positionArea===", road, positionArea)
    this.state = {
      loading: true,
      tags: [],
      road: road,
      positionArea: positionArea,
      industryId: '',
      data: {},
    }

  }
  componentDidMount() {
    this.context.navigator.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this)
    );
  }

  onNavigatorEvent(event) {
    //console.log("GrowMakeGoal event.id====", event.id, event)
    if (event.id == "didAppear") {
      this.props.actions.getIndustryListAction({
        size: 20,
        page: 1,
      }, res => {}).then(res => {
        //console.log("getIndustryListAction", res)
        this.setState({
          loading: false,
          tags: res.results.map((n,i)=>{
            return {
              tag: n.name, //+"["+n.id+"]",
              id: n.id,
              description: n.description,
            }
          })
        })
      })
    }
  }

  onPressConfirm = () => {
    /*this.context.navigator.showInAppNotification({
      screen: 'example.Types.Notification',
    });*/
    if(!this.state.industryId) {
      Toast.fail("请选择目标行业！")
      return
    }
    /* navHelper.navOpen(this.context.navigator, "push", {
      name: "GrowMakeGoal2Screen",
      title: "制定目标"
      //tabBarHidden: true
    }); */
    this.context.navigator.push(
      navScreen("PushScreen", "制定目标", {
        passProps: {
          screen: () => <GrowMakeGoal2 industryId={this.state.industryId} road={this.state.road} positionArea={this.state.positionArea} />,
          fullScreen: true,
          header: {
              title: "制定目标",
              //取消默认header，定制黄色header
              fixed: true,
          }
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存")
      })
    );
  };

  onPressChooseIndustry(titles, data, index, title) {
    console.log("onPressChooseIndustry", titles, data, index, title)
    /*navHelper.navOpen(this.context.navigator, "push", {
      name: "GrowMakeGoal2Screen",
      title: "制定目标"
      //tabBarHidden: true
    });*/
    this.setState({
      industryId: title ? data.id : '',
      data: data,
    })

    if(title) Navigation.showLightBox({
      screen: "example.GrowBoxMsg",
      style: {
        backgroundBlur: "dark", //'dark' / 'light' / 'xlight' / 'none'
        backgroundColor: "rgba(218, 218, 218, 0.1)",
        tapBackgroundToDismiss: true
      },
      passProps: {
        passSpecialProps: {
          data: data
        }
      },
    });
    /* this.context.navigator.push(
      navScreen("PushScreen", "制定目标", {
        passProps: {
          screen: () => <GrowMakeGoal2 industryId={data.id} road={this.state.road} positionArea={this.state.positionArea} />
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存")
      })
    ); */
  }

  render() {
    return (
      <View style={{
        backgroundColor: sdStyles.SDBGColorClick,
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: 0,
        borderColor: '#f00',
        width: "100%",
        height: height,
      }}>

        <ImageBackground
            style={{
                width: "100%",
                height: CSS.pixel(658, true),
                borderWidth: 0,
                borderColor: '#f00',
                flexDirection: "column",
                justifyContent: "flex-start",
                backgroundColor: "transparent",
                position: "absolute",
                top: 0,
                left: 0,
            }}
            resizeMode="cover"
            borderRadius={0}
            source={bgHeader}

        />
          <View
            style={{
              flex: 1,
              //backgroundColor: sdStyles.SDBGColorMain,
              marginTop: CSS.pixel(150, true),
              //height: CSS.pixel(60, true),
              borderWidth: 0,
              borderColor: '#00f',
            }}
          >
            <FlowTitle step={1} />

            <View
              //styleName="tabContent inputWrap flexibless"
              style={{
                //flex: 1,
                borderTopWidth: 0,
                borderTopColor: sdStyles.SDHelperColorline,
                marginTop: CSS.pixel(0, true),
                //backgroundColor: sdStyles.SDBGColorMain,
                borderWidth: 0,
                borderColor: '#f0f',
                height: CSS.pixel(1206, true),
              }}
            >
              <ButtonSection
                title="下一步"
                onPress={this.onPressConfirm.bind(this)}
                btnStyle={{
                  backgroundColor: this.state.industryId ? sdStyles.SDMainColor : sdStyles.SDBGColorGreyBtn,
                }}
                style={{
                  height: CSS.pixel(1006, true),
                 }}
                 containerStyle={{
                   flex: 1,
                   height: height, //CSS.pixel(600, true),
                   borderWidth: 0,
                   borderColor: '#f00',
                 }}
              >
                <View style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: CSS.pixel(50, true),
                }}>
                  {/* <Text
                    style={{
                      textAlign: "center",
                      fontSize: CSS.textSize(28),
                      color: sdStyles.SDFontColorMain,
                      marginTop: CSS.pixel(50, true),
                      marginBottom: CSS.pixel(20, true),
                    }}
                  >
                    选择目标行业
                  </Text> */}
                  {this.state.loading ? <SDLoading /> : null}
                </View>
                <View style={{
                  paddingBottom: CSS.pixel(88, true),
                  paddingHorizontal: CSS.pixel(30),
                  borderWidth: 0,
                  borderColor: '#f00',
                }}>
                  <SDTag
                    tags={this.state.tags}
                    isMultiple={false}
                    name="industry"
                    onPress={this.onPressChooseIndustry.bind(this)}
                    style={{
                      marginTop: 0,
                      marginBottom: CSS.pixel(30, true),
                      padding: 0,
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "flex-start", //"space-between",
                      alignContent: "flex-start", //"space-between"
                      borderWidth: 0,
                      borderColor: '#f00',
                    }}
                    tagStyle={{
                      borderColor: sdStyles.SDHelperColorline3,
                      borderRadius: 0,
                      borderWidth: 1,
                      //flex: 1,
                      paddingLeft: 10,
                      paddingRight: 10,
                      //paddingTop: 4,
                      //paddingBottom: 4,
                      marginHorizontal: CSS.pixel(10),
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      marginVertical: CSS.pixel(15, true),
                      backgroundColor: "#fff",
                      borderWidth: 1,
                      //borderColor: '#f00',
                      height: CSS.pixel(50, true),
                    }}
                    tagSelectStyle={{
                      borderColor: sdStyles.SDMainColor,
                      borderRadius: 0,
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginHorizontal: CSS.pixel(10),
                      marginVertical: CSS.pixel(15, true),
                    }}
                    btnStyle={{
                      fontSize: CSS.textSize(24),
                      color: sdStyles.SDFontColorMain,
                    }}
                  />
                </View>
              </ButtonSection>
            </View>
          </View>

      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //user: getUserAllInfo(state, props),
}))(GrowMakeGoal);
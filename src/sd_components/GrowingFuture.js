/* @flow */
import React, { PureComponent } from "react";
import { Dimensions, ScrollView, View, Platform, Image, Text, ImageBackground, TouchableOpacity } from "react-native";
import ConnectWithActions from "@src/connectWithActions";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
//import IntlText from "@sd_components/IntlText";
import ButtonSection from "@sd_components/ButtonSection";
import ImageChoose from "@sd_components/ImageChoose";
import SDSection from "@sd_components/SDSection";
import { Toast } from "antd-mobile";
//import FootSpace from "@sd_components/FootSpace";
import SDButton from "./SDButton";
import SDImage from "./SDImage";
import GrowingFutureChoose from "./GrowingFutureChoose";
import GrowMakeGoal from "./GrowMakeGoal";
import { navRightButton, navLightBox, navScreen } from "@styles";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

type Props = {
  onPress: () => void
};

const bgHeader = require("@img/grow/growing_pic_plan_bg.png")
const iconSuggest = require("@img/grow/growing_ico_WeiNiTuiJian.png")
const iconCustomized = require("@img/grow/growing_ico_ZiZhuZhiDing.png")
const iconZYDK = require("@img/grow/growing_ico_ZhuanYeDuiKou.png")
const iconTMJY = require("@img/grow/growing_ico_TongMenJinYan.png")
const iconTLQX = require("@img/grow/growing_ico_TongLeiQuXiang.png")
const iconGXZW = require("@img/grow/growing_ico_GaoXinZhiWei.png")

const ImgGrid = (source, title, subTitle, index, onPress) => {
    return (<SDImage
        key={index+""}
        source={source}
        onPress={onPress}
        style={{
            //flex: 1,
            width: '100%',//CSS.pixel(385),
            height: '100%',//CSS.pixel(385),
            borderWidth: 0,
            borderColor: '#f00',
        }}
        imgStyle={{
            width: CSS.pixel(189),
            height: CSS.pixel(189),
            borderWidth: 0,
            borderColor: '#f00',
            alignSelf: 'center',
        }}
        alt={()=>{
            return (<TouchableOpacity
                activeOpacity={1.0}
                onPress={onPress}
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                    textAlign: 'center',
                    fontSize: CSS.textSize(34),
                    color: sdStyles.SDFontColorMain,
                    marginBottom: CSS.pixel(10, true),
                    fontWeight: 'bold',
                }}>{title}</Text>
                <Text style={{
                    textAlign: 'center',
                    fontSize: CSS.textSize(24),
                    color: sdStyles.SDFontColorMain,
                }}>{subTitle}</Text>
            </TouchableOpacity>)
        }}
    />)
}

class GrowingFuture extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    //intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    state = {
        currentPath: 0,
        currentTitle: '',
        gridList: []
      };
  }

  componentWillMount = () => {
    this.setState({
        gridList: [
            {
                source: iconZYDK,
                title: "专业对口",
                subTitle: "对口职位，不走弯路",
                onPress: () => {
                    this.onPressChooseGoal("专业对口")
                }
            },
            {
                source: iconTMJY,
                title: "同门经验",
                subTitle: "前辈经验，有效借鉴",
                onPress: () => {
                    this.onPressChooseGoal("同门经验")
                }
            },
            {
                source: iconTLQX,
                title: "同类去向",
                subTitle: "兼听则明，综合评估",
                onPress: () => {
                    this.onPressChooseGoal("同类去向")
                }
            },
            {
                source: iconGXZW,
                title: "高薪职位",
                subTitle: "高薪职位，热门直击",
                onPress: () => {
                    this.onPressChooseGoal("高薪职位")
                }
            },
        ]
    })
  };

  onPressAction = () => this.props.onPress(this.state.currentPath, this.state.currentTitle);

  onPressChooseGoal(title){
      //console.log("onPressChooseGoal")
      let index = 0;
      switch (title) {
          case "专业对口":
              index = 0;
              break;
          case "同门经验":
              index = 1;
              break;
          case "同类去向":
              index = 2;
              break;
          case "高薪职位":
              index = 3;
              break;
          default:
              break;
      }
      navLightBox("LightBoxScreen", {
        passProps: {
          screen: () => <GrowingFutureChoose
            style={{
                position: 'absolute',
                top: '9%',
                left: 0,
                width: '100%',
                height: '87%',
            }}
            title={title}
            index={index}
             />
        }
      });
  }

  onPressMakeGoal(){

    this.context.navigator.push(
        navScreen("PushScreen", "制定目标", {
            passProps: {
                screen: () => <GrowMakeGoal />,
                fullScreen: true,
                header: {
                    title: "制定目标",
                    //取消默认header，定制黄色header
                    fixed: true,
                }
            },
            //...navRightButton("save_addLearnedCourseBtn", "保存"),
        })
    );
  }

  componentDidMount(){
    this.context.refs["__growFutureScreen"] = this;
  }

  onPressImage(index, title) {
    //Toast.info(index)
    this.setState({
      currentPath: index,
      currentTitle: title,
    });
  }

  render() {
    const { style } = this.props;
    return (

        <View
        style={{
            backgroundColor: sdStyles.SDBGColorClick,
            flexDirection: 'column',
            alignItems: 'center',
            borderWidth: 0,
            borderColor: '#f00',
            width: width,
            height: height,
        }}><ScrollView style={{
            borderWidth: 0,
            borderColor: '#f00',
            width: width,
        }}>

        <ImageBackground
            style={{
                width: width,
                height: CSS.pixel(658, true),
                borderWidth: 0,
                borderColor: '#f00',
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: "transparent",
                position: "absolute",
                top: 0,
                left: 0,
            }}
            resizeMode="cover"
            borderRadius={0}
            source={bgHeader}

        />

        <View style={{
            //backgroundColor: 'rgba(255,255,255,0.9)',
            //opacity: 0.9,
            width: CSS.pixel(550),
            height: CSS.pixel(0, true),
            //borderRadius: CSS.pixel(33),
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            zIndex: 5,
            //position: "absolute",
            //top: CSS.pixel(141, true),
            marginTop: Platform.OS == "android" ? CSS.pixel(140, true) : CSS.pixel(140, true),
            marginBottom: CSS.pixel(24, true),
        }}>
            {/* <Text style={{
                fontSize: CSS.textSize(24),
                color: sdStyles.SDFontColorMain,
                textAlign: 'center',
            }}>职么开门基于大数据，为你提供以下参考</Text> */}

            {/* <View
                style={{
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.4,
                shadowRadius: 5,
                shadowColor: "#999",
                //注意：这一句是可以让安卓拥有灰色阴影
                elevation: 1,
                width: CSS.pixel(10),
                height: CSS.pixel(10, true),
                position: "absolute",
                top: CSS.pixel(61, true),
                backgroundColor: "#fff",
                transform: [
                    {
                    rotateZ: "45deg"
                    }
                ]
                }}
            /> */}
        </View>

        <View>
            <View style={{
                position: 'absolute',
                top: CSS.pixel(0, true),
                left: Platform.OS == "android" ? CSS.pixel(18) : CSS.pixel(38),
                zIndex: 10,
                width: '100%',
                height: CSS.pixel(100, true),
                borderWidth: 0,
                borderColor: '#f00',
                flexDirection: 'row',
                alignItems: 'flex-start',
                }}>
                    <Image source={iconSuggest}
                    style={{
                        width: CSS.pixel(159, true),
                        height: CSS.pixel(50, true),
                        position: "relative",
                        top: CSS.pixel(30, true),
                        left: Platform.OS == "android" ? CSS.pixel(0) : CSS.pixel(-20),
                    }}
                    />
                    <Text style={{
                    fontSize: CSS.textSize(24),
                    color: sdStyles.SDFontColorSubtitle,
                    position: "relative",
                    top: CSS.pixel(38, true),
                    left: Platform.OS == "android" ? CSS.pixel(10) : CSS.pixel(0),
                }}>基于大数据，为你提供以下参考</Text>
                </View>
            <SDSection
            style={{
                backgroundColor: "#fff",
                width: CSS.pixel(690),
                height: CSS.pixel(756, true),
                borderRadius: CSS.pixel(20),
                zIndex: 5,
                //position: "absolute",
                //top: CSS.pixel(231, true),
            }}
            lrPadding={true}
             >
            <View style={{
                flexDirection: 'row',
                alignItems: 'stretch',
                flexWrap:'wrap',
                marginTop: CSS.pixel(87, true),
            }}>

                    {this.state.gridList.map((n,i)=>{
                        return (<View key={i} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: CSS.pixel(330),
                            height: CSS.pixel(290),
                            borderWidth: 0,
                            borderColor: '#f00',
                            position: "relative",
                            left: CSS.pixel(6),
                        }}>{ImgGrid(n.source, n.title, n.subTitle, i, n.onPress)}
                        </View>);
                    })}

            </View>
            </SDSection>
        </View>

        <View>
            <View style={{
                    position: 'absolute',
                    top: CSS.pixel(0, true),
                    left: Platform.OS == "android" ? CSS.pixel(18) : CSS.pixel(38),
                    zIndex: 10,
                    width: '100%',
                    height: CSS.pixel(100, true),
                    borderWidth: 0,
                    borderColor: '#f00',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                }}>
                    <Image source={iconCustomized}
                    style={{
                        width: CSS.pixel(159, true),
                        height: CSS.pixel(50, true),
                        position: "relative",
                        top: CSS.pixel(30, true),
                        left: Platform.OS == "android" ? CSS.pixel(0) : CSS.pixel(-20),
                    }}
                    />
                    <Text style={{
                    fontSize: CSS.textSize(24),
                    color: sdStyles.SDFontColorSubtitle,
                    position: "relative",
                    top: CSS.pixel(38, true),
                    left: Platform.OS == "android" ? CSS.pixel(10) : CSS.pixel(0),
                }}>已有目标？开始制定</Text>
                </View>
            <SDSection
            style={{
                backgroundColor: "#fff",
                width: CSS.pixel(690),
                height: Platform.OS == "android" ? CSS.pixel(276, true) : CSS.pixel(276, true),
                borderRadius: CSS.pixel(10),
                zIndex: 5,
                //flexDirection: 'column',
                borderWidth: 0,
                borderColor: '#f00',
            }}
            lrPadding={true}
             >

            <View style={{
                flex:1,
            }}>
                <SDButton
                style={{
                  backgroundColor: sdStyles.SDMainColor,
                  borderRadius: 40,
                  width: CSS.pixel(260),
                  //justifyContent: 'center',
                  //position: 'relative',
                  marginTop: Platform.OS == "android" ? CSS.pixel(126, true) : CSS.pixel(126, true),
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderColor: sdStyles.SDMainColor,
                }}
                btnStyle={{
                    fontSize: CSS.textSize(32),
                    color: sdStyles.SDMainColor,
                    fontWeight: sdStyles.SDFontMedium,
                 }}
                onPress={this.onPressMakeGoal.bind(this)}
                title="自主制定目标"
              /></View>
            </SDSection>
        </View>

            </ScrollView>
        </View>

    );
  }
}

export default ConnectWithActions((state, props) => ({
}))(GrowingFuture);

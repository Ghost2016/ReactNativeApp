/* @flow */
import React, { PureComponent } from "react";
import { View, ScrollView, Image, Text } from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
import TextLink from "@sd_components/TextLink";
import TextTwoLink2 from "@sd_components/TextTwoLink2";
import { navScreen, navRightButton } from "@styles";
//import GrowGoal from "@sd_components/GrowGoal";
import GrowGoalList from "@sd_components/GrowGoalList";
import { currentJobPlan } from "@src/selectors";
import SDRow from "@sd_components/SDRow";
import GrowingFuture from "@sd_components/GrowingFuture";
import SDSubtitle from "@sd_components/SDSubtitle";

type Props = {};

const iconMakeGoal = require("@img/home/home_pic_ZhiDingMuBiao.png")

class GrowTargetSwitch2 extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props)
    this.state = {
      hasGoal : false,
      loading: true,
      isClick: false,
    }
  }

  componentWillMount() {
    const { hasGoal } = this.props;
    this.setState({
      hasGoal: hasGoal,
    })
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({
        loading: false,
      })
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentJobPlan.position.title !== this.props.currentJobPlan.position.title) {
      this.setState({
        hasGoal: nextProps.currentJobPlan.position.title ? true : false,
      })
    }
  }

  onPressChangeGoal() {
    this.context.navigator.push(
      navScreen("PushScreen", "我的目标", {
        passProps: {
          screen: () => <GrowGoalList selectMode={true} />,
          fullScreen: true,
          header: {
            title: "我的目标",
            //fixed: true,
          },
          noScrollView: true,
        },
        ...navRightButton(
          "_icon_add_position_goal",
          () => {
            return <Image style={{
              width: CSS.pixel(36),
              height: CSS.pixel(36, true),
              borderWidth: 0,
              borderColor: '#f00',
            }} source={require("@img/grow/growing_ico_add.png")} />
          }
        )
      })
    );
  }

  onPressAddPath() {
    if(this.props.onSetTarget instanceof Function) {
      this.props.onSetTarget()
      return;
    }
    this.context.refs["_growScreen"].onPressAddPath();
  }

  onPressJobPlan(){
    if(this.state.isClick) {
      setTimeout(() => {
        this.setState({
          isClick: false,
        })
      }, 3000);
      return
    }
    this.setState({
      isClick: true,
    })
    this.context.navigator.push(
      navScreen("PushScreen", "生涯规划", {
        passProps: {
          screen: () => <GrowingFuture />,
          fullScreen: true,
          header: {
            title: "生涯规划",
            //取消默认header，定制黄色header
            fixed: true,
          }
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
      })
    );
  }

  render() {
    const { style, goalName, icon, twoLinkStyle, iconStyle, titleStyle, noBg } = this.props;
    if (this.state.hasGoal) {
      return (<TextTwoLink2
                  title="目标职位："
                  title2={goalName}
                  txtStyle={{
                    fontSize: CSS.pixel(28),
                    color: sdStyles.SDMainColor,
                  }}
                  buttonTitle="切换目标"
                  onPress={this.onPressChangeGoal.bind(this)}
                  icon={icon}
                  style={twoLinkStyle}
                  noBg={noBg}
                />)
    } else {
      if(this.state.loading){
        return (null)
      }
      return (<SDRow
              title={()=>{
                return (<View style={[{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: this.props.smallMode ? CSS.pixel(510) : CSS.pixel(540),
                  borderWidth: 0,
                  borderColor: '#f00',
                  position: 'relative',
                  top: CSS.pixel(14, true),
                  left: CSS.pixel(10),
                  alignSelf: 'center',
                  //justifyContent: 'center',
                }, titleStyle]}>
                      <View style={{
                          width: '100%',//CSS.pixel(176),
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          borderWidth: 0,
                          borderColor: '#00f',
                        }}>
                        <Image resizeMode="contain" source={iconMakeGoal} style={{
                            width: CSS.pixel(176),
                            height: CSS.pixel(40, true),
                            justifyContent: 'center',
                            borderWidth: 0,
                            borderColor: '#0ff',
                          }} />
                      </View>
                      <View style={{
                          flexGrow: 1,
                          alignSelf: 'flex-start',
                          justifyContent: 'flex-start',
                          marginTop: CSS.pixel(8, true),
                        }}>
                        <SDSubtitle style={{
                            fontSize: CSS.textSize(24),
                            color: sdStyles.SDFontColorSubtitle,
                            textAlign: "left",
                            width: '100%',
                            marginLeft: CSS.pixel(0),
                            borderWidth: 0,
                            borderColor: '#f00',
                          }}>
                          规划职业生涯，提前做好就业准备
                        </SDSubtitle>
                      </View>
                    </View>)
              }}
              titleWidth={this.props.smallMode ? 550 : 550}
              caption=""
              iconStyle={[{
                width: CSS.pixel(80),
                height: CSS.pixel(90, true),
                alignSelf: "center",
                paddingRight: CSS.pixel(0),
                marginLeft: CSS.pixel(60),
                borderWidth: 0,
                borderColor: '#f00',
                position: 'relative',
                top: CSS.pixel(6, true),
              }, iconStyle]}
              //iconSource={iconMakeGoal}
              onPress={this.onPressJobPlan.bind(this)}
              emptyIconStyle={{
                width: CSS.pixel(20),
                height: CSS.pixel(20, true)
              }}
              style={[{
                //borderBottomWidth: 1,
                //borderBottomColor: sdStyles.SDHelperColorline,
                borderWidth: 0,
                borderColor: '#f00',
                borderRadius: 0,
                alignSelf: 'center',
                width: '100%',
                height: CSS.pixel(144, true),
                paddingTop: CSS.pixel(0, true),
              }, style]}
            />)
      return (<TextLink
                  title="没有目标？制定目标，定向进阶 >>"
                  txtStyle={{
                    fontSize: CSS.pixel(28),
                    color: sdStyles.SDMainColor,
                    borderWidth: 0,
                    borderColor: '#f00',
                  }}
                  onPress={this.onPressAddPath.bind(this)}
                />)
    }
  }
}

export default ConnectWithActions((state, props) => ({
  //user: getUserBaseInfo(state),
  currentJobPlan: currentJobPlan(state, props),
}))(GrowTargetSwitch2);

import React from "react";
import ReactNative, { View, Image, Animated, Text } from "react-native";
import SDHeader, {
  headerHeight,
  headerPadding,
  headerOffsetHeight
} from "../../../common/SDHeader";
import { CSS } from "../../../common/SDCSS";
import connectWithActions from "../../../connectWithActions";
import { getSchoolName, getMajor, getSchoolLevel } from "../../../directSelectors";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import SwitchIdLightBoxFull from "./SwitchIdLightBoxFull";
import { navLightBox } from "../../../styles";

class AscriptionChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      schoolTextSize: new Animated.Value(20),
      majorTextSize: new Animated.Value(14),
      schoolTextLeft: new Animated.Value(CSS.pixel(30)),
      majorTextLeft: new Animated.Value(CSS.pixel(30)),
      schoolViewTop: new Animated.Value(CSS.width() == 320 ? 14 : 18),
      majorViewTop: new Animated.Value(CSS.width() == 320 ? 38 : 48),
      opacityText: new Animated.Value(1)
    };
  }
  static contextTypes = {
    refs: () => null
  }
  onParentScrooly(y) {
  }
  componentDidMount() {
    this.context.refs['ascriptionChart'] = this;
    Promise.all([
      this.props.actions.getSchoolAccountAction(),
      this.props.actions.getEducationAction({
        id: this.props.user.id
      })
    ])
      .then(() => {})
      .catch(err => {});
  }
  render() {
    const { mainBar } = this.props;
    return (
      <View style={{
        borderWidth: 0,
        borderColor: '#f00',
      }}>
        <SDHeader
          backgroundColor="transparent"
          custom={() => (
            <View style={{ width: "100%" }}>
              <SDTouchOpacity
                noDelay
                onPress={() => {
                  navLightBox("LightBoxScreen", {
                    passProps: {
                      screen: () => <SwitchIdLightBoxFull onDismiss={() => {

                      }}/>
                    }
                  }, {
                    backgroundColor: 'transparent'
                  })
                }}
                style={{paddingHorizontal: CSS.pixel(30), marginTop: CSS.pixel(10)}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{maxWidth: 300}}>
                    <Text numberOfLines={1} style={{fontSize: CSS.textSize(40), lineHeight: CSS.pixel(56), fontWeight: '600', color: '#333'}}>{this.props.schoolName}</Text>
                  </View>
                  {
                    (this.props.educationList.filter(c => c.is_default && c.is_verify).length > 0) && <View style={{marginLeft: CSS.pixel(8)}}>
                      <Image source={require("@img/mine_Resume_Authentication1.png")}/>
                    </View>
                  }
                  <View style={{marginLeft: CSS.pixel(20), justifyContent: 'center'}}>
                    <View style={{borderColor: 'transparent', borderWidth: CSS.pixel(10), top: CSS.pixel(5), borderTopColor: '#333'}}></View>
                  </View>
                </View>
                <View style={{marginTop: CSS.pixel(4), maxWidth: 300}}>
                  <Text numberOfLines={1} style={{fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40), color: '#333', fontWeight: '500'}}>{this.props.levelName}·{this.props.majorName}</Text>
                </View>
              </SDTouchOpacity>

              <View
                style={{
                  height: CSS.pixel(160, true),
                  marginTop: CSS.pixel(10),
                  width: "100%",
                  paddingHorizontal: CSS.pixel(30),
                  borderWidth: 0,
                  borderColor: '#f00'
                }}
              >
                <View
                  style={{ paddingTop: CSS.pixel(8, true), backgroundColor: "#fff", borderRadius: CSS.pixel(10), flex: 1 }}
                >
                  {/* 用来装载图表 */}
                  {typeof mainBar === "function" ? mainBar() : null }
                </View>
              </View>
            </View>
          )}
        />
        <View style={{ position: "absolute", zIndex: -1, left: 0, right: 0 }}>
          <Image
            style={{ height: 168, width: '100%' }}
            resizeMode="cover"
            source={require("@img/home/home_pic_bg.png")}
          />
        </View>
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  schoolName: getSchoolName(state, props),
  majorName: getMajor(state, props),
  levelName: getSchoolLevel(state, props),
  user: state.user,
  educationList: state.userEducationList,
  userAccount: state.schoolAccount
}))(AscriptionChart);
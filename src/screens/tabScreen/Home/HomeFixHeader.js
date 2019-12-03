import React from "react";
import ReactNative, {
  View,
  Image,
  Animated,
  Text,
  Platform,
  ScrollView
} from "react-native";
import SDHeader, {
  headerHeight,
  headerPadding,
  headerOffsetHeight,
  androidTopArea
} from "../../../common/SDHeader";
import { CSS } from "../../../common/SDCSS";
import { isIphoneX } from "../../../utils/iphonex";
import connectWithActions from "../../../connectWithActions";
import {
  getSchoolName,
  getMajor,
  getSchoolLevel
} from "../../../directSelectors";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { navLightBox } from "../../../styles";
import SwitchIdLightBox from "./SwitchIdLightBox";

class HomeFixHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      showHeader: false
    };
  }

  static contextTypes = {
    refs: () => null
  };

  onParentScrooly(y) {
    if (y <= 0) {
      this.state.opacity.setValue(0);
      this.setState({
        showHeader: false
      })
    } else if (y > 100) {
      this.setState({
        showHeader: true
      })
      this.state.opacity.setValue(255);
    } else {
      this.state.opacity.setValue(parseInt(255 * y / 100));
    }
  }

  componentDidMount() {
    this.context.refs["homeFixHeader"] = this;
  }

  // 切换身份
  onPressSwitchId() {
    navLightBox("LightBoxScreen", {
      passProps: {
        screen: () => <SwitchIdLightBox onDismiss={() => {

        }}/>
      }
    }, {
      backgroundColor: 'transparent'
    })
  }

  renderWhiteHeader() {
    let opacity = this.state.opacity.interpolate({
      inputRange: [0, 255],
      outputRange: [0, 1]
    });
    return this.state.showHeader ? (
      <Animated.View
        style={{
          minHeight: headerHeight,
          paddingTop:
            Platform.OS === "ios" ? (isIphoneX() ? 44 : 20) : androidTopArea,
          alignItems: "center",
          position: "absolute",
          zIndex: 0,
          flexDirection: "row",
          backgroundColor: '#fff',
          opacity: opacity
        }}
      >
        <SDTouchOpacity noDelay onPress={() => {
          if (this.state.opacity._value == 255) {
            this.onPressSwitchId();
          }
        }} style={{flexDirection: 'row', flex: 1, alignItems: 'center', paddingLeft: CSS.pixel(30)}}>
          <View style={{justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', height: '100%', maxWidth: 360}}><Text numberOfLines={1} style={{color: '#333', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40)}}>{this.props.schoolName}  {this.props.levelName}·{this.props.majorName}</Text></View>
          {
            this.props.educationList.filter(c => c.is_default && c.is_verify).length > 0 &&
            <View style={{marginLeft: CSS.pixel(8)}}>
              <Image source={require("@img/mine_Resume_Authentication1.png")}/>
            </View>
          }
          <View style={{marginLeft: CSS.pixel(20), justifyContent: 'center'}}>
            <View style={{borderColor: 'transparent', borderWidth: CSS.pixel(10), borderTopColor: '#333', top: CSS.pixel(5)}}></View>
          </View>
        </SDTouchOpacity>
      </Animated.View>
    ) : null
  }

  render() {
    return this.renderWhiteHeader()
  }
}

export default connectWithActions((state, props) => ({
  schoolName: getSchoolName(state, props),
  majorName: getMajor(state, props),
  levelName: getSchoolLevel(state, props),
  user: state.user,
  educationList: state.userEducationList,
  userAccount: state.schoolAccount
}))(HomeFixHeader);

/* @flow */
import React, { PureComponent } from "react";
import ReactNative, {
  Platform,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  UIManager,
} from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDTitle from "@sd_components/SDTitle";
import SDSubtitle from "@sd_components/SDSubtitle";
import SDCaption from "@sd_components/SDCaption";
import SDRowItem from "@sd_components/SDRowItem";
import SDImage from "@sd_components/SDImage";
//import Touchable from "@src/sd_components/Touchable";

type Props = {
  title: string | React.Element,
  subtitle: string,
  caption: string,
  icon: any,
  onPress: () => void
};

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");
console.log("width", width);

const iconArrowRightDark = require("@img/grow/growing_ico_click.png");

export default class SDRow extends PureComponent<Props> {
  props: Props;

  constructor(props) {
    super(props);
  }

  state = {
    isIntl: false,
    title: "",
    noIcon: false
  };

  onPressAction = () => {
    const { title } = this.props;
    //console.warn("onPressAction", title);
    const _title = typeof title == "string" ? title : "";
    return this.props.onPress(_title, this.props.data);
  };

  componentWillMount() {
    const { title, styleName } = this.props;
    const isIntl = (title && typeof title == "string" && title.match(/^SD\((.+)\)$/)) ? true : false;
    this.setState({
      isIntl: isIntl,
      title: isIntl ? this.context.intl.formatMessage({ id: title }) : title,
      noIcon: this.props.hasOwnProperty("noIcon") ? true : false
    });
  }

  findMe(scrollViewName){
    // ref="_scrollView"
    //console.log('offset = findMe', scrollViewName);
    setTimeout(() => {
      if (scrollViewName && this.refs["_selfComponent_SDRow"] && this.refs[scrollViewName]) {
        UIManager.measure(
          ReactNative.findNodeHandle(this.refs["_selfComponent_SDRow"]),
          (x, y, w, h, px, py) => {
            console.log('offset = x, y, w, h, px, py', x, y, w, h, px, py);
            /* this.refs[scrollViewName].scrollTo({
              y: py
            }); */
          }
        );
      }
    }, 0);
  }

  componentDidMount(){
    //console.warn("onPressAction done");
  };

  componentWillReceiveProps(nextProps){
    /* if(this.props.hasOwnProperty('scrollViewName')) console.log("this.props.scrollViewName", this.props.scrollViewName, nextProps.scrollToMe, this.props.scrollToMe)
    if(this.props.hasOwnProperty('scrollViewName') && this.props.hasOwnProperty('scrollToMe') && nextProps.scrollToMe === true && nextProps.scrollToMe !== this.props.scrollToMe){
      this.findMe(this.props.scrollViewName);
    } */
  }

  render() {
    const {
      title,
      caption,
      captionBefore,
      captionAfter,
      captionStyle,
      subtitle,
      icon,
      style,
      rightIcon,
      imgStyle,
      topLine,
      titleWidth,
      subtitleStyle,
      iconSource,
      iconStyle,
      emptyIconStyle,
      rowHeight,
    } = this.props;
    //console.log("title", title, this.state.noIcon, !_icon);
    const _icon = icon ? icon : null;
    const _rowHeight = rowHeight ? rowHeight : 110;
    const widthRatio =
      Platform.OS === "android" && !this.state.noIcon && rightIcon ? 0.4 : 0.65;
    return (
      <TouchableOpacity
          onPress={this.onPressAction.bind(this)}
          activeOpacity={0.8}
          ref="_selfComponent_SDRow"
        >
        {typeof topLine === "function" ? topLine() : null}
        <SDRowItem style={[{
          backgroundColor: "#fff",
          borderWidth: 0,
          borderColor: "#f00",
          paddingTop: CSS.pixel(20, true),
          }, style]}>
          {!_icon ? (
            <View
              style={[{
                borderWidth: 0,
                borderColor: "#f00",
                width: CSS.pixel(30),
                height: CSS.pixel(30, true)
              }, emptyIconStyle]}
            />
          ) : (
            <SDImage
              style={[
                {
                  borderWidth: 0,
                  borderColor: "#f00",
                  width: CSS.pixel(94),
                  height: CSS.pixel(_rowHeight, true),
                  marginVertical: 0,
                  marginHorizontal: 0,
                  flexDirection: "column",
                  alignItems: "center",
                },
                style
              ]}
              imgStyle={[{
                width: CSS.pixel(54),
                height: CSS.pixel(54, true),
              }, imgStyle]}
              source={_icon}
            />
          )}
          <View
            style={{
              width: titleWidth ? CSS.pixel(titleWidth) : CSS.pixel(360), //parseInt(width * widthRatio, 10),
              height: CSS.pixel(_rowHeight+10, true),
              zIndex: 2,
              borderWidth: 0,
              borderColor: "#f0f",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center"
            }}
          >
            {typeof title === "function" ? (
              title()
            ) : (
              <SDTitle
                style={{
                  fontSize: CSS.pixel(30),
                  color: sdStyles.SDFontColorMain,
                  textAlign: "left"
                }}
              >
                {title}
              </SDTitle>
            )}
            {caption ? (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                {typeof captionBefore == "function" ? captionBefore() : null}
                <SDCaption
                  style={[{
                    fontSize: CSS.textSize(24),
                    color: sdStyles.SDFontColorSubtitle,
                    marginTop: Platform.OS=="android"? CSS.pixel(0, true) :CSS.pixel(4, true),
                  }, captionStyle]}
                >
                  {caption}
                </SDCaption>
                {typeof captionAfter == "function" ? captionAfter() : null}
              </View>
            ) : null}
            {subtitle ? (
              <SDSubtitle
                style={[{
                  fontSize: CSS.pixel(24),
                  color: sdStyles.SDFontColorMinor,
                  marginTop: Platform.OS=="android"? CSS.pixel(0, true) :CSS.pixel(4, true),
                }, subtitleStyle]}
              >
                {subtitle}
              </SDSubtitle>
            ) : null}
            {this.props.children}
          </View>
          {this.state.noIcon ? null : rightIcon ? (
            rightIcon
          ) : (
            <View
              style={[{
                width: CSS.pixel(170),
                height: CSS.pixel(_rowHeight+10, true),
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "center",
                borderWidth: 0,
                borderColor: "#f0f",
              }, iconStyle]}
            >
              <Image source={iconSource ? iconSource : iconArrowRightDark} />
            </View>
          )}
        </SDRowItem>
      </TouchableOpacity>
    );
  }
}

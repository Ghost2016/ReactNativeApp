/* @flow */
import React, { PureComponent } from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import DotArrow from "@sd_components/DotArrow";

type Props = {
  title: string,
  index: number,
  onPress: () => void
};

const iconUnRead = require('@img/grow/growing_btn_FeiMoRen.png');
const iconRead = require('@img/grow/growing_btn_MoRen.png');

export default class DotSelect extends PureComponent<Props> {
  props: Props;

  constructor(props) {
    super(props);
  }
  state = {
    select: false,
    isShowReverseTitle: false
  };

  onPressAction = () => {
    const { title, isSelect, index, data, isNotLimitSelect } = this.props;
    //console.log("this.state.isShowReverseTitle", this.state.isShowReverseTitle)
    if(this.props.onPress(title, isSelect, index, data)){
      if (!isNotLimitSelect && !this.state.isShowReverseTitle) {
        this.setState({
          select: !this.state.select,
          isShowReverseTitle: true
        });
      } else if(isNotLimitSelect){
        this.setState({
          select: !this.state.select,
        });
      }
    }
  };

  checkSelect(props) {
    const { isSelect } = props;
    if (!this.state.isShowReverseTitle) this.setState({
      select: isSelect
    });
  }
  componentWillMount() {
    this.checkSelect(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkSelect(nextProps);
  }

  render() {
    const {
      style,
      title,
      reverseTitle,
      txtStyle,
      fontSize,
      isSmall,
      selectColor,
      unselectColor,
      circleBorder,
      data,
      disable,
      useIcon,
      iconStyle,
    } = this.props;
    const smallFont = isSmall ? 12 : 18;
    const _fontSize = typeof fontSize === "function" ? fontSize() : smallFont;
    const tick = "V";
    const _selectColor = selectColor ? selectColor : sdStyles.SDMainColor;
    const _unselectColor = unselectColor
      ? unselectColor
      : sdStyles.SDBtnColorDisable;
    const trgColor = this.state.select ? _selectColor : _unselectColor;
    const arrowStyle = {
      backgroundColor: trgColor,
      borderColor: trgColor,
      marginRight: CSS.pixel(11),
      borderWidth: 0,
      borderColor: '#0ff',
    };
    const arrowInnerStyle = { backgroundColor: trgColor };
    const arrowTextStyle = {
      color: "#fff",
      position: "relative",
      left: 0,
      top: isSmall
        ? Platform.OS === "android"
          ? -4
          : -3
        : Platform.OS === "android"
          ? -6
          : -3,
      fontSize: _fontSize
    };
    const Container = disable ? View : TouchableOpacity;
    return (
      <Container
        style={[
          {
            flexDirection: "row",
            alignItems: 'flex-start',
            borderWidth: 0,
            borderColor: '#0ff',
          },
          style
        ]}
        onPress={this.onPressAction.bind(this)}
      >
        {useIcon? <Image source={!this.state.select ? iconUnRead : iconRead} style={{
          alignSelf: 'center',
          marginRight: CSS.pixel(11),
        }} /> : <DotArrow
                  title={tick}
                  disable={true}
                  style={arrowStyle}
                  innerStyle={arrowInnerStyle}
                  textStyle={arrowTextStyle}
                  onPress={() => {}}
                  radius={16}
                  border={typeof circleBorder === "number" ? circleBorder : 0}
                />}
        <Text
          style={[
            {
              textAlign: "left",
              color: this.state.select ? _selectColor : _unselectColor,
              fontSize: _fontSize,
              width: '80%',
              borderWidth: 0,
              borderColor: '#f00',
              alignSelf: 'center',
            },
            txtStyle
          ]}
        >
          {this.state.isShowReverseTitle ? reverseTitle : title}
        </Text>
      </Container>
    );
  }
}

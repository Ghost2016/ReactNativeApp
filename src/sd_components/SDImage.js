/* @flow */
import React, { PureComponent } from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";

type Props = {
  onPress: () => void
};

export default class SDImage extends PureComponent<Props> {
  props: Props;

  state = {
    isClickable: false
  };
  //onPressAction = () => this.props.onPress(this.props.data || {});

  componentWillMount() {
    if (typeof this.props.onPress === "function" && !this.props.noPress) {
      this.setState({
        isClickable: true
      });
    }
  }

  onPressAction = () => {
    let data = {}
    if (this.state.isClickable) {
      data = this.props.data;
      this.props.onPress(data);
    }
  };

  render() {
    const { style, source, imgStyle, alt } = this.props;
    const dfImgStyle = {
      //backgroundColor: "#fff",
      width: 48,
      height: 48,
      borderRadius: 5,
      borderWidth: 0,
      borderColor: "#f00",
      //position: 'relative',
      //top: CSS.pixel(6, true),
    };
    return (
      <View
        style={[
          {
            backgroundColor: "transparent",
            borderRadius: 5,
            flexDirection: "column",
            alignContent: "center",
            width: 65,
            height: 65,
            overflow: "visible",
            borderWidth: 0,
            borderColor: '#00f',
          },
          style
        ]}
      >
        {this.state.isClickable ? (
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={this.onPressAction.bind(this)}
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Image style={[dfImgStyle, imgStyle]} resizeMode="contain" source={source} />
          </TouchableOpacity>
        ) : (
          <Image style={[dfImgStyle, imgStyle]} resizeMode="contain" source={source} />
        )}
        {typeof alt === "function" ? (
          alt()
        ) : (
          <Text
            style={{
              fontSize: CSS.textSize(20),
              color: sdStyles.SDFontColorMinor,
              position: "relative",
              top: 0,
              textAlign: "center"
            }}
          >
            {alt}
          </Text>
        )}
      </View>
    );
  }
}

/* @flow */
import React, { PureComponent } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
import SDButton from "@sd_components/SDButton";

type Props = {
  onPress: ?Function,
  btnTitle: string,
  icon: ?object,
};

export default class SDIconButton extends PureComponent<Props> {
  props: Props;

  onPressAction(){
    this.props.onPress()
  }

  render() {
    const { style, btnTitle, icon } = this.props;
    return (
      <View style={[{
                width: '100%',
                height: CSS.pixel(160, true),
                backgroundColor: '#fff',
                borderBottomWidth: 1,
                borderBottomColor: sdStyles.SDBGColorMain,
                borderTopWidth: 0,
                borderTopColor: sdStyles.SDBGColorMain,
              }, style]}>
          <TouchableOpacity style={{
            width: '100%',
            height: CSS.pixel(160, true),
            flexDirection: 'row',
            alignItems:'center',
            justifyContent: 'center',
            borderWidth: 0,
            borderColor: '#f00',
          }}

            onPress={this.onPressAction.bind(this)}
          >
            <Image source={icon} style={{
              margin: CSS.pixel(20),
            }} />
            <Text style={{
              color: sdStyles.SDMainColor,
              fontSize: CSS.textSize(28),
            }}>{btnTitle}</Text>
          </TouchableOpacity>
        </View>
    );
  }
}

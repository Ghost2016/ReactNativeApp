/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";
import { Touchable } from "@src/sd_components";
const componentStyles = StyleSheet.create({
  container: {
    flexDirection:'row',
    backgroundColor: "#fff",
    paddingBottom: CSS.pixel(30),
    paddingRight: CSS.pixel(30),
    paddingLeft: CSS.pixel(20),
    justifyContent:'center',
    alignItems:'center'
  }
});

type Props = {
  city: String,
  onPress: Function
};

class CitySelectToggle extends PureComponent<Props> {
  props: Props;

  static defaultProps = {
    city: '成都市',
    onPress: () => {}
  };

  render() {
    const yellowIcon = require('@img/rank/rank_ico_position_yellow.png');
    const rightIcon = require('@img/rank/rank_ico_screen1.png');
    return (
      <Touchable onPress={this.props.onPress}>
        <View
          style={[componentStyles.container, this.props.style]}>
          <Image source={yellowIcon}/>
          <Text style={{paddingLeft: CSS.pixel(10)}}>{this.props.city}</Text>
          <View style={{flex:1, alignItems:'flex-end'}}>
            <Image style={{transform: [{rotate: '-90deg'}]}} source={rightIcon}/>
          </View>
        </View>
      </Touchable>
    );
  }
}

export default CitySelectToggle;


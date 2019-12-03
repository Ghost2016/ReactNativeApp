/* @flow */
import React, { PureComponent } from "react";
import { View, Text, Image } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
import SDButton from "@sd_components/SDButton";

type Props = {
  onPress: ?Function,
  msgArr: ?string[],
  btnTitle: string,
  icon: ?object,
};

export default class SDEmptyPage extends PureComponent<Props> {
  props: Props;

  onPressAction(){
    this.props.onPress()
  }

  render() {
    const { style, msgArr, btnTitle, icon } = this.props;
    return (
      <View style={[{
              flexDirection:'column',
              alignItems:'center',
              backgroundColor: sdStyles.SDBGColorMain,
              width: '100%',
              height: CSS.pixel(1200, true),
              justifyContent: 'center',
              borderWidth: 0,
              borderColor:'#f00',
            }, style]}>
          <View style={{
            padding: CSS.pixel(40),
            flexDirection: 'column',
            alignItems:'center',
          }}>
            <Image source={icon} style={{
              position: 'relative',
              top: CSS.pixel(-100,true),
              marginBottom:CSS.pixel(0,true),
            }} />

            {msgArr.map((n,i)=>{
              return (<Text key={i} style={{
                color: sdStyles.SDFontColorSubtitle,
                fontSize: CSS.textSize(24),
                position: 'relative',
                top: CSS.pixel(-80,true),
              }}>{n}</Text>)
            })}
            
          </View>

          <SDButton
            style={{
              flexDirection: "column",
              alignSelf: "center",
              marginVertical: 20,
              backgroundColor: sdStyles.SDMainColor,
              borderRadius: 20,
              width: CSS.pixel(550),
              zIndex: 6,
              position: "relative",
              top: 0, //CSS.pixel(200, true),
              left: 0,
            }}
            btnStyle={{
              fontSize: CSS.pixel(36),
              color: "#fff",
              position: "relative",
              top: 0 //-4
            }}
            onPress={this.onPressAction.bind(this)}
            title={btnTitle}
          />

        </View>
    );
  }
}

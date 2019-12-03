/* @flow */
import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
import SDLine from "@sd_components/SDLine";
import SDTextBold from "@sd_components/SDTextBold";
import SDTextGrey from "@sd_components/SDTextGrey";

type Props = {};

export default class HeaderText extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, titles } = this.props;
    return (
      <View
        style={[{
          flexDirection: "column",
          alignItems: "center",
          paddingVertical: CSS.pixel(20, true),
          backgroundColor: "#fff",
          marginBottom: CSS.pixel(0, true),
        },style]}
      >

        {(Array.isArray(titles) && titles[0]) ? <SDLine ><SDTextBold title={titles[0]} /></SDLine> : null}

        <SDLine >
          {(Array.isArray(titles)) ? titles.map((n,i)=>{
            if(i>0){
              if(n.toString().match(/^[0-9]/i)){
                return (<SDTextBold key={i} title={titles[i]} />)
              } else {
                return (<SDTextGrey key={i} title={titles[i]} />)
              }
            }
            return null;
          }) : null}
        </SDLine>
      </View>
    );
  }
}

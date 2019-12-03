/* @flow */
import React, { PureComponent } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { WhiteSpace } from "antd-mobile";
import * as sdStyles from "@styles";

type Props = {};

//增加底部空白
export default class FootSpace extends PureComponent<Props> {
  props: Props;

  render() {
    const { style } = this.props;
    return (
      <View>
        <WhiteSpace
          size="xl"
          style={[
            {
              backgroundColor: sdStyles.SDBGColorMain
            },
            style
          ]}
        />
        <WhiteSpace
          size="xl"
          style={[{ backgroundColor: sdStyles.SDBGColorMain }, style]}
        />
        <WhiteSpace
          size="xl"
          style={[{ backgroundColor: sdStyles.SDBGColorMain }, style]}
        />
        <WhiteSpace
          size="xl"
          style={[{ backgroundColor: sdStyles.SDBGColorMain }, style]}
        />
      </View>
    );
  }
}

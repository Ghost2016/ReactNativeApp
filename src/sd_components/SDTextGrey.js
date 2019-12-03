/* @flow */
import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";

type Props = {};

export default class SDTextGrey extends PureComponent<Props> {
  props: Props;

  render() {
    const { style, title, ...otherProps } = this.props;
    return (

        <Text
        {...otherProps}
            style={{
              fontSize: CSS.pixel(28),
              color: sdStyles.SDFontColorSubtitle
            }}
          >
            {title}
          </Text>

    );
  }
}

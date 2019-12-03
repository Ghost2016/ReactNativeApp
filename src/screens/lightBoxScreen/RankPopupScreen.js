/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet ,View, Platform } from "react-native";
import { RankPopup } from "@src/sd_rank";
import PropTypes from "prop-types";
import { CSS } from "../../common/SDCSS";
import { Touchable } from "@src/sd_components";
import { isIphoneX } from "../../utils/iphonex";
const _styles = {
  container: {
    width: CSS.width(),
    height: CSS.height(),
    backgroundColor:'#00000018',
    paddingTop:  isIphoneX() ? 44 : 20
  }
}
export default class RankPopupScreen extends PureComponent {
  constructor() {
    super();
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  componentDidMount() {}
  render() {
    return (
      <Touchable style={_styles.container} onPress={this.context.navigator.dismissLightBox}>
        <RankPopup {...this.props}/>
      </Touchable>
    );
  }
}

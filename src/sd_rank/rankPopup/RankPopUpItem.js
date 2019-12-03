/* @flow */
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image
} from "react-native";

import { Touchable } from "@src/sd_components/";
import * as sdStyles from "@src/styles";
import PropTypes from "prop-types";
import { CSS } from "../../common/SDCSS";
const styles = StyleSheet.create({
  msgText: {
    fontSize: CSS.textSize(30),
    textAlign: "center"
  },
  selectedText:{
    fontWeight: sdStyles.SDFontMedium
  },
  msgItem: {
    height: CSS.pixel(120),
    paddingLeft: CSS.pixel(30),
    paddingRight: CSS.pixel(50),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "chartreuse"
  },
  img: {
    width: CSS.pixel(38),
    height: CSS.pixel(38)
  }
});

type Props = {
  name: string,
  selected: boolean,
  index: number,
  onPress: (index: number) => void,
  key: string
};

export default class RankPopUpItem extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected
    };
  }
  context: Context;
  props: Props;

  static contextTypes = {
    refs: PropTypes.object.isRequired
  };

  static defaultProps = {
    name: "",
    selected: false,
    index: 0,
    onPress: () => {}
  };
  // 当前条目被点击
  handlePress = () => {
    const { index, onPress } = this.props;
    onPress(index);
  };
  componentWillReceiveProps = nextProps => {
    if (nextProps.selected !== undefined) {
      this.setState({
        selected: nextProps.selected
      });
    }
  };

  render() {
    const { name, index } = this.props;
    const { selected } = this.state;
    return (
      <Touchable onPress={this.handlePress}>
        <View style={[styles.msgItem, sdStyles.default.separator, (index === 4) && {borderBottomWidth:0}]}>
          <Text style={[styles.msgText, selected && styles.selectedText]}>{name}</Text>
          {selected && (<Image style={styles.img} source={require("@img/rank/rank_ico_done.png")}/>)}
        </View>
      </Touchable>
    );
  }
}

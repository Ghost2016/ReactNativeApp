import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Easing,
  UIManager,
  findNodeHandle,
  ScrollView
} from "react-native";
const { width } = Dimensions.get("window");
import * as sdStyles from "@src/styles";
import { Touchable } from "@src/sd_components";
import RankPopUpItem from "./RankPopUpItem";
import PropTypes from "prop-types";
import { CSS } from "../../common/SDCSS";
type Props = {
  // onPress: (id: number) => void
};

export default class RankPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { name: "本专业排名", key: "1", selected: false, index: 0 },
        { name: "同类专业排名", key: "2", selected: false, index: 1 },
        { name: "本校排名", key: "3", selected: false,  index: 2 },
        { name: "同类院校排名", key: "4", selected: false,  index: 3 },
        { name: "城市排名", key: "5", selected: false,  index: 4 }
      ],
      offsetTop: CSS.pixel(206) + CSS.pixel(40)
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired
  };
  onPress = index => {
    const item = this.state.data.filter(d => {
      return d.index === index;
    });
    this.context.refs["rank_tab_one"].onPopupItemPressed(item[0]);
  };
  componentWillMount() {}

  render() {
    const { data, offsetTop } = this.state;
    const { popupSelectedIndex, style } = this.props;
    // console.warn('offsetTop', offsetTop)
    return (
      <View
        ref={"rank_popup_container"}
        style={[
          styles.container,
          {
            marginTop: offsetTop
          },
          style
        ]}
      >
        <View style={styles.triangle} />
        <View style={styles.innerContainer}>
          {data.map((item) => {
            return (
              <RankPopUpItem
                index={item.index}
                key={item.key}
                name={item.name}
                selected={popupSelectedIndex === item.index}
                onPress={this.onPress}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    width: width,
    justifyContent: "center",
    alignItems: "center"
  },
  innerContainer: {
    backgroundColor: "#fff",
    width: CSS.pixel(670),
    borderRadius: CSS.pixel(20)
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: CSS.pixel(16),
    borderRightWidth: CSS.pixel(16),
    borderBottomWidth: CSS.pixel(20),
    borderTopWidth: CSS.pixel(20),
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "#fff"
  }
});

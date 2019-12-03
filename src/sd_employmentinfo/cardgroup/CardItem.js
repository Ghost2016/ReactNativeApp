/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  Image,
  TouchableOpacity
} from "react-native";
import { CSS } from "../../common/SDCSS";
import SDTouchOpacity from "../../common/SDTouchOpacity";

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width / 2 - CSS.pixel(41),
    height: 80,
    backgroundColor: "#fff",
    // borderRadius: 10,
    borderWidth: 1,
    borderColor: "#efefef",
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.2,
    // shadowRadius: 5,
    // shadowColor: "#999",
    // //注意：这一句是可以让安卓拥有灰色阴影
    // elevation: 4,
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center"
  },
  img: {
    // width: Dimensions.get("window").width <= 320 ? 40 : 50,
    // height: Dimensions.get("window").width <= 320 ? 40 : 50
    paddingLeft: CSS.pixel(38),
    paddingRight: CSS.pixel(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: "#333",
    fontSize: Dimensions.get("window").width <= 320 ? 14 : 16
  },
  subText: {
    color: "#999",
    fontSize: 12,
    marginTop: 6
  }
});

const imgs = {
  icon01: require("@img/home/home_ico_Remuneration.png"),
  icon02: require("@img/home/home_ico_field.png"),
  icon03: require("@img/home/home_ico_company.png"),
  icon04: require("@img/home_ico_more.png")
};

export default class CardItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    const _styles = this.props.style || {};
    return (
      <SDTouchOpacity
        onPress={this.props.onPress ? this.props.onPress : null}
        style={[styles.container, { ..._styles }]}
        activeOpacity={0.8}
      >
        <View style={styles.img}>
          <Image
            source={imgs[this.props.img]}
            resizeMode="cover"
          />
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
          <View>
            <Text numberOfLines={1} style={styles.title}>{this.props.title}</Text>
          </View>
          {
            typeof this.props.count !== 'undefined' && <View>
            <Text numberOfLines={1} style={styles.subText}>样本数{this.props.count}</Text>
          </View>
          }
          
        </View>
      </SDTouchOpacity>
    );
  }
}

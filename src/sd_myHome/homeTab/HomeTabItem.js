import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import ScroeProgress from "../../sd_scroeprogress/ScroeProgress";
import NewestTrends from "./NewestTrends";
import GrowTask from "./GrowTask";
import OwnCerfiticate from "./OwnCerfiticate";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f3f3",
    width: "100%"
  }
});

// 我的主页我的关注和粉丝组件
export default class LikeAndFans extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    return (
      <View style={[styles.container]}>
        <ScroeProgress />
        {this.props.hide ? null : (
          <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>

            <NewestTrends switchTab={this.props.switchTab} />

            <GrowTask />

            <OwnCerfiticate />
          </View>
        )}
      </View>
    );
  }
}

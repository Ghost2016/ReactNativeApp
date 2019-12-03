/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity
  //ActivityIndicator
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import { getUserBaseInfo } from "@src/users/usersSelector";
import { getUserPower } from "@src/directSelectors";
import store from "@boot/store";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CardPipe from "./card/CardPipe";
import CardLine from "./card/CardLine";
import { navScreen } from "../styles";
import CircleChart from "../sd_charts/CircleChart/CircleChart";
import { LiquidGauge } from "../sd_charts/index";
import { _getPower } from "@utils/funcs";
import { setUserState } from "@boot/actions";
import SDLoading from "@sd_components/SDLoading";
import { getUserAllInfo } from "../users/usersSelector";
import ExpDetailScreen from "../screens/pushScreen/expDetail/ExpDetailScreen";
const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
    borderStyle: "solid",
    flexDirection: "row"
  }
});

class ScroeChartWrap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      entries: ["pipe", "line"],
      sliderWidth: Dimensions.get("window").width,
      itemWidth: Dimensions.get("window").width,
      currIndex: 0,
    };
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.context.refs['__scoreChartWrap'] = this;
    //   console.log(this.props)
    this.getPower().then(data => {
      this.setState({
        loading: false
      });
    });
  }

  getPower = () => {
    return _getPower(this, true).then(({results}) => {
      store.dispatch(setUserState(results));
      return results;
    });
  };

  _renderItem({ item, index }) {
    switch (item) {
      case "pipe":
        return <CardPipe />;
      case "line":
        return <CardLine />;
      default:
        break;
    }
  }

  render() {
    const { user } = this.props;
    let salaryPercent = parseInt(1000 * parseInt(user.salary, 10) / 20000, 10) / 10;
    if(salaryPercent > 100) salaryPercent = 100;
    return (
      <TouchableOpacity
        onPress={() => {
          this.context.navigator.push(
            navScreen("PushScreen", "职么力", {
              passProps: {
                screen: () => <ExpDetailScreen /> // 自定义传递props
              }
            })
          );
          // this.context.navigator.push(navScreen("ExpDetailScreen", "职么力"));
        }}
        activeOpacity={0.8}
        style={styles.container}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ height: 150 }}>
            {this.state.loading ? (
              <SDLoading />
            ) : (
              <LiquidGauge value={user.power} />
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#666", fontSize: 14 }}>
              {this.props.user.up_power > 0 ? "较上周" : "较上周"}
            </Text>
            <Text style={{ color: "#fed200", fontSize: 12 }}>
              {this.props.user.up_power > 0
                ? `+${this.props.user.up_power}`
                : 0}
            </Text>
          </View>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ height: 150 }}>
            {this.state.loading ? (
              <SDLoading />
            ) : (
              <LiquidGauge
                // value={user.salary}
                value={salaryPercent}  // 随机50-100
                type="other"
                text={user.salary}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#666", fontSize: 14 }}>
              {this.props.user.up_salary > 0 ? "较上周" : "较上周"}
            </Text>
            <Text style={{ color: "#fed200", fontSize: 12 }}>
              {this.props.user.up_salary > 0
                ? `+¥${this.props.user.up_salary}`
                : 0}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  user: getUserAllInfo(state, props)
}))(ScroeChartWrap);

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Button,
  Dimensions,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import {
  Tabs,
  InputItem,
  WhiteSpace,
  Badge,
  DatePicker,
  List
} from "antd-mobile";
import { SectionView, SectionViewSeparator } from "@src/common";
import {
  AreaChart,
  CircleChart,
  ThreeCircleChart,
  SlicedPieChart,
  BarChart
} from "../../sd_charts";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");
import chartConfig from "@src/sd_charts/chartConfig";
// 取假数据
const defaultData = chartConfig.chartOption.datasets;

const styles = {
  container: {
    backgroundColor: "#fff"
  },
  yellowTop: {
    backgroundColor: "#fed201",
    height: 150
  },
  rowFlexContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 50
  },
  rowFlex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1
  }
};

/**
 * 个人主页页面
 */
class PersonalPageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      area_data: defaultData.area[1],
      area_categary: ["6月4号", "6月5号", "6月6号", "6月7号", "6月8号"]
    };
  }
  componentDidMount() {
    const { area_data, area_categary } = this.state;
    setTimeout(() => {
      this.setState({
        area_data: defaultData.area[1].slice(0, 3),
        area_categary: area_categary.slice(0, 3)
      });
    }, 2000);
  }

  render() {
    const { area_data, area_categary } = this.state;
    return (
      <View style={styles.container}>
        {/* <AreaChart
        data={area_data}
        categary={area_categary}
        /> */}
        <BarChart />
      </View>
    );
  }
}
export default PersonalPageScreen;

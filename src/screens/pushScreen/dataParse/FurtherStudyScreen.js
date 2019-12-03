import React from "react";
import ReactNative, {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  UIManager,
  Image
} from "react-native";
import { Toast } from "antd-mobile";
import TitleWrap from "../../../sd_employmentinfo/titlelistwarp/TitleWrap";
import PropTypes from "prop-types";
import { CSS } from "../../../common/SDCSS";
import SDTipDocker from "../../../common/SDTipDocker";
import ConnectWithActions from "../../../connectWithActions";
import { getSchoolName, getMajor } from "../../../directSelectors";
import {
  LineChart,
  ThreeCircleChart,
  SlicedPieChart,
  AreaChart,
  NormalizeChart,
  BarChart
} from "../../../sd_charts/index";
import chartConfig from "@src/sd_charts/chartConfig";
import SDTabs2 from "../../../sd_components/SDTabs2";
// 取假数据
const defaultData = chartConfig.chartOption.datasets;

const wIs320 = Dimensions.get("window").width <= 320;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
  }
});

// 深造学习分布
class FurtherStudyScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startIndex: 0,
      selectedText: "专业",
      rank: {
        person_num: this.props.person_num,
        schoolNum: this.props.schoolNum ? this.props.schoolNum : 0,
        majorNum: this.props.majorNum ? this.props.majorNum : 0
      },
      indexName: ["就业", "考研", "留学"],
      radioData: [[], [], []],
      salaryData: [[], [], []]
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  onSelectQueryType() {
    UIManager.measure(
      ReactNative.findNodeHandle(this.refs["select_text"]),
      (x, y, w, h, px, py) => {
        this.refs["select_tipDocker"].show(px + 40, py + 20);
      }
    );
  }
  async componentDidMount() {
    // 默认选择的学校
    Toast.loading("加载中");
    let res1 = await this.props.actions.getPostGraduateRatioAction({
      school_name: this.props.schoolName,
      major: "不限",
      degree: "本科"
    });

    let res2 = await this.props.actions.getPostGraduateSalaryAction({
      school_name: this.props.schoolName,
      major: "不限",
      degree: "本科",
      sort: "avg_salary"
    });

    Toast.hide();

    // 判断有多少不同数据
    let resultTemp1 = [[], [], []];
    let resultTemp2 = [[], [], []];
    let count = 0;
    if (res1.results.length > 0) {
      res1.results.map((item, index, self) => {
        if (item.postgraduate == "就业") {
          resultTemp1[0].push(item);
          count = count + (item.person_num ? item.person_num : 0);
        } else if (item.postgraduate == "考研") {
          resultTemp1[1].push(item);
          count = count + (item.person_num ? item.person_num : 0);
        } else if (item.postgraduate == "留学") {
          resultTemp1[2].push(item);
          count = count + (item.person_num ? item.person_num : 0);
        }
      });
    }

    this.state.rank.person_num = count;

    if (res2.results.length > 0) {
      res2.results.map((item, index, self) => {
        if (item.postgraduate == "就业") {
          resultTemp2[0].push(item);
        } else if (item.postgraduate == "考研") {
          resultTemp2[1].push(item);
        } else if (item.postgraduate == "留学") {
          resultTemp2[2].push(item);
        }
      });

      resultTemp2[0] = resultTemp2[0]
        .sort((a, b) => {
          return parseInt(a.work_year) <= parseInt(b.work_year);
        })
        .slice(0, 10);
      resultTemp2[1] = resultTemp2[1]
        .sort((a, b) => {
          return parseInt(a.work_year) <= parseInt(b.work_year);
        })
        .slice(0, 10);
      resultTemp2[2] = resultTemp2[2]
        .sort((a, b) => {
          return parseInt(a.work_year) <= parseInt(b.work_year);
        })
        .slice(0, 10);
    }
    let resultFilterData = [];
    if (resultTemp2[0].length !== 0) {
      resultFilterData.push(resultTemp2[0]);
    }
    if (resultTemp2[1].length !== 0) {
      resultFilterData.push(resultTemp2[1]);
    }
    if (resultTemp2[2].length !== 0) {
      resultFilterData.push(resultTemp2[2]);
    }
    this.setState({
      radioData: resultTemp1,
      salaryData: resultFilterData
    });
  }
  async fetchBiData() {
    Toast.loading("加载中");
    let queryParams1 = {
      school_name: this.props.schoolName,
      degree: "本科"
    };
    let queryParams2 = {
      school_name: this.props.schoolName,
      degree: "本科",
      sort: "avg_salary"
    };
    if (this.state.selectedText == "专业") {
      queryParams1["major"] = this.props.majorName;
      queryParams2["major"] = this.props.majorName;
    } else {
      queryParams1["major"] = "不限";
      queryParams2["major"] = "不限";
    }

    // 默认选择的学校
    let res1 = await this.props.actions.getPostGraduateRatioAction(
      queryParams1
    );

    let res2 = await this.props.actions.getPostGraduateSalaryAction(
      queryParams2
    );

    Toast.hide();

    // 判断有多少不同数据
    let resultTemp1 = [[], [], []];
    let resultTemp2 = [[], [], []];
    let count = 0;
    if (res1.results.length > 0) {
      res1.results.map((item, index, self) => {
        if (item.postgraduate == "就业") {
          resultTemp1[0].push(item);
          count = count + (item.person_num ? item.person_num : 0);
        } else if (item.postgraduate == "考研") {
          resultTemp1[1].push(item);
          count = count + (item.person_num ? item.person_num : 0);
        } else if (item.postgraduate == "留学") {
          resultTemp1[2].push(item);
          count = count + (item.person_num ? item.person_num : 0);
        }
      });
    }

    this.state.rank.person_num = count;

    if (res2.results.length > 0) {
      res2.results.map((item, index, self) => {
        if (item.postgraduate == "就业") {
          resultTemp2[0].push(item);
        } else if (item.postgraduate == "考研") {
          resultTemp2[1].push(item);
        } else if (item.postgraduate == "留学") {
          resultTemp2[2].push(item);
        }
      });

      resultTemp2[0] = resultTemp2[0]
        .sort((a, b) => {
          return parseInt(a.work_year) <= parseInt(b.work_year);
        })
        .slice(0, 10);
      resultTemp2[1] = resultTemp2[1]
        .sort((a, b) => {
          return parseInt(a.work_year) <= parseInt(b.work_year);
        })
        .slice(0, 10);
      resultTemp2[2] = resultTemp2[2]
        .sort((a, b) => {
          return parseInt(a.work_year) <= parseInt(b.work_year);
        })
        .slice(0, 10);
    }
    let resultFilterData = [];
    if (resultTemp2[0].length !== 0) {
      resultFilterData.push(resultTemp2[0]);
    }
    if (resultTemp2[1].length !== 0) {
      resultFilterData.push(resultTemp2[1]);
    }
    if (resultTemp2[2].length !== 0) {
      resultFilterData.push(resultTemp2[2]);
    }
    this.setState({
      radioData: resultTemp1,
      salaryData: resultFilterData
    });
  }
  handleTabChange(page) {
    if (page == 0 && this.state.startIndex != 0) {
      this.setState({
        startIndex: page
      });
      this.setState(
        {
          startIndex: page,
          selectedText: "专业",
          radioData: [[], [], []],
          salaryData: [[], [], []]
        },
        () => {
          this.fetchBiData();
        }
      );
    } else if (page == 1 && this.state.startIndex != 1) {
      this.setState(
        {
          startIndex: page,
          selectedText: "学校",
          radioData: [[], [], []],
          salaryData: [[], [], []]
        },
        () => {
          this.fetchBiData();
        }
      );
    }
  }
  render() {
    let salaryArr = this.state.salaryData.map((item, index) => {
      // 每一组数据不能少于两个 不然会崩溃
      if (item.length <= 1) {
        return [];
      }
      return item.map((item2, index2) => {
        return {
          x: item2.work_year,
          y: item2.avg_salary,
          key: index2 + ""
        };
      });
    });
    if (salaryArr.length == 0) {
      salaryArr = [[], [], []];
    } else if (salaryArr.length == 1) {
      salaryArr = [salaryArr[0], [], []];
    } else if (salaryArr.length == 2) {
      salaryArr = [salaryArr[0], salaryArr[1], []];
    }
    return (
      <ScrollView style={styles.container}>

        <View
          style={{
            height: CSS.pixel(222, true)
          }}
        >
          <Image
            source={require("@img/home/home_data_seach_bg2.png")}
            resizeMode="cover"
            style={{ position: "absolute", left: 0, right: 0, width: '100%', height: CSS.pixel(311, true), top: 0 }}
          />
          <View
            style={{
              position: "absolute",
              bottom: CSS.pixel(44, true),
              left: CSS.pixel(30)
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                color: "#333",
                fontSize: CSS.textSize(30)
              }}
            >
              深造情况数据报告
            </Text>
          </View>
        </View>

        <SDTabs2
          tabTitles={["全国本专业深造情况", "本校深造情况"]}
          page={this.state.startIndex}
          underLineWidth={CSS.pixel(110)}
          onChangeTab={this.handleTabChange.bind(this)}
          activeColor={"#333333"}
          inActiveColor={"#999"}
          style={{
            backgroundColor: "#fff",
            paddingTop: CSS.pixel(30),
            minHeight: 0,
          }}
          tabContentStyle={{
            minHeight: 0,
            paddingTop: CSS.pixel(30)
          }}
        >
          <View
            style={{
              backgroundColor: "#f3f3f3",
              height: CSS.pixel(130),
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: CSS.pixel(30)
            }}
          >
            <Text
              style={{
                color: "#333",
                fontSize: CSS.textSize(24),
                lineHeight: 20
              }}
            >
              本数据收集了
              {this.state.rank.person_num}个{this.props.majorName}
              专业真实就业案例，为你全面解析本专业就业情况
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#f3f3f3",
              height: CSS.pixel(130),
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: CSS.pixel(30)
            }}
          >
            <Text
              style={{
                color: "#333",
                fontSize: CSS.textSize(24),
                lineHeight: 20
              }}
            >
              本数据收集了
              {this.state.rank.person_num}个{this.props.schoolName}及
              {this.props.majorName}
              真实就业案例，为你全面解析本学校就业情况
            </Text>
          </View>
        </SDTabs2>

        <View
          style={{
            padding: CSS.pixel(30),
            backgroundColor: "#fff"
          }}
        >
          <TitleWrap
            title={this.state.selectedText + "深造比例"}
            nomore={true}
          />
          <View
            style={{
              height: CSS.pixel(600, true),
              marginTop: CSS.pixel(30, true)
            }}
          >
            {JSON.stringify(this.state.radioData) !== "[[],[],[]]" &&
            this.state.radioData &&
            this.state.radioData.length ? (
              <SlicedPieChart
                data={this.state.radioData.map((item, index) => {
                  let itemPie = {
                    x: this.state.indexName[index],
                    y: 0
                  };
                  item.map(item2 => {
                    itemPie.y = itemPie.y + item2.ratio;
                  });
                  return itemPie;
                })}
                pieColors={
                  // chartConfig.chartOption.props.pie.pieColorScalePurple
                  ["#0060FD", '#01ADFF', '#B3E8F8']
                }
                height={CSS.pixel(600, true)}
                onItemPress={item => {
                  //console.warn(item);
                }}
              />
            ) : null}
          </View>
        </View>

        <View
          style={{
            padding: CSS.pixel(30),
            marginTop: CSS.pixel(30, true),
            backgroundColor: "#fff"
          }}
        >
          <TitleWrap
            title={this.state.selectedText + "深造薪资增长趋势"}
            nomore={true}
          />
          <View
            style={{
              height: CSS.pixel(500, true),
              marginTop: CSS.pixel(30, true)
            }}
          >
            {JSON.stringify(this.state.salaryData) !== "[[],[],[]]" &&
            this.state.salaryData &&
            this.state.salaryData.length ? (
              this.state.selectedText == "学校" ? (
                <LineChart
                  height={CSS.pixel(500, true)}
                  yLabel="薪资单位：元"
                  xLabel="毕业年限"
                  data={salaryArr}
                  // lineColors={["#fed200", "#cf4cff", "#834cff"]}
                  lineColors={["#FED200", "#01ADFF", "#00EEA2"]}
                  showLegend={true}
                  legend={["本专科就业", "研究生", "留学"]}
                  categary={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                  toolTipFormat={d => `${d.y}元`}
                />
              ) : (
                <LineChart
                  height={CSS.pixel(500, true)}
                  yLabel="薪资单位：元"
                  xLabel="毕业年限"
                  data={salaryArr}
                  // lineColors={["#fed200", "#cf4cff", "#834cff"]}
                  lineColors={["#FED200", "#01ADFF", "#00EEA2"]}
                  showLegend={true}
                  legend={["本专科就业", "研究生", "留学"]}
                  categary={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                  toolTipFormat={d => `${d.y}元`}
                />
              )
            ) : null}
          </View>
        </View>

        <View
          style={{ paddingHorizontal: CSS.pixel(30), backgroundColor: "#fff"}}
        >
          <View
            style={{
              padding: CSS.pixel(30),
              backgroundColor: "#eee",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                color: "#333",
                fontSize: 16,
                marginBottom: CSS.pixel(24, true)
              }}
            >
              -数据解读-
            </Text>
            <Text
              style={{
                color: "#666",
                fontSize: 14,
                lineHeight: CSS.pixel(41, true)
              }}
            >
              1
              平均薪资实际使用的是中位数薪资，也就是样本中排第50%的样本的薪资。结果不会受到特别高或特别低薪资影响。%的样本的薪资。结果不会受到特别高或特别低薪资影响。
            </Text>
            <Text
              style={{
                color: "#666",
                fontSize: 14,
                marginTop: CSS.pixel(48, true),
                lineHeight: CSS.pixel(41, true)
              }}
            >
              2
              对于综合性大学而言，由于学校各专业不同，就业情况不同，故专业薪资增长趋势相较于学校薪资增长趋势参考性更强。
            </Text>
          </View>
        </View>
        <View style={{backgroundColor: '#fff', height: CSS.pixel(30, true)}}>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  majorName: getMajor(state, props),
  schoolName: getSchoolName(state, props)
}))(FurtherStudyScreen);

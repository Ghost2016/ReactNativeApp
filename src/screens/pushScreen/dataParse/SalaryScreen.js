import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  Image
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import { getSchoolName, getMajor, getSchoolLevel } from "../../../directSelectors";
import { CSS } from "../../../common/SDCSS";
import { SectionViewSeparator } from "../../../common/index";
import { LineChart } from "../../../sd_charts";
import chartConfig from "@src/sd_charts/chartConfig";
import { Toast } from "antd-mobile";
import SDTabs2 from "../../../sd_components/SDTabs2";
import Reactotron from "reactotron-react-native";
// 取假数据
const defaultData = chartConfig.chartOption.datasets;
const wIs320 = Dimensions.get("window").width <= 320;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 薪资增长趋势分布
class SalaryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startIndex: 0,
      chartOk: false,
      chartLoading: true,
      data: [],
      majorWorkYear: [],
      majorWorkYearLoading: true,
      schoolWorkYear: [],
      schoolWorkYearLoading: true
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    // 全国本专业就业
    this.props.actions.getMajorWorkYearAction(
      {
        major: this.props.majorName,
        work_year: 5,
        sort: "avg_salary",
        // degree: this.props.degreeName === "专科" ? "专科及以下" : this.props.degreeName,
        degree: this.props.degreeName === "专科" ? "专科" : this.props.degreeName,
        compare: false
      },
      res => {}
    ).then(
      res => {
        if(res.status === "ok") {
          this.setState({
            majorWorkYear: res.results.sort((d1, d2) => {
              return d1.work_year - d2.work_year;
            }).map(item => {
              return {
                x: item.work_year,
                y: item.avg_salary
              }
            }),
            majorWorkYearLoading: false
          });
        } else{
          this.setState({
            majorWorkYearLoading: false
          });
        }
      }
    ).catch(
      e => {
        this.setState({
          majorWorkYearLoading: false
        });
      }
    )
    // 本校就业情况
    this.props.actions.getSchoolWorkYearAction(
      {
        school_name: this.props.schoolName,
        work_year: 5,
        degree: '不限',//this.props.degreeName === "专科" ? "专科及以下" : this.props.degreeName,
        sort: "work_year",
        // 去掉不限的数据
        compare: false
      },
      res => {}
    ).then(
      res => {
        if(res.status === "ok") {
          this.setState({
            schoolWorkYear: res.results.sort((d1, d2) => {
              return d1.work_year - d2.work_year;
            }).map(item => {
              return {
                x: item.work_year,
                y: item.avg_salary
              }
            }),
            schoolWorkYearLoading: false
          });
        } else{
          this.setState({
            schoolWorkYearLoading: false
          });
        }
        // Reactotron.log(this.state.majorWorkYear)
      }
    ).catch(
      e => {
        this.setState({
          schoolWorkYearLoading: false
        });
      }
    )
    return;
    this.props.actions.getSchoolMajorWorkYearAction(
      {
        school_name: this.props.schoolName,
        major: this.props.majorName,
        // 过滤数据
        degree: "不限",
        page_size: 22
      },
      res => {
        if (res.status == "ok") {
          let data = [];
          // 专业数据

          let temp1 = res.results
            .filter(item => {
              return item.major === "不限";
            })
            .map(item => {
              return {
                x: item.work_year,
                y: item.avg_salary
              };
            });
          if (temp1.length > 0) {
            data.push(temp1);
          }
          // 学校数据
          let temp2 = res.results
            .filter(item => {
              return item.major !== "不限";
            })
            .map(item => {
              return {
                x: item.work_year,
                y: item.avg_salary
              };
            });
          if (temp2.length > 0) {
            data.push(temp2);
          }
          this.setState({
            data: data,
            chartLoading: false
          });
        } else {
          this.setState({
            chartLoading: false
          });
        }
      }
    );
  }

  handleTabChange(page) {
    this.setState({
      startIndex: page
    });
  }

  render() {
    let {
      majorWorkYearLoading,
      schoolWorkYearLoading,
      chartLoading,
      data,
      majorWorkYear,
      schoolWorkYear,
     } = this.state;
    if (data.length == 0) {
      data = [[], []];
    } else if (data.length == 1) {
      data = [data[0], []];
    }
    data = data.map(c => {
      if (c.length <= 1) {
        return [];
      }
      return c;
    });
    return (
      <View style={styles.container}>
        <View
          style={{
            height: CSS.pixel(311, true)
          }}
        >
          <Image
            source={require("@img/home/home_data_seach_bg.png")}
            resizeMode="cover"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              width: "100%",
              height: CSS.pixel(311, true),
              top: 0
            }}
          />

          <View
            style={{
              position: "absolute",
              bottom: CSS.pixel(50, true),
              left: CSS.pixel(30),
              width: '100%',
            }}
          >
            {this.state.startIndex == 1 ? (
              <Text
                style={{
                  color: "#333",
                  fontSize: CSS.textSize(28),
                  paddingRight: CSS.pixel(60),
                  lineHeight: CSS.pixel(40),
                  width: "100%",
                  flexWrap: "wrap"
                }}
              >
                本报告收集了
                <Text style={{ color: "#333", fontWeight: "900" }}>
                  {this.props.currSchoolNum}
                </Text>
                个全国范围毕业5年内的
                <Text style={{ color: "#333", fontWeight: "900" }}>
                {this.props.schoolName}，{this.props.degreeName}
                </Text>
                学历学生的就业案例，为你全面解析本校就业情况
              </Text>
            ) : (
              <Text
                style={{
                  color: "#333",
                  fontSize: CSS.textSize(28),
                  paddingRight: CSS.pixel(60),
                  lineHeight: CSS.pixel(40),
                  width: "100%",
                  flexWrap: "wrap"
                }}
              >
                本报告收集了
                <Text style={{ color: "#333", fontWeight: "900" }}>
                  {this.props.allSchoolMajorNum}
                </Text>
                个全国范围毕业5年内的
                <Text style={{ color: "#333", fontWeight: "900" }}>
                  {this.props.majorName}，{this.props.degreeName}
                </Text>
                学历学生的就业案例，为你全面解析全国本专业就业情况
              </Text>
            )}
          </View>
        </View>

        <SDTabs2
          tabTitles={["全国本专业就业情况", "本校就业情况"]}
          page={this.state.startIndex}
          underLineWidth={CSS.pixel(110)}
          onChangeTab={this.handleTabChange.bind(this)}
          activeColor={"#333333"}
          inActiveColor={"#999"}
          style={{
            marginTop: CSS.pixel(30)
          }}
          underlineStyle={{
            marginTop: CSS.pixel(6),
            height: CSS.pixel(4)
          }}
        >
          <View style={{}}>
            <SectionViewSeparator style={{backgroundColor:'#f3f3f3'}}/>
            <View style={{marginTop: CSS.pixel(30)}}>
              <LineChart
                loading={majorWorkYearLoading}
                style={{
                  height: 280
                }}
                height={280}
                data={[majorWorkYear]}
                yLabel="薪资单位：元"
                xLabel="毕业年限"
                showLegend={true}
                legend={[`${this.props.majorName}`]}
                lineColors={["#fed200"]}
                toolTipFormat={d => `${d.y}元`}
              />
            </View>
          </View>
          <View style={{}}>
            <SectionViewSeparator style={{backgroundColor:'#f3f3f3'}}/>
            <View style={{marginTop: CSS.pixel(30)}}>
              <LineChart
                loading={schoolWorkYearLoading}
                style={{ height: 280 }}
                height={280}
                data={[schoolWorkYear]}
                yLabel="薪资单位：元"
                xLabel="毕业年限"
                showLegend={true}
                legend={[this.props.schoolName]}
                lineColors={["#fe8900"]}
                toolTipFormat={d => `${d.y}元`}/>
              </View>
          </View>
        </SDTabs2>

        <View style={{ paddingHorizontal: CSS.pixel(30) }}>
          <View
            style={{
              padding: CSS.pixel(30),
              marginBottom: CSS.pixel(30, true),
              backgroundColor: "#eee",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#333", fontSize: CSS.textSize(28) }}>
              -数据解读-
            </Text>
            <Text
              style={{
                color: "#666",
                fontSize: CSS.pixel(24),
                marginTop: CSS.pixel(30, true),
                lineHeight: CSS.pixel(41, true),
                width: "100%",
                flexWrap: "wrap"
              }}
            >
              {this.state.startIndex == 1 ? "1." : null}
              薪资为中位数，也就是处于最中间的样本的薪资，以保证结果不会受到极高或极低薪资的影响。
            </Text>
            {this.state.startIndex == 1 ? (
              <Text
                style={{
                  color: "#666",
                  fontSize: CSS.pixel(24),
                  marginTop: CSS.pixel(30, true),
                  lineHeight: CSS.pixel(41, true),
                  width: "100%",
                  flexWrap: "wrap"
                }}
              >
                2.对于综合性大学而言，由于学校各专业不同，就业情况不同，故专业薪资增长趋势相较于学校薪资增长趋势参考性更强。
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

// export default connectStyle('', styles)(AvatarItem);
export default ConnectWithActions((state, props) => ({
  schoolName: getSchoolName(state, props),
  majorName: getMajor(state, props),
  degreeName: getSchoolLevel(state, props)
}))(SalaryScreen);

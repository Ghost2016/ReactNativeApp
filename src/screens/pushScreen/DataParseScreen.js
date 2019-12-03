import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  PanResponder
} from "react-native";

import {
  SalaryDataParseTextC,
  DomainDataParseTextC,
  CompanyDataParseTextC,
  FurtherStudyParseTextC
} from "../../sd_employdataparse/EmployDataParseText";
import PropTypes from "prop-types";
import TitleWrap from "../../sd_employmentinfo/titlelistwarp/TitleWrap";
import SalaryTable from "../../sd_salarytable/SalaryTable";
import { ForceMap } from "@src/sd_charts";
import ViewShot from "react-native-view-shot";
import { CSS } from "../../common/SDCSS";
import ConnectWithActions from "../../connectWithActions";
import { AreaChart } from "../../sd_charts/index";
import { Toast } from "antd-mobile";
import { dismissLightBox } from "../../styles";
import GestureRecognizer from "react-native-swipe-gestures";
import { SDHeader } from "../../common";
import { getMajor, getSchoolLevel } from "../../directSelectors";
import { headerPadding, headerHeight } from "../../common/SDHeader";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9"
  },
  chartBox: {
    padding: CSS.pixel(30)
  },
  chart: {
    marginLeft: -CSS.pixel(26)
    // width: "100%",
    // height: CSS.pixel(600, true),
    // backgroundColor: "#fff",
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // shadowColor: "#ccc",
    //注意：这一句是可以让安卓拥有灰色阴影
    // elevation: 4,
    // marginTop: CSS.pixel(30, true)
  },
  table: {
    width: "100%",
    backgroundColor: "#fff",
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // shadowColor: "#ccc",
    //注意：这一句是可以让安卓拥有灰色阴影
    // elevation: 4,
    marginTop: 10,
    borderRadius: 5
  }
});

// 数据解析屏幕
// 就业薪资解析
export let schoolPersonNum = 0;
export class SalaryParseScreenB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolProfile: {
        address: "",
        type: "",
        is_985: false,
        is_211: false
      },
      schoolWorkYear: [],
      rankData: {
        person_num: 0
      },
      isCapture: false
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    Toast.loading("加载中", 0);
    this.props.actions.getSchoolProfileAction(
      {
        school_name: this.props.schoolName
      },
      res => {
        if (res.length > 0) {
          this.setState({
            schoolProfile: res[0]
          });

          this.props.actions.getSchoolWorkYearAction(
            {
              school_name: this.props.schoolName,
              work_year: 10,
              degree: '不限',//this.props.degreeName,
              sort: "work_year",
              // 去掉不限的数据
              compare: false
            },
            res => {
              schoolPersonNum = 0;
              res.slice(0, 5).map(c => {
                this.state.rankData.person_num = this.state.rankData.person_num + (c.person_num ? c.person_num : 0);
                schoolPersonNum = schoolPersonNum + (c.person_num ? c.person_num : 0);
              });
              this.setState({
                schoolWorkYear: res
              });
            }
          );
        }
        Toast.hide();
      }
    );
    this.context.refs['schoolDetailDataParse'] = this;
  }
  _onScrollView(e) {
    this.refs["_sdHeader"].onScrollHeaderBackground(
      e.nativeEvent.contentOffset.y
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          scrollEventThrottle={0.5}
          onScroll={this._onScrollView.bind(this)}
        >
          <ViewShot
            style={{ backgroundColor: "#f9f9f9" }}
            ref={viewshot => (this.context.refs["_schoolShot"] = viewshot)}
          >
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
              {/* <View
                style={{
                  position: "absolute",
                  bottom: CSS.pixel(133, true),
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
                  {this.props.schoolName}
                  就业数据报告
                </Text>
              </View> */}

              <View
                style={{
                  position: "absolute",
                  bottom: CSS.pixel(67, true),
                  left: CSS.pixel(30)
                }}
              >
                <Text
                  style={{
                    color: "#333",
                    fontSize: CSS.textSize(26),
                    paddingRight: CSS.pixel(60),
                    lineHeight: CSS.pixel(36)
                  }}
                >
                  本报告收集了{" "}
                  <Text style={{ color: "#333", fontWeight: "900" }}>
                    {this.state.rankData.person_num}
                  </Text>
                  个毕业五年内
                  <Text style={{ color: "#333", fontWeight: "900" }}>
                    {this.props.schoolName}
                  </Text>
                  学生的就业案例，为你全面解析该学校就业情况
                </Text>
              </View>

              {
                this.state.isCapture && <View style={{position:'absolute', left: 0, right: 0, top: headerPadding + 13}}>
                  <Text numberOfLines={1} style={{textAlign: 'center', color: "#333", fontSize: CSS.textSize(36)}}>
                    {this.props.schoolName + "就业数据报告"}
                  </Text>
                </View>
              }
              
            </View>

            <GestureRecognizer
              onSwipeRight={state => {
                dismissLightBox();
              }}
              config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80
              }}
              style={{
                padding: CSS.pixel(30),
                marginTop: CSS.pixel(30, true),
                backgroundColor: "#fff"
              }}
            >
              <TitleWrap title="学校概况" nomore={true} />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: CSS.pixel(30)
                }}
              >
                {this.state.schoolProfile.is_985 ? (
                  <View
                    style={{
                      height: 30,
                      marginRight: 10,
                      backgroundColor: "#fed200",
                      paddingHorizontal: 5,
                      paddingVertical: 3,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={{ color: "#333", fontSize: 14 }}>985</Text>
                  </View>
                ) : null}
                {this.state.schoolProfile.is_211 ? (
                  <View
                    style={{
                      height: 30,
                      marginRight: 10,
                      backgroundColor: "#fed200",
                      paddingHorizontal: 5,
                      paddingVertical: 3,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={{ color: "#333", fontSize: 14 }}>211</Text>
                  </View>
                ) : null}
                <View
                  style={{
                    height: 30,
                    marginRight: 10,
                    backgroundColor: "#fed200",
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ color: "#333", fontSize: 14 }}>
                    {this.state.schoolProfile.type}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Image source={require("@img/home/home_ico_Location.png")} />
                <Text style={{ fontSize: 14, color: "#333", marginLeft: 5 }}>
                  {this.state.schoolProfile.address}
                </Text>
              </View>
            </GestureRecognizer>

            <GestureRecognizer
              onSwipeRight={state => {
                dismissLightBox();
              }}
              config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80
              }}
              style={[
                styles.chartBox,
                { marginTop: CSS.pixel(30, true), backgroundColor: "#fff" }
              ]}
            >
              <TitleWrap
                title="薪资增长趋势"
                nomore={true}
                style={{ marginBottom: CSS.pixel(30, true) }}
              />
              <View style={[styles.chart]}>
                {this.state.schoolWorkYear.length > 0 ? (
                  <AreaChart
                    toolTipFormat={d => `${d.y}元`}
                    // height={CSS.pixel(600, true)}
                    yLabel="薪资单位：元"
                    xLabel="毕业年限"
                    data={this.state.schoolWorkYear
                      .filter(item => item.work_year > 0)
                      .sort((w1, w2) => w1.work_year - w2.work_year)
                      .slice(0, 5)
                      .map((item, index) => {
                        return {
                          x: item.work_year,
                          y: item.avg_salary
                        };
                      })}
                  />
                ) : null}
              </View>
            </GestureRecognizer>

            <GestureRecognizer
              onSwipeRight={state => {
                dismissLightBox();
              }}
              config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80
              }}
              style={[
                styles.chartBox,
                { marginTop: CSS.pixel(30, true), backgroundColor: "#fff" }
              ]}
            >
              <TitleWrap
                title="专业薪资分布"
                nomore={true}
                style={{ marginBottom: CSS.pixel(30, true) }}
              />
              <SalaryTable schoolName={this.props.schoolName} />

              <View
                style={{
                  padding: 10,
                  marginTop: 20,
                  marginBottom: 10,
                  backgroundColor: "#eee",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#333", fontSize: 16 }}>-数据解读-</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#999",
                      fontSize: 14,
                      lineHeight: CSS.pixel(41, true),
                      marginTop: CSS.pixel(30)
                    }}
                  >
                    1.薪资为中位数，也就是处于最中间的样本的薪资，以保证结果不会受到极高或极低薪资的影响。
                  </Text>
                  <Text
                    style={{
                      color: "#999",
                      fontSize: 14,
                      lineHeight: CSS.pixel(41, true),
                      marginTop: CSS.pixel(30)
                    }}
                  >
                    2.专业薪资分布取的样本为本学校毕业五年内的学生，薪资取中位数，以保证结果不会受到极高或极低薪资的影响。
                  </Text>
                </View>
              </View>
            </GestureRecognizer>
          </ViewShot>
        </ScrollView>
        <SDHeader
          ref="_sdHeader"
          title={this.props.schoolName + "就业数据报告"}
          fixed
          animate
        />
      </View>
    );
  }
}

export const SalaryParseScreen = ConnectWithActions((state, props) => ({
  degreeName: getSchoolLevel(state, props)
}))(SalaryParseScreenB);

// 就业领域分布情况
class DomainParseScreenB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rank: {
        id: 1814,
        major: "软件工程",
        degree: "不限",
        rank: 1008,
        person_num: 0,
        avg_salary: 13001,
        ratio: 0.9740483983197176
      },
      majorProfile: {
        id: 4335,
        major: "软件工程",
        level1: "工学",
        level2: "计算机类",
        level: "本科"
      },
      majorDetail: {
        id: 4335,
        major: "软件工程",
        major_desc:
          "暂无数据"
      },
      majorWorkYear: [],
      positions: [],
      isCapture: false
    };
  }

  static contextTypes = {
    refs: PropTypes.object.isRequired
  };

  componentDidMount() {
    Toast.loading("加载中", 0);
    this.context.refs['majorDetailDataParse'] = this;
    this.props.actions.getMajorProfileAction(
      {
        major: this.props.majorName,
        level: "本科"
      },
      res => {
        if (res.length > 0) {
          this.setState({
            majorProfile: res[0]
          });

          this.props.actions.getMajorDetailAction(
            {
              major: this.props.majorName,
              level: "本科",
              sort: 1
              // major_id: res[0].id
            },
            res => {
              if (res.length > 0) {
                this.setState({
                  majorDetail: res[0]
                });
              }
            }
          );

          this.props.actions.getMajorWorkYearAction(
            {
              major: this.props.majorName,
              work_year: 10,
              sort: "avg_salary",
              // 去掉不限的数据,
              degree: this.props.degreeName,
              compare: false
            },
            res => {
              schoolPersonNum = 0;
              res.slice(0, 5).map(c => {
                this.state.rank.person_num = this.state.rank.person_num + (c.person_num ? c.person_num : 0);
                schoolPersonNum = schoolPersonNum + (c.person_num ? c.person_num : 0);
              })
              this.setState({
                majorWorkYear: res.sort((d1, d2) => {
                  return d1.work_year - d2.work_year;
                })
              });
            }
          );
        }

        Toast.hide();
      }
    );

    this.props.actions.getMajorPositionSearchAction(
      {
        major: this.props.majorName,
        level: "本科"
      },
      res => {
        if (res.length >= 1) {
          this.setState({
            positions: res
          });
        }
      }
    );
  }

  _onScrollView(e) {
    this.refs["_sdHeader"].onScrollHeaderBackground(
      e.nativeEvent.contentOffset.y
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          scrollEventThrottle={0.5}
          onScroll={this._onScrollView.bind(this)}
        >
          <ViewShot
            style={{ backgroundColor: "#f9f9f9" }}
            ref={viewshot => (this.context.refs["_majorShot"] = viewshot)}
          >
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
                  bottom: CSS.pixel(68, true),
                  left: CSS.pixel(30)
                }}
              >
                <Text
                  style={{
                    color: "#333",
                    fontSize: CSS.textSize(26),
                    paddingRight: CSS.pixel(60),
                    lineHeight: CSS.pixel(34)
                  }}
                >
                  本报告收集了
                  <Text style={{ color: "#333", fontWeight: "900" }}>
                    {this.state.rank.person_num}
                  </Text>
                  个全国范围毕业5年内
                  <Text style={{ color: "#333", fontWeight: "900" }}>
                    {this.props.majorName}
                    专业:{this.props.degreeName}
                  </Text>
                  学历学生的就业案例，为你全面解析该专业就业情况
                </Text>
              </View>
              {
                this.state.isCapture && <View style={{position:'absolute', left: 0, right: 0, top: headerPadding + 13}}>
                  <Text numberOfLines={1} style={{textAlign: 'center', color: "#333", fontSize: CSS.textSize(36)}}>
                    {this.props.majorName + "专业数据报告"}
                  </Text>
                </View>
              }
            </View>

            <GestureRecognizer
              onSwipeRight={state => {
                dismissLightBox();
              }}
              config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80
              }}
              style={[
                styles.chartBox,
                { marginTop: CSS.pixel(30, true), backgroundColor: "#fff" }
              ]}
            >
              <TitleWrap title="专业概况" nomore={true} />
              <View
                style={{
                  marginTop: CSS.pixel(30, true),
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    color: "#333",
                    fontSize: CSS.textSize(28),
                    lineHeight: CSS.pixel(50)
                  }}
                >
                  {this.state.majorDetail.major_desc}
                </Text>
              </View>
            </GestureRecognizer>

            {this.state.positions &&
              this.state.positions.length > 0 && (
                <GestureRecognizer
                  onSwipeRight={state => {
                    dismissLightBox();
                  }}
                  config={{
                    velocityThreshold: 0.3,
                    directionalOffsetThreshold: 80
                  }}
                  style={[
                    styles.chartBox,
                    { marginTop: CSS.pixel(0, true), backgroundColor: "#fff" }
                  ]}
                >
                  <TitleWrap title="就业方向" nomore={true} />
                  <View
                    style={{
                      marginTop: CSS.pixel(30, true),
                      justifyContent: "center"
                    }}
                  >
                    {this.state.positions.map((c, index, self) => {
                      return (
                        <View
                          key={c.id + ""}
                          style={{
                            marginBottom:
                              self.length >= 2 && self.length - 1 != index
                                ? CSS.pixel(30)
                                : 0
                          }}
                        >
                          <Text
                            style={{
                              color: "#333",
                              fontSize: CSS.textSize(36),
                              fontWeight: "600"
                            }}
                          >
                            {c.position_name}:
                          </Text>
                          <Text
                            style={{
                              color: "#333",
                              fontSize: CSS.textSize(28),
                              lineHeight: CSS.pixel(50)
                            }}
                          >
                            {c.position_desc}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </GestureRecognizer>
              )}

            <GestureRecognizer
              onSwipeRight={state => {
                dismissLightBox();
              }}
              config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80
              }}
              style={[
                styles.chartBox,
                {
                  marginTop: CSS.pixel(30, true),
                  marginBottom: CSS.pixel(30, true),
                  backgroundColor: "#fff"
                }
              ]}
            >
              <TitleWrap
                title="薪资增长趋势"
                nomore={true}
                style={{ marginBottom: CSS.pixel(30, true) }}
              />
              <View style={styles.chart}>
                {this.state.majorWorkYear.length > 0 ? (
                  <AreaChart
                    // height={CSS.pixel(600, true)}
                    toolTipFormat={d => `${d.y}元`}
                    yLabel="薪资单位：元"
                    xLabel="毕业年限"
                    data={this.state.majorWorkYear
                      .filter(item => item.work_year > 0)
                      .sort((w1, w2) => w1.work_year - w2.work_year)
                      .slice(0, 5)
                      .map(item => {
                        return {
                          x: item.work_year,
                          y: item.avg_salary
                        };
                      })}
                  />
                ) : null}
              </View>

              <View
                style={{
                  padding: 10,
                  marginTop: 20,
                  marginBottom: 10,
                  backgroundColor: "#eee",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#333", fontSize: 16 }}>-数据解读-</Text>
                <Text
                  style={{
                    color: "#999",
                    fontSize: 14,
                    lineHeight: CSS.pixel(41, true)
                  }}
                >
                  薪资为中位数，也就是处于最中间的样本的薪资，以保证结果不会受到极高或极低薪资的影响。
                </Text>
              </View>
            </GestureRecognizer>
          </ViewShot>
        </ScrollView>
        <SDHeader
          ref="_sdHeader"
          title={this.props.majorName + "专业数据报告"}
          fixed
          animate
        />
      </View>
    );
  }
}
export const DomainParseScreen = ConnectWithActions((state, props) => ({
  degreeName: getSchoolLevel(state, props)
}))(DomainParseScreenB);

// 就业公司分布
class CompanyParseScreenB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rank: {
        id: 1352,
        position_name: "产品经理",
        rank: 1352,
        person_num: 0,
        total: 22201,
        avg_salary: 15435
      },
      jobDetail: {
        // position_name: "java工程师",
        // job_desc: "j2ee spring hibernate",
        position_name: "",
        job_desc: ""
      },
      jobWorkYear: [],
      skill: [],
      isCapture: false
    };
  }

  static contextTypes = {
    refs: PropTypes.object.isRequired
  };

  componentDidMount() {
    Toast.loading("加载中", 0);
    this.context.refs['jobDetailDataParse'] = this;
    // 获取职位介绍
    this.props.actions.getPositionProfileAction({
      name: this.props.jobName,
      parent_id: ""
    }).then(res1 => {
      //console.warn("获取职位介绍", this.props.jobName, res1)
      if (res1.results.length) {
        this.setState({
          jobDetail: {
            job_desc: res1.results[0].description ? res1.results[0].description : "暂无数据"
          }
        });
      } else {
        this.setState({
          jobDetail: {
            job_desc: '暂无数据'
          }
        });
      }
    }).catch(err1 => {
      //console.warn("获取职位介绍err", err1)
    })

    this.props.actions.getJobWorkYearRangeAction(
      {
        position_name: this.props.jobName,
        degree: this.props.degreeName,
        address: "不限"
      },
      res => {
        schoolPersonNum = 0;
        res.slice(0, 5).map(c => {
          this.state.rank.person_num = this.state.rank.person_num + (c.person_num ? c.person_num : 0);
          schoolPersonNum = schoolPersonNum + (c.person_num ? c.person_num : 0);
        })
        this.setState({
          jobWorkYear: res
        });
      }
    );

    this.props.actions.getJobSkillChartAction(
      {
        position_name: this.props.jobName,
        degree: this.props.degreeName
      },
      res => {
        if (res.length > 0) {
          let skills = {};
          res[0].nodes.map((item, index) => {
            skills[item.name] = index;
          });
          let skillArr = [];
          let index = 1;
          for (let name in skills) {
            if (name == this.props.jobName) {
              continue;
            }
            skillArr.push({
              name: name,
              key: index++
            });
          }
          this.setState({
            skill: skillArr
          });
        }
      }
    );

    Toast.hide();
  }

  _onScrollView(e) {
    this.refs["_sdHeader"].onScrollHeaderBackground(
      e.nativeEvent.contentOffset.y
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          scrollEventThrottle={0.5}
          onScroll={this._onScrollView.bind(this)}
        >
          <ViewShot
            style={{ backgroundColor: "#f9f9f9" }}
            ref={viewshot => (this.context.refs["_jobShot"] = viewshot)}
          >
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
                  bottom: CSS.pixel(68, true),
                  left: CSS.pixel(30)
                }}
              >
                <Text
                  style={{
                    color: "#333",
                    fontSize: CSS.textSize(26),
                    paddingRight: CSS.pixel(60),
                    lineHeight: CSS.pixel(34)
                  }}
                >
                  本报告收集了
                  <Text style={{ color: "#333", fontWeight: "900" }}>
                    {this.state.rank.person_num}
                  </Text>
                  个毕业5年内从事
                  <Text style={{ color: "#333", fontWeight: "900" }}>
                    {this.props.jobName}
                  </Text>
                  的就业案例，为你全面解析该职位就业情况
                </Text>
              </View>
              {
                this.state.isCapture && <View style={{position:'absolute', left: 0, right: 0, top: headerPadding + 13}}>
                  <Text numberOfLines={1} style={{textAlign: 'center', color: "#333", fontSize: CSS.textSize(36)}}>
                    {this.props.title
                      ? this.props.title
                      : this.props.jobName + "职位就业数据报告"}
                  </Text>
                </View>
              }
            </View>
              <GestureRecognizer
                onSwipeRight={state => {
                  dismissLightBox();
                }}
                config={{
                  velocityThreshold: 0.3,
                  directionalOffsetThreshold: 80
                }}
                style={[
                  styles.chartBox,
                  { marginTop: CSS.pixel(30, true), backgroundColor: "#fff" }
                ]}
              >
                <TitleWrap title="职位介绍" nomore={true} />
                <View
                  style={{
                    marginTop: CSS.pixel(30, true),
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      color: "#333",
                      fontSize: CSS.textSize(28),
                      lineHeight: CSS.pixel(50)
                    }}
                  >
                    {this.state.jobDetail.job_desc}
                    </Text>
                </View>
              </GestureRecognizer>

            <GestureRecognizer
              onSwipeRight={state => {
                dismissLightBox();
              }}
              config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80
              }}
              style={[
                styles.chartBox,
                { marginTop: CSS.pixel(30, true), backgroundColor: "#fff" }
              ]}
            >
              <TitleWrap
                title="技能图谱"
                nomore={true}
                style={{ marginBottom: CSS.pixel(30, true) }}
              />
              <View style={styles.chart}>
                {this.state.skill.length > 0 ? (
                  <ForceMap
                    // height={CSS.pixel(600, true)}
                    height={CSS.pixel(600)}
                    data={{
                      goal: this.props.jobName,
                      skill: this.state.skill
                    }}
                  />
                ) : null}
              </View>
            </GestureRecognizer>

            <GestureRecognizer
              onSwipeRight={state => {
                dismissLightBox();
              }}
              config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80
              }}
              style={[
                styles.chartBox,
                {
                  marginTop: CSS.pixel(30, true),
                  marginBottom: CSS.pixel(30, true),
                  backgroundColor: "#fff"
                }
              ]}
            >
              <TitleWrap
                title="工作年限-薪资增长趋势"
                nomore={true}
                style={{ marginBottom: CSS.pixel(30, true) }}
              />
              <View style={styles.chart}>
                {this.state.jobWorkYear.length > 0 ? (
                  <AreaChart
                    yLabel="薪资单位：元"
                    xLabel="工作年限"
                    toolTipFormat={d => `${d.y}元`}
                    data={this.state.jobWorkYear
                      .slice(0, 5)
                      .map((item, index) => {
                        return {
                          x: index + 1, //item.work_year_range,
                          y: item.avg_salary
                        };
                      })}
                  />
                ) : null}
              </View>
              <View
                style={{
                  padding: 10,
                  marginTop: 20,
                  marginBottom: 10,
                  backgroundColor: "#eee",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#333", fontSize: 16 }}>-数据解读-</Text>
                <Text
                  style={{
                    color: "#999",
                    fontSize: 14,
                    lineHeight: CSS.pixel(41, true)
                  }}
                >
                  薪资为中位数，也就是处于最中间的样本的薪资，以保证结果不会受到极高或极低薪资的影响。
                </Text>
              </View>
            </GestureRecognizer>
          </ViewShot>
        </ScrollView>
        <SDHeader
          ref="_sdHeader"
          title={
            this.props.title
              ? this.props.title
              : this.props.jobName + "职位就业数据报告"
          }
          fixed
          animate
        />
      </View>
    );
  }
}
export const CompanyParseScreen = ConnectWithActions((state, props) => ({
  degreeName: getSchoolLevel(state, props)
}))(CompanyParseScreenB);

// 深造情况分布
class FurtherStudyParseScreenB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rank: {
        person_num: 0
      },
      industryDetail: {
        industry_desc: "暂无数据"
        // "以现代新兴的互联网技术为基础，专门从事网络资源搜集和互联网信息技术的研究、开发、利用、生产、贮存、传递和营销信息商品，是现阶段国民经济结构的基本组成部分。"
      },
      industryWorkYear: [],
      loadingChart: true,
      isCapture: false
    };
  }

  static contextTypes = {
    refs: PropTypes.object.isRequired
  };

  componentDidMount() {
    Toast.loading("加载中", 0);
    this.context.refs['industryDetailDataParse'] = this;
    this.props.actions.getNewIndustryDetailAction(
      {
        id: this.props.industryId
      }
    ).then(res => {
      if(res.status == 'ok') {
        this.setState({
          industryDetail: {
            industry_desc: res.results.description || "暂无数据"
          }
        })
      }
    }).catch(err => {

    });
    this.setState({
      loadingChart: true
    });
    this.props.actions.getIndustryWorkYearAction(
      {
        industry: this.props.industryName,
        // degree: this.props.degreeName,
        degree: "不限",
        sort: "avg_salary"
      },
      res => {
        schoolPersonNum = 0;
        res.slice(0, 5).map(c => {
          this.state.rank.person_num = this.state.rank.person_num + (c.person_num ? c.person_num : 0);
          schoolPersonNum = schoolPersonNum + (c.person_num ? c.person_num : 0);
        })
        if (res.length > 0) {
          this.setState({
            industryWorkYear: res,
            loadingChart: false
          });
        }

      }
    );

    Toast.hide();
  }

  _onScrollView(e) {
    this.refs["_sdHeader"].onScrollHeaderBackground(
      e.nativeEvent.contentOffset.y
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          scrollEventThrottle={0.5}
          onScroll={this._onScrollView.bind(this)}
        >
          <ViewShot
            style={{ backgroundColor: "#f9f9f9" }}
            ref={viewshot => (this.context.refs["_industryShot"] = viewshot)}
          >
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

              {/* <View
                style={{
                  position: "absolute",
                  bottom: CSS.pixel(133, true),
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
                  {this.props.industryName}
                  就业数据报告
                </Text>
              </View> */}

              <View
                style={{
                  position: "absolute",
                  bottom: CSS.pixel(68, true),
                  left: CSS.pixel(30)
                }}
              >
                <Text
                  style={{
                    color: "#333",
                    fontSize: CSS.textSize(26),
                    paddingRight: CSS.pixel(60),
                    lineHeight: CSS.pixel(34)
                  }}
                >
                  本报告收集了
                  <Text style={{ color: "#333", fontWeight: "900" }}>
                    {this.state.rank.person_num}
                  </Text>
                  个毕业5年内从事
                  <Text style={{ color: "#333", fontWeight: "900" }}>
                    {this.props.industryName}
                  </Text>
                  行业的就业案例，为你全面解析该行业就业情况
                </Text>
              </View>
              {
                this.state.isCapture && <View style={{position:'absolute', left: 0, right: 0, top: headerPadding + 13}}>
                  <Text numberOfLines={1} style={{textAlign: 'center', color: "#333", fontSize: CSS.textSize(36)}}>
                    {this.props.industryName + "行业就业数据报告"}
                  </Text>
                </View>
              }
            </View>

            <GestureRecognizer
              onSwipeRight={state => {
                dismissLightBox();
              }}
              config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80
              }}
              style={[
                styles.chartBox,
                { marginTop: CSS.pixel(30, true), backgroundColor: "#fff" }
              ]}
            >
              <TitleWrap
                title="行业介绍"
                nomore={true}
                style={{ marginBottom: CSS.pixel(30, true) }}
              />
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={{
                    color: "#333",
                    fontSize: CSS.textSize(28),
                    lineHeight: CSS.pixel(50)
                  }}
                >
                  {this.state.industryDetail.industry_desc}
                </Text>
              </View>
            </GestureRecognizer>
            <GestureRecognizer
              onSwipeRight={state => {
                dismissLightBox();
              }}
              config={{
                velocityThreshold: 0.3,
                directionalOffsetThreshold: 80
              }}
              style={[
                styles.chartBox,
                { marginTop: CSS.pixel(30, true), backgroundColor: "#fff" }
              ]}
            >
              <TitleWrap
                title="工作年限-薪资增长趋势"
                nomore={true}
                style={{ marginBottom: CSS.pixel(30, true) }}
              />
              <View style={[styles.chart]}>
                {<AreaChart
                  nodata={this.state.industryWorkYear.length===0}
                  yLabel="薪资单位：元"
                  xLabel="毕业年限"
                  loading={this.state.loadingChart}
                  toolTipFormat={d => `${d.y}元`}
                  // nodata={this.state.industryWorkYear.length===0}
                  // data={this.state.industryWorkYear.filter(item => item.work_year>0).sort((w1,w2) => w1.work_year-w2.work_year).slice(0, 5).map((item, index) => {
                  data={this.state.industryWorkYear
                    .slice(0, 5)
                    .map((item, index) => {
                      return {
                        x: index + 1, // item.work_year_range,
                        y: item.avg_salary,
                        key: index + ""
                      };
                    })}
                />}
              </View>
              {/* {this.state.industryWorkYear.length > 0 ? (
            <AreaChart
              loading={this.state.loadingChart}
              style={{height:180}}
              height={180}
              data={this.state.industryWorkYear.map((item, index) => {
                return {
                  x: item.work_year_range,
                  y: item.avg_salary
                };
              })}
            />
          ) : null} */}

              <View
                style={{
                  padding: 10,
                  marginTop: 20,
                  marginBottom: 10,
                  backgroundColor: "#eee",
                  alignItems: "center"
                }}
              >
                <Text style={{ color: "#333", fontSize: 16 }}>-数据解读-</Text>
                <Text
                  style={{
                    color: "#999",
                    fontSize: 14,
                    lineHeight: CSS.pixel(41, true)
                  }}
                >
                  薪资为中位数，也就是处于最中间的样本的薪资，以保证结果不会受到极高或极低薪资的影响。
                </Text>
              </View>
            </GestureRecognizer>
          </ViewShot>
        </ScrollView>
        <SDHeader
          ref="_sdHeader"
          title={this.props.industryName + "行业就业数据报告"}
          fixed
          animate
        />
      </View>
    );
  }
}

export const FurtherStudyParseScreen = ConnectWithActions((state, props) => ({
  degreeName: getSchoolLevel(state, props)
}))(FurtherStudyParseScreenB);

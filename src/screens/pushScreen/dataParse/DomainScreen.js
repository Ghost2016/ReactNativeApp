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
import TitleWrap from "../../../sd_employmentinfo/titlelistwarp/TitleWrap";
import PropTypes from "prop-types";
import { getMajor, getSchoolLevel } from "../../../directSelectors";
import ConnectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import SlicedPieChart from "../../../sd_charts/SlicedPieChart/SlicedPieChart";
const wIs320 = Dimensions.get("window").width <= 320;
import { Toast } from "antd-mobile";
import { SDMainColor } from "../../../styles";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
  }
});

// 就业领域分布
class DomainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      industryChart: [],
      jobChart: [],
      jobDetail: ''
    };

  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.props.actions.getMajorIndustryAction(
      {
        major: this.props.majorName,
        page_size: 5,
        sort: "-person_num",
        degree: this.props.degreeName
      },
      res => {
        if (res.length > 0) {
          this.setState({
            industryChart: res
          });
        }
      }
    );

    this.props.actions.getMajorPositionAction(
      {
        major: this.props.majorName,
        page_size: 5,
        sort: "-person_num",
        degree: this.props.degreeName
      },
      res => {
        if (res.length > 0) {
          this.setState({
            jobChart: res
          });
          // 获取职位介绍
          this.props.actions.getPositionProfileAction({
            name: res[0].position_name
          }).then(res1 => {
            if (res1.results.length) {
              this.setState({
                jobDetail: res1.results[0].description
              });
            } else {
              this.setState({
                jobDetail: '暂无数据'
              });
            }
          }).catch(err1 => {

          })
        }
      }
    );

    Toast.hide();
  }
  render() {
    return (
      <ScrollView style={[styles.container]}>
        <View
          style={{
            height: CSS.pixel(311, true),
            backgroundColor:'#fff'
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
              left: CSS.pixel(30)
            }}
          >
            <Text
              style={{
                color: "#333",
                fontSize: CSS.textSize(28),
                paddingRight: CSS.pixel(60),
                lineHeight: CSS.pixel(40)
              }}
            >
              本报告收集了
              <Text style={{ color: "#333", fontWeight: "900" }}>
                {this.props.allMajorNum}
              </Text>
              个全国范围毕业5年内的
              <Text style={{ color: "#333", fontWeight: "900" }}>{this.props.majorName}专业,{this.props.degreeName}</Text>
              学历学生第一份工作数据，为你全面解析本专业就业情况
            </Text>
          </View>
        </View>

        <View
          style={{
            height: CSS.pixel(450),
            padding: CSS.pixel(30),
            paddingTop: CSS.pixel(50),
            backgroundColor: "#fff"
          }}
        >
          <TitleWrap title="就业行业分布" nomore={true} />
          <View style={{
              flex: 1,
              marginLeft: CSS.pixel(-30)
            }}>
            {this.state.industryChart.length > 0 ? (
              <SlicedPieChart
              style={{backgroundColor:'red'}}
                height={CSS.pixel(340)}
                data={this.state.industryChart.map(item => {
                  return {
                    x: item.industry,
                    // y: item.person_num,
                    y: item.ratio
                  };
                }).concat({
                  x: '其他',
                  y: 1 - (this.state.industryChart.reduce((all,d) => {
                    return all + d.ratio
                  }, 0))
                })}
              />
            ) : null}
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: CSS.pixel(30),
            paddingVertical: CSS.pixel(30, true),
            borderTopColor: "#efefef",
            borderTopWidth: 1,
            backgroundColor: "#fff",
            flex: 1
          }}
        >
          <View style={{ flex: 1, flexDirection: "row"}}>
            <View style={{ backgroundColor: SDMainColor , paddingHorizontal: CSS.pixel(10)}}>
              <Text style={{ color: "#333", fontSize: CSS.textSize(28) }}>
                {this.state.industryChart.length > 0
                  ? // ? this.state.industryChart[0].major +
                    this.state.industryChart[0].industry +
                    " " +
                    (
                      parseFloat(this.state.industryChart[0].ratio) * 100
                    ).toFixed(2) +
                    "%"
                  : null}
              </Text>
            </View>
            <View style={{ flex: 1 }} />
          </View>
          <Text
            style={{
              color: "#999",
              fontSize: CSS.textSize(24),
              marginTop: CSS.pixel(24, true),
              marginBottom: CSS.pixel(14, true)
            }}
          >
            具体职位:
          </Text>
          <Text style={{ color: "#333", fontSize: CSS.textSize(28) }}>
            {/* {this.state.industryChart.length > 0
              ? this.state.industryChart[0].industry
              : null} */}
            {this.state.jobChart.length > 0
              ? this.state.jobChart
                  .map(c => {
                    return c.position_name;
                  })
                  .join("/")
              : null}
          </Text>
        </View>

        <View
          style={{
            height: CSS.pixel(430),
            padding: CSS.pixel(30),
            marginTop: CSS.pixel(30),
            backgroundColor: "#fff"
          }}
        >
          <TitleWrap
            title="就业职位分布"
            nomore={true}
          />
          <View style={{ flex: 1, marginLeft: CSS.pixel(-30) }}>
            {this.state.jobChart.length > 0 ? (
              <SlicedPieChart
                height={CSS.pixel(340)}
                data={this.state.jobChart.map(item => {
                  return {
                    x: item.position_name,
                    // y: item.person_num,
                    y: item.ratio
                  };
                }).concat({
                  x: '其他',
                  y: 1 - (this.state.jobChart.reduce((all,d) => {
                    return all + d.ratio
                  }, 0))
                })}
              />
            ) : null}
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: CSS.pixel(30),
            paddingVertical: CSS.pixel(30, true),
            borderTopColor: "#efefef",
            borderTopWidth: 1,
            backgroundColor: "#fff"
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ backgroundColor: SDMainColor, paddingHorizontal: CSS.pixel(10)}}>
              <Text style={{ color: "#333", fontSize: CSS.textSize(28) }}>
                {this.state.jobChart.length > 0
                  ? this.state.jobChart[0].position_name +
                    " " +
                    (parseFloat(this.state.jobChart[0].ratio) * 100).toFixed(
                      2
                    ) +
                    "%"
                  : null}
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: "#999",
              fontSize: CSS.textSize(24),
              marginTop: CSS.pixel(24, true),
              marginBottom: CSS.pixel(14, true)
            }}
          >
            职位介绍:
          </Text>
          <Text
            style={{
              color: "#333",
              lineHeight: CSS.pixel(44, true),
              fontSize: CSS.textSize(28)
            }}
          >
            {this.state.jobDetail}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: CSS.pixel(30),
            paddingVertical: CSS.pixel(60, true),
            marginTop: CSS.pixel(30),
            backgroundColor: "#fff"
          }}
        >
          <View
            style={{
              padding: CSS.pixel(30),
              backgroundColor: "#eee",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#333", fontSize: 16 }}>-数据解读-</Text>
            <Text
              style={{
                color: "#666",
                fontSize: 14,
                lineHeight: CSS.pixel(41, true),
                marginTop: CSS.pixel(20)
              }}
            >
              就业行业分布的具体职位，取值为该行业下人数最多的前5个职位。
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  majorName: getMajor(state, props),
  degreeName: getSchoolLevel(state, props)
}))(DomainScreen);

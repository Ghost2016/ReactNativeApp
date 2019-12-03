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
import {
  SalaryDataParseTextC,
  DomainDataParseTextC,
  CompanyDataParseTextC,
  FurtherStudyParseTextC
} from "../../../sd_employdataparse/EmployDataParseText";
import ConnectWithActions from "../../../connectWithActions";
import CompanyTable from "../../../sd_companytable/CompanyTable";
import { CSS } from "../../../common/SDCSS";
import { getMajor, getSchoolLevel } from "../../../directSelectors";
const wIs320 = Dimensions.get("window").width <= 320;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 就业公司分布
class CompanyScreen extends React.Component {
  constructor(props) {
    super(props);

  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  render() {
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            height: CSS.pixel(311, true)
          }}
        >
          <Image
            source={require("@img/home/home_data_seach_bg.png")}
            resizeMode="cover"
            style={{ position: "absolute", left: 0, right: 0, width: '100%', height: CSS.pixel(311, true), top: 0 }}
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
              本报告收集了<Text style={{ color: "#333", fontWeight: "900" }}>{this.props.allMajorNum}</Text>个全国范围毕业5年内的<Text style={{ color: "#333", fontWeight: "900" }}>{this.props.majorName}专业,{this.props.degreeName}</Text>学历学生第一份工作数据，为你全面解析本专业就业情况
              </Text>
          </View>
        </View>

        <View style={{ padding: CSS.pixel(30), paddingTop: CSS.pixel(60)}}>
          <CompanyTable />
        </View>

        <View
          style={{
            padding: CSS.pixel(30),
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
            <View style={{flex: 1}}>
            <Text style={{textAlign: 'left', color: "#666", fontSize: 14, lineHeight: CSS.pixel(41, true), marginTop: CSS.pixel(20)}}>
              1.选择占比为样本数据选择公司的比例。
            </Text>
            <Text style={{ color: "#666", fontSize: 14, lineHeight: CSS.pixel(41, true), marginTop: CSS.pixel(20)}}>
              2.薪资为中位数，也就是处于最中间的样本的薪资，以保证结果不会受到极高或极低薪资的影响。
            </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  majorName: getMajor(state, props),
  degreeName: getSchoolLevel(state, props),
}))(CompanyScreen);

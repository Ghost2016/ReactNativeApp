/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  Image
} from "react-native";
import PropTypes from "prop-types";
import TitleWrap from "./titlelistwarp/TitleWrap";
import CardGroup from "./cardgroup/CardGroup";
import ConnectWithActions from "../connectWithActions";
import { getSchoolName, getMajor } from "../directSelectors";
import { navScreen, navRightButton } from "@styles";
import { CSS } from "../common/SDCSS";
import SDTouchOpacity from "../common/SDTouchOpacity";
import { SDMainColor } from "../styles";
import SearchSMIP from "@sd_components/SearchSMIP"

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingLeft: CSS.pixel(30),
    paddingRight: CSS.pixel(30),
    paddingBottom: CSS.pixel(30, true),
    paddingTop: CSS.pixel(30, true),
    alignItems: "center",
    marginTop: CSS.pixel(30, true),
    marginBottom: CSS.pixel(30, true)
  },
  title: {
    marginTop: CSS.pixel(40, true),
    marginBottom: CSS.pixel(30, true),
    fontSize: 16,
    color: "#666"
  }
});

class EmploymentInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  componentDidMount() {}
  onPressMore() {
    // this.goToScreen("example.DataQueryScreen");
    //this.context.navigator.push(navScreen("DataQueryScreen", "数据查询"));
    //return
    this.context.navigator.push(
      navScreen("PushScreen", "数据查询", {
        passProps: {
          screen: () => <SearchSMIP />,
          fullScreen: true,
          noScrollView: true,
          header: {
            title: "数据查询",
            //fixed: true,
          }
        },
        //...navRightButton("save_addLearnedCourseBtn", "保存"),
        ...navRightButton("dataQueryScreenBtn", () => (<Image source={require("@img/rank/rank_ico_search.png")}/>))
      })
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TitleWrap title="毕业流向数据解析" nomore={true}/>
        {/* <Text style={styles.title}>{this.props.schoolName + "╱" + this.props.majorName}专业</Text> */}
        <CardGroup />
        {/* <View
          style={{
            marginTop: CSS.pixel(30, true)
          }}
        >
          <SDTouchOpacity
            style={{
              backgroundColor: SDMainColor,
              width: CSS.pixel(230),
              height: 30,
              justifyContent: "center",
              alignItems: "center",
              flexDirection:'row'
            }}
            onPress={this.onPressMore.bind(this)}
          >
            <Text style={{ color: "#333", fontSize: CSS.textSize(28)}}>
              查询更多
            </Text>
            <Image
              style={{ marginLeft: CSS.pixel(22) }}
              source={require("@img/home/home_ico_more.png")}
            />
          </SDTouchOpacity>
        </View> */}
      </View>

    );
  }
}

export default ConnectWithActions((state, props) => ({
  schoolName: getSchoolName(state, props),
  majorName: getMajor(state, props)
}))(EmploymentInfo);

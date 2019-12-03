/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Platform,
  ScrollView,
  Alert,
  View,
  Text
  //Button,
} from "react-native";
import ConnectWithActions from "@src/connectWithActions";
//import { List } from "../common/index";
import store from "@boot/store";
//import { morningPunchTypeAction, morningPunchListAction } from "@boot/actions";
//import { getMorningTaskList } from "@src/selectors";
import * as navHelper from "@utils/navigationHelper";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import IntlText from "@sd_components/IntlText";
import SDRow from "@sd_components/SDRow";
import SDBox from "@sd_components/SDBox";
import SDButton from "@sd_components/SDButton";
import SDImage from "@sd_components/SDImage";
import SDLoading from "@sd_components/SDLoading";
import DotSelect from "@sd_components/DotSelect";
import { getDateObj } from "@utils/funcs";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const styles2 = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: width * 0.8,
    height: height * 0.8
  }
});

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width - 20,
    height: Dimensions.get("window").height * 0.5,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    paddingTop: 10,

    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowColor: "#999",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  }
});

const iconPowerUp = require("@img/grow/growing_ico_score.png");

// 成长 - 每日打卡列表
class GrowCheckinList extends React.PureComponent {
  static contextTypes = {
    refs: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }

  state = {
    loading: true,
    showPunchResult: false,
    punchResult: {
      sign: "+",
      number: 0.5
    }, //'',
    fadeAnim: new Animated.Value(0.1)
  };

  componentDidMount() {}

  renderRow(_row, s, index) {
    //console.log("row", row, s, index);
    const row = _row.item;
    return (
      <SDRow
        key={row.id}
        title={row.title}
        caption={row.caption}
        subtitle=""
        styleName="dev sm-gutter"
        onPress={() => {}}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: sdStyles.SDHelperColorline
        }}
        rightIcon={
          row.isCheck ? (
            <SDButton
              style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                borderColor: sdStyles.SDBGColorOrange,
                borderRadius: 0,
                width: CSS.pixel(250),
                zIndex: 3,
                flexDirection: "row",
                justifyContent: "flex-end"
              }}
              btnStyle={{
                fontSize: CSS.pixel(30),
                color: sdStyles.SDBGColorOrange
              }}
              title={() => {
                return (
                  <DotSelect
                    title="已打卡"
                    isSelect={true}
                    data={row}
                    index={0}
                    circleBorder={0}
                    onPress={() => {}}
                    selectColor={sdStyles.SDBGColorOrange}
                    txtStyle={{
                      fontSize: CSS.pixel(30),
                      position: "relative",
                      left: CSS.pixel(-10)
                    }}
                    isSmall={true}
                    style={{ alignSelf: "flex-start" }}
                  />
                );
              }}
            />
          ) : (
            <SDButton
              style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                borderColor: sdStyles.SDBGColorOrange,
                borderRadius: 0,
                width: CSS.pixel(250),
                zIndex: 3,
                flexDirection: "row",
                justifyContent: "flex-end"
              }}
              btnStyle={{
                fontSize: 18,
                color: sdStyles.SDBGColorOrange
              }}
              onPress={() => {}}
              title={() => {
                return (
                  <DotSelect
                    title="未打卡"
                    reverseTitle="已打卡"
                    isSelect={false}
                    data={row}
                    index={0}
                    circleBorder={0}
                    onPress={this.onPressCheckin.bind(this)}
                    selectColor={sdStyles.SDBGColorOrange}
                    txtStyle={{
                      fontSize: CSS.pixel(30),
                      position: "relative",
                      left: CSS.pixel(-10)
                    }}
                    isSmall={true}
                    style={{ alignSelf: "flex-start" }}
                  />
                );
              }}
            />
          )
        }
      />
    );
  }

  render() {
    const { fadeAnim } = this.state;
    const { checkinData } = this.props;
    return (
      <View>
        <View
          style={{
            position: "relative",
            top: 0,
            left: 0,
            zIndex: 2
          }}
        >
          <FlatList
              keyExtractor={item => item.id + ""}
              data={checkinData}
              renderItem={this.renderRow.bind(this)}
              >
              </FlatList>
        </View>
        {this.state.showPunchResult ? (
          <Animated.View
            style={{
              opacity: fadeAnim,
              width: CSS.pixel(300),
              height: CSS.pixel(262),
              justifyContent: "center",
              alignSelf: "center",
              position: "absolute",
              top: CSS.pixel(100, true),
              left: CSS.pixel(160),
              zIndex: 6
            }}
          >
            <SDImage
              source={iconPowerUp}
              style={{
                width: CSS.pixel(300),
                height: CSS.pixel(262),
                justifyContent: "center",
                alignSelf: "center"
                //position: 'absolute',
                //top: CSS.pixel(100, true),
                //left: CSS.pixel(160),
              }}
              imgStyle={{
                width: CSS.pixel(300),
                height: CSS.pixel(262)
              }}
              alt={() => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      position: "relative",
                      top: CSS.pixel(-140),
                      left: CSS.pixel(114)
                    }}
                  >
                    <Text
                      style={{
                        fontSize: CSS.pixel(40),
                        color: "#fff"
                      }}
                    >
                      +
                    </Text>
                    <Text
                      style={{
                        fontSize: CSS.pixel(40),
                        color: "#fff"
                      }}
                    >
                      0.5分
                    </Text>
                  </View>
                );
              }}
            />
          </Animated.View>
        ) : null}
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //user: getUserBaseInfo(state),
  //location: state.location,
  //lightBox: state.lightBox,
  //getMorningTaskList: getMorningTaskList(state)
}))(GrowCheckinList);

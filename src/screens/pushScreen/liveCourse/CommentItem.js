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
import connectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import SDUpPullScrollView, {
  RefreshState
} from "../../../common/SDUpPullScrollView";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navScreen } from "../../../styles";
import LiveCourseDetailScreen from "./LiveCourseDetailScreen";

// 职么课堂-评论消息
export default class CommentMsgItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNeedShowMore: false,
      isShowMore: false,

      widthOffset: 0,
      isSplited: false,

      numFilter: 0,

      wordSpace: Platform.OS == 'ios' ? 30 : 29
    };
  }
  render() {
    if(!this.props.msg) {
      return null;
    }
    if (this.state.isSplited) {
      return (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            position: "relative"
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Text
                      key={""}
                      style={{
                        color: "#333",
                        fontSize: CSS.pixel(28),
                        lineHeight: CSS.pixel(40),
                      }}
                    >
                      {this.props.msg.slice(0, this.state.numFilter)}
                    </Text>
                  {/* )
                );
              })} */}
            {(this.state.isNeedShowMore && !this.state.isShowMore) && (
              <Text
                style={{
                  color: "#333",
                  fontSize: CSS.pixel(28),
                  lineHeight: CSS.pixel(40),
                  textAlignVertical: "bottom"
                }}
              >
                ...
              </Text>
            )}
          </View>

          {this.state.isNeedShowMore ? (
            !this.state.isShowMore ? (
              <SDTouchOpacity
                style={{
                  position: "absolute",
                  // width: CSS.pixel(),
                  right: Platform.OS == 'android' ? 0 : CSS.pixel(20),
                  bottom: 0
                }}
                onPress={() => {
                  this.setState({
                    isShowMore: true,
                    numFilter: this.props.msg.split("").length
                  });
                }}
              >
                <Text
                  style={{
                    color: SDMainColor,
                    fontSize:  CSS.pixel(28),
                    lineHeight: CSS.pixel(40)
                  }}
                >
                  更多
                </Text>
              </SDTouchOpacity>
            ) : (
              <SDTouchOpacity
                style={{
                  position: "absolute",
                  right: Platform.OS == 'android' ? 0 : CSS.pixel(20),
                  bottom: 0
                }}
                onPress={() => {
                  this.setState({
                    isShowMore: false,
                    numFilter:
                      parseInt(this.state.widthOffset / CSS.textSize(this.state.wordSpace)) * 3
                  });
                }}
              >
                <Text
                  style={{
                    color: SDMainColor,
                    fontSize: CSS.textSize(28),
                    lineHeight: CSS.pixel(40)
                  }}
                >
                  收起
                </Text>
              </SDTouchOpacity>
            )
          ) : null}
        </View>
      );
    }
    return (
      <View
        style={{ width: "100%", height: 4 }}
        onLayout={e => {
          this.setState({
            isSplited: true,
            isNeedShowMore:
              this.props.msg.split("").length >
              parseInt(e.nativeEvent.layout.width / CSS.textSize(this.state.wordSpace)) * 3,
            widthOffset: e.nativeEvent.layout.width,
            numFilter:
              parseInt(e.nativeEvent.layout.width / CSS.textSize(this.state.wordSpace)) * 3
          });
        }}
      />
    );
  }
}

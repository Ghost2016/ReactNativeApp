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
import defaultStyle, { SDMainColor } from "../styles";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    // alignItems: "center",
    // justifyContent: "space-between",
    // backgroundColor: 'red'
  },
  footerBox: {
    backgroundColor: "#f6f6f6",
    padding: 10,
    marginTop: 10
  }
});

type Props = {
  startTime: string,
  endTime: string,
  subInfo: string | Function | React.Element,
  footer: ?string | ?Function | ?React.Element,
  dotColor: ?string,
  isLast: ?boolean
};

export default class TimeLine extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      dotOpacity: new Animated.Value(0.4)
    };
  }

  componentDidMount() {
    this.startShowOpacity();
  }

  startShowOpacity() {
    Animated.timing(this.state.dotOpacity, {
      toValue: 0.8,
      duration: 500
    }).start(() => this.startHideOpacity());
  }
  startHideOpacity() {
    Animated.timing(this.state.dotOpacity, {
      toValue: 0.4,
      duration: 500
    }).start(() => this.startShowOpacity());
  }

  render() {
    //   debugger;
    return (
      <View style={styles.container}>
        <View style={[defaultStyle.flexRow, { alignItems: "center" }]}>
          <Animated.View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              borderColor: this.props.dotColor
                ? this.props.dotColor
                : SDMainColor,
              opacity: this.state.dotOpacity
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: this.props.dotColor
                  ? this.props.dotColor
                  : SDMainColor
              }}
            />
          </Animated.View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 4
            }}
          >
            <Text style={{ color: "#333", fontSize: 14 }}>
              {this.props.startTime}
            </Text>
            <Text style={{ color: "#333", fontSize: 14 }}>-</Text>
            <Text style={{ color: "#333", fontSize: 14 }}>
              {this.props.endTime}
            </Text>
            {this.props.status && this.props.status == 'ok' ? <Image style={{marginLeft: CSS.pixel(5)}} source={require("@img/mine_Resume_Authentication1.png")}/> : null}
          </View>
        </View>

        <View
          style={{
            borderLeftColor: "#f1f1f1",
            borderLeftWidth: 1,
            paddingHorizontal: 10,
            paddingTop: 10,
            marginLeft: 6,
            paddingBottom: this.props.isLast ? 0 : 20
          }}
        >
          <View>
            {typeof this.props.subTitle === "string" ? 
              <View style={{marginBottom: CSS.pixel(20)}}>
                <Text style={{color: '#333'}}>{this.props.subTitle}</Text>
              </View> : null
            }
          </View>

          <View>
            {typeof this.props.subInfo === "string" ? (
              this.props.subInfoMark ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "between",
                    alignItems: "center"
                  }}
                >
                  <Text style={{color: '#333'}}>{this.props.subInfo}</Text>
                  <Text>{this.props.subInfoMark}</Text>
                </View>
              ) : (
                <Text style={{color: '#333'}}>{this.props.subInfo}</Text>
              )
            ) : this.props.subInfo instanceof Function ? (
              this.props.subInfo()
            ) : typeof this.props.subInfo === "object" ? (
              this.props.subInfo
            ) : null}
          </View>

          {typeof this.props.footer === "string" ? (
            <View style={styles.footerBox}>
              <Text style={{ color: "#666", fontSize: CSS.textSize(22) }}>
                {this.props.footer}
              </Text>
            </View>
          ) : this.props.footer instanceof Function ? (
            <View>{this.props.footer()}</View>
          ) : typeof this.props.footer === "object" ? (
            <View>{this.props.footer}</View>
          ) : null}
        </View>
      </View>
    );
  }
}

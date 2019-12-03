/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Animated, Image } from "react-native";
import SDHeader from "./SDHeader";
import { CSS } from "./SDCSS";
import SDTouchOpacity from "./SDTouchOpacity";

class SDAnimateScreen extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      warpAnimated: new Animated.Value(0),
      oldTitle: new Animated.Value(1),
      oldTitleDisplay: 'none',
      newTitle: new Animated.Value(0),


    };
  }

  static contextTypes = {
    navigator: () => null
  }

  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.state.oldTitle, {
        duration: 300,
        toValue: 0
      }),
      Animated.timing(this.state.newTitle, {
        duration: 300,
        toValue: 1
      })
    ]).start(() => {
      this.setState({
        oldTitleDisplay: 'none'
      })
    });
  }

  onPressClose() {
    this.setState({
      oldTitleDisplay: 'flex'
    }, () => {
      Animated.parallel([
        Animated.timing(this.state.oldTitle, {
          duration: 300,
          toValue: 1
        }),
        Animated.timing(this.state.newTitle, {
          duration: 300,
          toValue: 0
        })
      ]).start(() => {
        this.context.navigator.pop({
          animated: false
        })
      });
    })
    
  }

  render() {
    return (
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'transparent'
        }}
      >
        <SDHeader
          custom={() => {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: CSS.pixel(30),
                  backgroundColor: 'red',
                }}
              >
                <SDTouchOpacity onPress={this.onPressClose.bind(this)} style={{ width: 60, justifyContent: "center" }}>
                  <Image source={require("@img/salary/home_Salary_back.png")} />
                </SDTouchOpacity>
                <Animated.View
                  style={{
                    opacity: this.state.oldTitle,
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    display: this.state.oldTitleDisplay
                  }}
                >
                  <Text style={{ fontSize: CSS.textSize(36), color: "#333" }}>
                    开门指路
                  </Text>
                </Animated.View>
                <Animated.View
                  style={{
                    opacity: this.state.newTitle,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={{ fontSize: CSS.textSize(36), color: "#333" }}>
                    {this.props.title}
                  </Text>
                </Animated.View>
                <View style={{ width: 60, justifyContent: "center" }} />
              </View>
            );
          }}
          title={this.props.title}
        />
        <Animated.View style={{flex: 1}}>

        </Animated.View>
      </Animated.View>
    );
  }
}
export default SDAnimateScreen;

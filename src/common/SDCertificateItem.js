/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { CSS } from "@common/SDCSS";

class SDCertificateItem extends PureComponent<Props> {
  static contextTypes = {
    styles: () => null
  };

  static defaultProps = {
    score: "0",
    time: "",
    title: ""
  };
  render() {
    return (
      <View style={{paddingHorizontal: CSS.pixel(30), marginTop: this.props.num == 0 ? CSS.pixel(30) : 0, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            height: CSS.pixel(175),
            marginBottom: CSS.pixel(30),
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.2,
            shadowRadius: CSS.pixel(10),
            borderRadius: CSS.pixel(10),
            backgroundColor: "#fff",
            shadowColor: "#999",
            //注意：这一句是可以让安卓拥有灰色阴影
            elevation: 1,
            flexDirection: "row",
            paddingHorizontal: CSS.pixel(8)
          }}
        >
          <View
            style={{
              height: CSS.pixel(130),
              width: CSS.pixel(130),
              position: "relative"
            }}
          >
            <Image
              style={{
                width: "100%",
                position: "absolute",
                height: "100%"
              }}
              source={require("@img/my/rank_pic_certificate_bg.png")}
            />
            <View
              style={{
                position: "absolute",
                left: CSS.pixel(30),
                top: CSS.pixel(26),
                width: CSS.pixel(68),
                height: CSS.pixel(68),
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center"
                // backgroundColor: 'red'
              }}
            >
              <Text
                style={{
                  fontSize: CSS.textSize(24),
                  textAlign: "center",
                  color: "#333",
                  fontWeight: "600",
                  fontFamily: "DINCondensedC"
                }}
              >
                {/^[\d]+$/.test(this.props.score)
                  ? this.props.score + "分"
                  : this.props.score}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: CSS.pixel(10) }}>
            <View
              style={{ flex: 1, justifyContent: "center", flexWrap: "wrap" }}
            >
              <Text
                style={{
                  fontSize: CSS.textSize(32),
                  color: "#333",
                  fontWeight: "600"
                }}
              >
                {this.props.title}
              </Text>
            </View>
            <View
              style={{ height: 1, width: "100%", backgroundColor: "#F3F3F3" }}
            />
            <View style={{ height: CSS.pixel(60), justifyContent: "center" }}>
              <Text style={{ fontSize: CSS.textSize(24), color: "#999" }}>
                {this.props.time}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default SDCertificateItem;

/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  Image,
  NativeModules
} from "react-native";
import defaultStyle, { SDMainColor } from "@styles";
import { Icon } from "@shoutem/ui";
import { imagesModel } from "../types";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({});
type Props = {
  info: string,
  time: string,
  images: imagesModel[],
  subInfo: ?string
};
// 我的履历 - 获奖经历List
export default class AwardList extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <View
          style={{height: 20, flexDirection: "row", alignItems: "center" }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 20
            }}
          >
            <Icon
              name="checkbox-on"
              style={{ color: this.props.status == 'audit_pass' ? "#fed200" : "#e5e5e5", fontSize: 14 }}
            />
          </View>
          <View
            style={{
              width: 160,
              alignItems: "flex-start",
              justifyContent: "center"
            }}
          >
            <Text style={{ color: "#333", fontSize: CSS.pixel(24) }}>
              {this.props.time}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
            paddingHorizontal: 20,
            marginVertical: CSS.pixel(13, true)
          }}
        >
          <Text style={{ color: "#333", fontSize: CSS.pixel(24) }}>
            {this.props.info}
          </Text>
        </View>
        <View style={{ marginLeft: 20, marginTop: 5 }}>
          {this.props.images && this.props.images.length > 0 ? (
            <ScrollView scrollEnabled={false} horizontal={true} style={{ flexDirection: "row" }}>
              {this.props.images.map((item, index) => {
                return <AwardListPhoto image={item} key={index + ""} status={this.props.status}/>;
              })}
            </ScrollView>
          ) : null}
          {this.props.subInfo ? (
            <Text style={{ color: "#999", fontSize: 10, marginTop: 5 }}>
              {this.props.subInfo}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }
}

type ImageProps = {
  image: imagesModel
};
class AwardListPhoto extends React.PureComponent<ImageProps> {
  constructor(props) {
    super(props);
    this.state = {
      width: 140,
      height: 80
    }
  }
  render() {
    const _style = this.props.style || {};
    const desc =
      typeof this.props.image.desc === "string"
        ? JSON.parse(this.props.image.desc)
        : this.props.image.desc;

    return (
      <View
        style={{
          borderColor: "#f1f1f1",
          width: CSS.pixel(300),
          height: CSS.pixel(200),
          marginRight: 10,
          marginBottom: 5,
          // backgroundColor: 'red',
          // justifyContent: "center",
          // alignItems: "flex-start",
          // backgroundColor: "yellow",
          ..._style
        }}
      >
        <Image
          // onLoad={e => {
          //   // console.log("aaa", e.nativeEvent.source)
          //   this.setState({
          //     width: e.nativeEvent.source.width,
          //     height: e.nativeEvent.source.height,
          //   })
          // }}
          source={{
            uri:
              this.props.image.url +
              (desc.width >= desc.height
                ? "?imageView2/2/w/600/q/100"
                : "?imageView2/2/h/400/q/100")
          }}
          style={{
            width: CSS.pixel(300),
            height: CSS.pixel(200), // this.state.height,
          }}
          resizeMode="cover"
        />
        <Image style={{position: 'absolute', right: 0, top: 0}} source={this.props.status == 'doing' ? require("@img/my/TrackRecord/mine_Resume_ico_ShenHe.png") : this.props.status == 'audit_failure' ? require("@img/my/TrackRecord/mine_Resume_ico_BuTongGuo.png") : null}/>
      </View>
    );
  }
}

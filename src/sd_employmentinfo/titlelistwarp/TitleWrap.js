/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
  Image
} from "react-native";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
import SDTouchOpacity from "../../common/SDTouchOpacity";

const styles = StyleSheet.create({
  container: {
    // height: 30,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0,
    borderColor: "#f00",
    //borderLeftColor: "#333",
    //paddingLeft: CSS.pixel(14)
  },
  border: {
    width: 2,
    height: CSS.pixel(28, true),
    backgroundColor: sdStyles.SDFontColorMain,
    marginRight: CSS.pixel(14)
  },
  text: {
    color: '#333',

    fontWeight: "600"
  }
});

export default class TitleWrap extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  renderIconTitle() {
    return (
      <SDTouchOpacity
        style={{
          height: CSS.pixel(74, true),
          padding: CSS.pixel(20),
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={this.props.onPress ? this.props.onPress : null}
      >
        <View style={{justifyContent: 'center', marginRight: CSS.pixel(10)}}>{this.props.leftIcon()}</View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Text style={{color: '#999', fontSize: CSS.textSize(24)}}>{this.props.title}</Text>
        </View>
        <View style={{justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row'}}>
          <Text style={{fontSize: CSS.textSize(24), color: '#999'}}>
            {this.props.otherInfo}
          </Text>
          {this.props.direction && this.props.direction == ">" ? (
            <Image style={{marginLeft: CSS.pixel(14)}} source={require("@img/my/mine_btn_list_black.png")} />
          ) : null}
        </View>
      </SDTouchOpacity>
    );
  }
  render() {
    if (this.props.leftIcon) {
      return this.renderIconTitle();
    }
    const styleProps = this.props.style || {};
    return (
      <TouchableOpacity
        style={[styles.container, { ...styleProps }]}
        onPress={this.props.onPress ? this.props.onPress : null}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: "row", alignItems: 'center', flex: 1 }}>
          <View style={[styles.border]} />
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text
              style={[
                styles.text,
                { fontSize: CSS.textSize(28) },
                this.props.textStyle
              ]}
            >
              {this.props.title}
            </Text>
          </View>
        </View>
        {this.props.nomore ? null : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#999', fontSize: CSS.textSize(22)}}>更多 </Text><Image style={{width: CSS.pixel(12), height: CSS.pixel(16)}} source={require("@img/my/PersonMainTop/mine_btn_list_black.png")}/>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

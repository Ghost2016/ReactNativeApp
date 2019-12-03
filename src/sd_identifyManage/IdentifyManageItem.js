import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  TextInput
} from "react-native";
import PropTypes from "prop-types";
import { CSS } from "@common/SDCSS";
import defaultStyle from "../styles";
//import { Touchable } from "@sd_components"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    height: 110,
    borderBottomWidth: 1,
    borderColor: "#e1e1e1",
    paddingLeft: 10
    // paddingRight: 10
  },
  saveBtnBox: {
    marginTop: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

// 身份管理Item
export default class IdentifyManageItem extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  onPressEditAction() {
    if (this.props.onPressEdit) {
      this.props.onPressEdit();
    }
  }

  onPressDefaultAction() {
    if (this.props.onPressDefault) {
      this.props.onPressDefault();
    }
  }

  render() {
    // console.warn(this.props.isDefault)
    return (
      <View style={styles.container}>
        <View
          style={[defaultStyle.flexRow, defaultStyle.center, { height: 40 }]}
        >
          <View style={[defaultStyle.flex]}>
            <Text style={{ color: "#666", fontSize: 12 }}>
              {this.props.time}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              width: CSS.pixel(80),
              height: CSS.pixel(80, true),
              //backgroundColor:'#f00',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={this.onPressEditAction.bind(this)}
          >
            <Text style={{ color: "#fed200", fontSize: 12 }}>编辑</Text>
          </TouchableOpacity>
        </View>

        <View style={[defaultStyle.center, defaultStyle.flexRow, { flex: 1 }]}>
          <Text style={{ width: 120, color: "#333", fontSize: 16 }}>
            {this.props.schoolName}
          </Text>
          <Text style={{ flex: 1, fontSize: 16, color: "#333" }}>
            {this.props.level + "-" + this.props.major}
          </Text>
        </View>

        {this.props.isDefault ? (
          <View
            style={[defaultStyle.center, defaultStyle.flexRow, { height: 40 }]}
          >
            <View
              style={{
                backgroundColor: "#fed200",
                width: 10,
                height: 10,
                borderRadius: 10,
                marginRight: 5
              }}
            />
            <View
              style={[
                defaultStyle.flex,
                { alignItems: "flex-start", justifyContent: "center" }
              ]}
            >
              <Text style={{ color: "#fed200", fontSize: 14 }}>默认</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[defaultStyle.center, defaultStyle.flexRow, { height: 40 }]}
            onPress={this.onPressDefaultAction.bind(this)}
          >
            <View
              style={{
                backgroundColor: "#d1d1d1",
                width: 10,
                height: 10,
                borderRadius: 10,
                marginRight: 5
              }}
            />
            <View
              style={[
                defaultStyle.flex,
                { alignItems: "flex-start", justifyContent: "center" }
              ]}
            >
              <Text style={{ color: "#d1d1d1", fontSize: 14 }}>设为默认</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

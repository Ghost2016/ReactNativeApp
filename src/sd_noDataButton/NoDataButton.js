import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import { CSS } from "../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

type Props = {
  buttonName: string,
  subInfo: ?string,
  onPress: () => {}
};

// 没有数据的Button
export default class NoDataButton extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  render() {
    const _style = this.props.style || {};
    return (
      <View style={[{justifyContent: "center", alignItems: "center", padding: CSS.pixel(30), backgroundColor: '#fff'}, _style]}>
        <TouchableOpacity
          onPress={this.props.onPress ? this.props.onPress : null}
          style={{
            width: 200,
            paddingHorizontal: 20,
            height: 80,
            borderColor: "#ddd",
            borderWidth: 1,
            borderStyle: "dashed",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#333", fontSize: CSS.textSize(24)}}>
            + {this.props.buttonName}
          </Text>
        </TouchableOpacity>

        {this.props.subInfo ? (
          <View
            style={{
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "#999", fontSize: CSS.textSize(20) }}>
              {this.props.subInfo}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}

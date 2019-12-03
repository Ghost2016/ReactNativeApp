import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  TextInput
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../connectWithActions";
import { SDMainColor } from "../../styles";
import * as sdStyles from "@src/styles";
import { CSS } from "@common/SDCSS";
import { Html } from "@shoutem/ui";

const styles = StyleSheet.create({
  inputWrap: {
    height: CSS.pixel(140, true),
    paddingLeft: CSS.pixel(50),
    paddingRight: CSS.pixel(80)
  },
  borderInput: {
    borderColor: "#efefef",
    borderWidth: 1,
    flexDirection: "row",
    width: CSS.pixel(480),
    height: CSS.pixel(80, true),
    marginBottom: CSS.pixel(20, true)
  },
  saveBtnBox: {
    marginBottom: CSS.pixel(40, true),
    height: CSS.pixel(72, true),
    overflow: "hidden",
    marginTop: CSS.pixel(40, true)
  }
});

const html = `暂无
`;

//版本说明
class AboutVersion extends React.Component {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  render() {
    return (
      <ScrollView style={{backgroundColor: '#f3f3f3'}}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          {/*<View style={{ marginTop: CSS.pixel(50, true) }}>
                      <Text
                        style={{
                          fontSize: CSS.pixel(34),
                          color: sdStyles.SDFontColorMain
                        }}
                      >
                        版本说明
                      </Text>
                    </View>*/}
          {/* <View
            style={{
              paddingHorizontal: CSS.pixel(20),
              marginTop: CSS.pixel(72, true),
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%"
            }}
          >
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                textAlign: "left"
              }}
            >
              v0.0.6 - 2018-06-13
            </Text>
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMinor,
                lineHeight: 20,
                marginTop: CSS.pixel(40, true),
                marginBottom: CSS.pixel(62, true),
                textAlign: "left"
              }}
            >
              补充任务分享、APP分享至第三方的h5页面
            </Text>
          </View> */}
          <View
            style={{
              paddingHorizontal: CSS.pixel(20),
              width: "100%"
            }}
          >
            <Text
              style={{
                fontSize: CSS.pixel(28),
                color: sdStyles.SDFontColorMain,
                textAlign: "left",
                marginTop: 40,
                paddingLeft: 14,
              }}
            >
              v0.2.1 - 2018-09-01更新
            </Text>
            <View
              style={{
                //fontSize: CSS.pixel(28),
                //color: sdStyles.SDFontColorMinor,
                //lineHeight: 20,
                marginTop: CSS.pixel(0, true),
                marginBottom: CSS.pixel(62, true),
                //textAlign: "left"
              }}
            >
            <Html
                body={html.replace(/[\n]/gi, "<br>")}
              />

            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(AboutVersion);

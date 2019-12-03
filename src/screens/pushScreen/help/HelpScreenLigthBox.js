import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  FlatList,
  AlertIOS,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import { SDMainColor, dismissLightBox } from "../../../styles";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height / 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8
  }
});
type Props = {
    content: string,
    title: string
}
// 帮助中心
export default class HelpScreenLightBox extends React.PureComponent<Props> {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }
  render() {
    return (
        <View style={styles.container}>
            <View style={{borderBottomColor: '#efefef', borderBottomWidth: 1, paddingHorizontal: CSS.pixel(30), height: CSS.pixel(80, true), flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                <TouchableOpacity onPress={() => {
                    dismissLightBox();
                }}>
                    <Text style={{color: SDMainColor, fontSize: CSS.textSize(28)}}>关闭</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={{padding: CSS.pixel(30), justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#333', fontSize: CSS.textSize(34)}}>{this.props.title}</Text>
                </View>
                <View style={{padding: CSS.pixel(30), paddingTop: 0}}><Text style={{color: '#999', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(48)}}>{this.props.content}</Text></View>
            </ScrollView>
            <View style={{zIndex: 10, backgroundColor: '#fff', position: 'absolute', left: 0, right: 0, bottom: 0, height: 8}}>
            </View>
        </View>
    );
  }
}

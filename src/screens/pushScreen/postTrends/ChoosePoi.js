import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  AlertIOS,
  TextInput,
  Image,
  KeyboardAvoidingView,
  FlatList,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import { LocalModel } from "../../../types";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  }
});

type Props = {
  location: LocalModel
};

// 发布动态页面
class ChoosePoi extends React.PureComponent<Props> {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

//   componentDidMount() {
//     this.context.refs["_postTrends"] = this;
//   }

  componentWillMount() {
    this.props.actions.getCenterPoiInfoAction().then(res => {
      if (res.info === "OK") {
        this.setState({
          data: res.pois
        });
      }
    });
  }

  onPressPoi(address) {
    if (this.context.refs["_postTrends"]) {
      this.context.refs["_postTrends"].setState({
        location: address
      });
    }
    this.context.navigator.pop();
  }

  _renderItem({ item, index }) {
    return (
      <PoiListItem
        data={item}
        key={item.id ? item.id : index + ""}
        onPress={this.onPressPoi.bind(this, item.address ? item.address + item.name  : "")}
      />
    );
  }

  render() {
    return (
      <View style={{ backgroundColor: "#f3f3f3" }}>
        <View
          style={{
            height: CSS.pixel(100, true),
            paddingLeft: CSS.pixel(30),
            justifyContent: "center"
          }}
        >
          <Text style={{ fontSize: 14, color: "#999" }}>
            {this.props.location && this.props.location.city
              ? this.props.location.city
              : "请选择位置"}
          </Text>
        </View>
        <FlatList
          style={{height: Dimensions.get("window").height - 120}}
          keyExtractor={item => item.id}
          data={this.state.data}
          renderItem={this._renderItem.bind(this)}
        />
        
      </View>
    );
  }
}
export default ConnectWithActions((state, props) => ({
  location: state.location
}))(ChoosePoi);

class PoiListItem extends React.PureComponent {
  render() {
    return (
      <SDTouchOpacity
        style={{
          height: CSS.pixel(120, true),
          paddingLeft: CSS.pixel(30),
          borderBottomWidth: 1,
          borderBottomColor: '#efefef',
          backgroundColor: '#fff'
        }}
        onPress={this.props.onPress}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ fontSize: 18, color: "#333" }}>
            {this.props.data && this.props.data.name
              ? this.props.data.name
              : ""}
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ fontSize: 14, color: "#999" }}>
            {this.props.data && this.props.data.address
              ? this.props.data.address
              : ""}
          </Text>
        </View>
      </SDTouchOpacity>
    );
  }
}

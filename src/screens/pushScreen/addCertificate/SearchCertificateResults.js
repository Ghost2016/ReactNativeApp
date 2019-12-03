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
import Highlighter from "react-native-highlight-words";
import { dismissLightBox } from "../../../styles";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: Dimensions.get("window").height / 2 + 60,
    width: Dimensions.get("window").width - 40,
    top: (Dimensions.get("window").height - (Dimensions.get("window").height / 2 + 60)) / 2,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#efefef'
  }
});
type SearchModle = {
  fullText: string
};
type Props = {
  searchWord: string,
  data: SearchModle[],
  onPressItem: Function
};
// 添加证书界面
export default class SearchCertificateResults extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  _onPress(text) {
    dismissLightBox();
    this.props.onPressItem && this.props.onPressItem(text);
  }
  makeSearchMajorItem() {
    var arrHtml = [];
    for (let i = 0; i < this.props.data.length; i++) {
      const element = this.props.data[i];
      arrHtml.push(
        <SearchItem
          onPress={this._onPress.bind(this, element.name)}
          key={i + ""}
          searchText={this.props.searchWord}
          fullText={element.name}
        />
      );
    }
    return arrHtml;
  }

  render() {
    return <View style={[styles.container,{
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowColor: "#999",
      //注意：这一句是可以让安卓拥有灰色阴影
      elevation: 4
    }]}><ScrollView style={{height: '100%'}}>{this.makeSearchMajorItem()}</ScrollView></View>;
  }
}

class SearchItem extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress ? this.props.onPress : null}
        style={{
          height: 50,
          paddingHorizontal: 10,
          justifyContent: 'center',
          borderBottomColor: "#efefef",
          borderBottomWidth: this.props.bodered === false ? 0 : 1
        }}
      >
        <Highlighter
          style={{fontSize: CSS.textSize(34), color: '#333'}}
          highlightStyle={{ color: "#fed200", fontSize: CSS.textSize(34) }}
          searchWords={[this.props.searchText]}
          textToHighlight={this.props.fullText}
        />
      </TouchableOpacity>
    );
  }
}

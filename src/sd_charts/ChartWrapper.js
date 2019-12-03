import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import { ActivityIndicator } from 'antd-mobile';

/**
 * 统一处理图表
 */
export default class ChartWrapper extends Component {
  constructor(props) {
    super();
  }
  static defaultProps = {
    loading: false,
    nodata: false
  }
  componentDidMount() {}
  componentWillReceiveProps(props) {}
  shouldComponentUpdate() {
    return true;
  }
  render() {
    const { children, style, loading, nodata } = this.props;
    const WapperComponent = this.props.horizontal ? ScrollView : View
    return (
      <WapperComponent style={[{ backgroundColor: "#fff" }, style]} horizontal={true} showsHorizontalScrollIndicator={false} bounces={false}>
        {loading && 
          (<View style={[{flex:1, justifyContent:'center',alignItems:'center'}, style]}>
            <ActivityIndicator animating={loading}/>
          </View>)}
        {!loading && nodata && (
          <View style={[{flex:1, justifyContent:'center',alignItems:'center'}, style]}><Text>暂无数据</Text></View>
        )}
        {!loading && !nodata && children}
      </WapperComponent>);
  }
}

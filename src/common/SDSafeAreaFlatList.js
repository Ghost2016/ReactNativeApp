
import { withSafeArea } from 'react-native-safe-area';
import React from 'react';

import { FlatList } from 'react-native';
const SafeAreaFlatList = withSafeArea(FlatList, 'contentInset', 'bottom');

export default class SDSafeAreaFlatList extends React.Component{
  componentDidMount() {

  }
  render() {
    return <SafeAreaFlatList {...this.props}/>
  }
}
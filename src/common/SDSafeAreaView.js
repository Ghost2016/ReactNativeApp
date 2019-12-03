
import { withSafeArea } from 'react-native-safe-area';
import React from 'react';

import { View } from 'react-native';
const SafeAreaView = withSafeArea(View, 'contentInset', 'bottom');

export default class SDSafeAreaView extends React.Component{
  componentDidMount() {

  }
  render() {
    return <SafeAreaView {...this.props}/>
  }
}
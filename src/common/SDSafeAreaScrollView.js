
import { withSafeArea } from 'react-native-safe-area';
import React from 'react';

import { ScrollView } from 'react-native';
const SafeAreaScrollView = withSafeArea(ScrollView, 'contentInset', 'bottom');

export default class SDSafeAreaScrollView extends React.Component{
  componentDidMount() {

  }
  render() {
    return <SafeAreaScrollView {...this.props}/>
  }
}
/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import connectWithActions  from '../connectWithActions';
import { SDStatusBar } from '../common';
import { getSession } from '../selectors';

const componentStyles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent'
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  childrenWrapper: {
    flex: 1,
    // backgroundColor: 'yellow'
  },
  content: {
    flex: 1,
    // justifyContent: 'center',
    flexDirection: 'column'
  },
});

type Props = {
};

class SDScreen extends PureComponent<Props> {
  context: Context;
  props: Props;

  static contextTypes = {
    styles: () => null,
  };

  static defaultProps = {
    keyboardShouldPersistTaps: 'handled',
  };

  render() {
    
    const {
      children,
      safeAreaInsets,
      style,
      title,
      header
    } = this.props;

    return (
      <View style={[
        componentStyles.screen,
        ]}>
        {/* <SDStatusBar/> */}
        {header && header()}
        <View
          style={[
            componentStyles.childrenWrapper, 
          ]}
          contentContainerStyle={[componentStyles.content, style]}
          >
            {children}
            {/* <SDFooter/> */}
        </View>
      </View>
    );
  }
}

export default connectWithActions((state, props) => ({
  safeAreaInsets: getSession(state).safeAreaInsets,
}))(SDScreen);
/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
// import { DB_HOST } from 'react-native-dotenv'
const componentStyles = StyleSheet.create({
  footer: {
    backgroundColor:'pink',
    justifyContent:'center',
    alignItems:'center',
    paddingVertical: 10
  }
});

class SDFooter extends PureComponent<Props> {
  context: Context;
  props: Props;

  static contextTypes = {
    styles: () => null,
  };
  
  static defaultProps = {
  };
  render() {
    return (
      <View style={[componentStyles.footer]}>
        <Text>---我是有底线的---</Text>
      </View>
    );
  }
}
export default SDFooter
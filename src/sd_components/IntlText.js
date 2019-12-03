/* @flow */
import React, { PureComponent } from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";

type Props = {
  title: string
};

export default class IntlText extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    //intl: PropTypes.object.isRequired
  };
  state = {
    isIntl: false,
    title: ""
  };

  componentWillMount() {
    //console.log("^^^^^^^^^componentWillMount", this.props)
    const { styleName, title } = this.props;
    const isIntl = (title && title.match(/^SD\((.+)\)$/)) ? true : false;
    this.setState({
      isIntl: isIntl
    });
  }

  /*componentDidMount(){
    console.log("^^^^^^^^^componentDidMount")
  }

  componentWillReceiveProps(a,b,c){
    console.log("^^^^^^^^^componentWillReceiveProps", a,b,c)
  }

  shouldComponentUpdate(a,b,c){
    console.log("^^^^^^^^^shouldComponentUpdate", a,b,c)
    return true
  }

  componentWillUpdate(){
    console.log("^^^^^^^^^componentWillUpdate")
  }

  componentDidUpdate(){
    console.log("^^^^^^^^^componentDidUpdate")
  }

  componentWillUnmount(){
    console.log("^^^^^^^^^componentWillUnmount")
  }*/

  render() {
    const { style, title } = this.props;
    return (
      <Text style={[style, { textAlign: "center" }]}>
        {(this.state.isIntl && this.context.intl)
          ? this.context.intl.formatMessage({ id: title })
          : title}
      </Text>
    );
  }
}

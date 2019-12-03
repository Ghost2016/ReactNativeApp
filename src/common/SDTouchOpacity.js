/* @flow */
import React, { Component } from "react";
import { Text } from "react-native";
import {
  TouchableOpacity,
} from "react-native";

let currTime = null;
export default class SDTouchOpacity extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    }
  }
  render() {
    // if(this.props.noDelay) {
    //   return (
    //     <TouchableOpacity {...this.props}>
    //       {this.props.children}
    //     </TouchableOpacity>
    //   )
    // }
    return (
      <TouchableOpacity disabled={this.state.disabled} {...this.props} onPress={(e) => {
        if(currTime == null || (Date.now() - currTime > 1200) || this.props.noDelay) {
          currTime = Date.now();
          this.state.disabled = true;
          this.setState({
            disabled: true
          }, () => {
            this.props.onPress && this.props.onPress instanceof Function && this.props.onPress(e);
            setTimeout(() => {
              this.setState({
                disabled: false
              });
            }, this.props.noDelay ? 0 : 1000);
          });
        } else {
          if(this.state.disabled != true) {
            this.state.disabled = true;
            new Promise((resolve, reject) => {
              this.setState({
                disabled: true
              }, () => {
                resolve();
              });
            }).then(() => {
              // 不执行一下点击事件
              this.props.onPress && this.props.onPress instanceof Function && this.props.onPress(e);
              setTimeout(() => {
                this.setState({
                  disabled: false
                });
              }, 1000)
            }).catch(err => {

            });
          }
        }
      }} >{this.props.children}</TouchableOpacity>
    );
  }
}

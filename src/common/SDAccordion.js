/* @flow */
import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { CSS } from "./SDCSS";
import { Accordion } from "antd-mobile";

const styles = StyleSheet.create({});

type Props = {
  title: string,
  onChange: Function,
  header: any,
  open: ?boolean
};
export default class SDAccordion extends React.PureComponent<Props> {
  _onChange() {
    this.props.onChange ? this.props.onChange() : null;
  }
  render() {
    return (
      <Accordion defaultActiveKey={this.props.open ? "0" : ""} style={{backgroundColor: '#fff', marginBottom: CSS.pixel(30, true)}}>
        <Accordion.Panel header={this.props.header()}>
            {this.props.children}
        </Accordion.Panel>
      </Accordion>
    );
  }
}

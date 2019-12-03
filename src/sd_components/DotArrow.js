/* @flow */
import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";

type Props = {
  onPress: () => void
};

export default class DotArrow extends PureComponent<Props> {
  props: Props;
  onPressAction = () => this.props.onPress(this.props.data);

  render() {
    const {
      style,
      innerStyle,
      textStyle,
      direction,
      title,
      radius,
      border,
      disable,
    } = this.props;
    const _direction =
      typeof title === "string" ? title : direction === "right" ? ">" : "<";
    const _radius = typeof radius === "number" ? radius : 24;
    const Container = disable ? View : TouchableOpacity;
    return (
      <Container onPress={disable ? console.log("disabled") : this.onPressAction.bind(this)}>
        <View
          style={[
            {
              //backgroundColor: "transparent",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: _radius,
              height: _radius,
              borderWidth: typeof border === "number" ? border : 0,
              borderColor: "#fff6cf",
              borderRadius: _radius / 2,
              backgroundColor: "#fff6cf",
              marginHorizontal: 10
            },
            style
          ]}
        >
          <View
            style={[
              {
                flexDirection: "column",
                alignItems: "center",
                width: _radius / 2,
                height: _radius / 2,
                borderRadius: _radius / 4,
                backgroundColor: "#fff6cf"
              },
              innerStyle
            ]}
          >
            {_direction ? (
              <Text
                style={[
                  {
                    fontSize: 22,
                    position: "relative",
                    top: -10,
                    left: 0,
                    color: "#ccc"
                  },
                  textStyle
                ]}
              >
                {_direction}
              </Text>
            ) : null}
          </View>
        </View>
      </Container>
    );
  }
}

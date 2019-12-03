/* @flow */
import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDTag from "@sd_components/SDTag";

type Props = {};

export default class SDTagGroup extends PureComponent<Props> {
  props: Props;

  async onPressAction(titles, data, index, title){
    //console.log("onPressAction===", titles, data, index, title)
    return await this.props.onPress(titles, data, index, title)
  }

  render() {
    const { style, tags, name, isMultiple, title, tagStyle, tagSelectStyle, btnStyle, tagContainerStyle, isReset } = this.props;
    return (
      <View
        style={[
          {
            //backgroundColor: "transparent",
            flexDirection: "column",
            alignItems: "center",
            //justifyContent: "center",
          },
          style
        ]}
      >
        <Text
              style={{
                textAlign: "center",
                fontSize: CSS.textSize(24),
                color: sdStyles.SDFontColorSubtitle,
                position: 'relative',
                left: CSS.textSize(10),
              }}
            >
              { typeof title === 'function' ? title() : title }
            </Text>
            <SDTag
              tags={tags}
              isMultiple={isMultiple}
              isReset={isReset}
              name={name}
              onPress={this.onPressAction.bind(this)}
              tagStyle={tagStyle}
              tagSelectStyle={tagSelectStyle}
              btnStyle={btnStyle}
              style={tagContainerStyle}
            />
      </View>
    );
  }
}

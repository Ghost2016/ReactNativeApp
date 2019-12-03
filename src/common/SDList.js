/* @flow */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
  Image
} from "react-native";
import { Switch } from "antd-mobile";
import SDSwitch from "@sd_components/SDSwitch";
import { CSS } from "@common/SDCSS";

const iconRightArrowDark = require("@img/my/PersonMainTop/mine_btn_list_black.png");

const styles = StyleSheet.create({
  listItemBox: {
    height: CSS.pixel(120, true),
    borderColor: "#efefef",
    borderBottomWidth: 1,
    flexDirection: "row"
  },
  listItemFootterBox: {
    height: CSS.pixel(80),
    flexDirection: "row"
  },
  listItemName: {
    // paddingLeft: CSS.pixel(30),
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  listItemNameText: {
    color: "#333",
    fontSize: CSS.textSize(30)
  },
  listItemRightText: {
    color: "#c5c5c5",
    fontSize: 18,
    width: 30,
    textAlign: "center"
  },
  listItemRightBox: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row"
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: "#eee"
  }
});

type Props = {
  listOptions: PropsData[]
};

type PropsData = {
  name: string,
  direction: ?string,
  subInfo: ?any,
  subInfoStyle: ?object,
  footter: ?React.Element | ?Function,
  subTitle: ?string,
  directionStyle: ?object,
  listItemNameStyle: ?object,
  subTitleStyle: ?object,
  bottomBorder: ?object,
  onSwitch: () => {},
  defaultChecked: ?boolean,
  listHeaderStyle: ?object,
  onPress: () => {}
};

export default class SDList extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  makeListItem() {
    let arrHtml = [];
    for (let i = 0; i < this.props.listOptions.length; i++) {
      const element = this.props.listOptions[i];
      arrHtml.push(
        <SDListItem
          key={i}
          name={element.name}
          leftIcon={element.leftIcon ? element.leftIcon : null}
          direction={element.direction ? element.direction : ""}
          subRowTitle={element.subRowTitle ? element.subRowTitle : ""}
          rightIcon={element.rightIcon ? element.rightIcon : null}
          subInfo={element.subInfo ? element.subInfo : null}
          subInfoStyle={element.subInfoStyle || {}}
          footter={element.footter ? element.footter : null}
          subTitle={element.subTitle ? element.subTitle : null}
          directionStyle={element.directionStyle || {}}
          listItemNameStyle={element.listItemNameStyle || {}}
          subTitleStyle={element.subTitleStyle || {}}
          bottomBorder={element.bottomBorder}
          onSwitch={element.onSwitch}
          defaultChecked={element.defaultChecked}
          listHeaderStyle={element.listHeaderStyle || {}}
          onPress={element.onPress}
          height={element.height}
        />
      );
    }
    return arrHtml;
  }
  render() {
    return (
      <View style={{ backgroundColor: "#fff", flexDirection: "row" }}>
        <View style={{ width: CSS.pixel(30) }} />
        <View style={{ flex: 1 }}>{this.makeListItem()}</View>
      </View>
    );
  }
}

class SDListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switchChecked: !!this.props.defaultChecked
    };
  }

  onSwitchChange(checked) {
    this.setState(
      {
        switchChecked: checked
      },
      () => {
        this.props.onSwitch &&
          this.props.onSwitch instanceof Function &&
          this.props.onSwitch(checked);
      }
    );
  }

  renderFootterView() {
    const FooterComponent = this.props.footter;
    return (
      <TouchableOpacity
        onPress={this.props.onPress ? this.props.onPress : null}
      >
        <View style={this.props.bottomBorder ? styles.bottomBorder : {}}>
          <View
            style={[
              styles.listItemFootterBox,
              { ...this.props.listHeaderStyle }
            ]}
          >
            <View style={styles.listItemName}>
              {this.props.leftIcon && (
                <View style={{ marginRight: CSS.pixel(20) }}>
                  {this.props.leftIcon()}
                </View>
              )}
              <View style={{ justifyContent: "center" }}>
                <View style={{ justifyContent: "center" }}>
                  <Text
                    style={[
                      styles.listItemNameText,

                      { ...this.props.listItemNameStyle }
                    ]}
                  >
                    {this.props.name}
                  </Text>
                  {this.props.subTitle ? (
                    <Text
                      style={[
                        { color: "#ccc", fontSize: 12 },
                        { ...this.props.subTitleStyle }
                      ]}
                    >
                      {this.props.subTitle}
                    </Text>
                  ) : null}
                </View>
                {this.props.subRowTitle ? (
                  <View style={{ marginTop: CSS.pixel(10) }}>
                    <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                      {this.props.subRowTitle}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
            {this.props.direction != "" ? (
              typeof this.props.direction === "string" &&
              this.props.direction !== "switch" ? (
                // <TouchableOpacity
                //   style={{ width: this.props.subInfo ? "55%" : 50 }}
                //   onPress={this.props.onPress ? this.props.onPress : null}
                // >
                <View style={styles.listItemRightBox}>
                  {this.props.subInfo ? (
                    this.props.subInfo.avatar ? (
                      <SDListItemAvatar
                        uri={this.props.subInfo.avatar}
                        text={this.props.subInfo.text}
                      />
                    ) : (
                      <Text
                        style={{
                          paddingRight: CSS.pixel(30),
                          fontSize: CSS.textSize(24),
                          color: "#333",
                          ...this.props.subInfoStyle
                        }}
                      >
                        {typeof this.props.subInfo === "object" &&
                        this.props.subInfo.text
                          ? this.props.subInfo.text
                          : this.props.subInfo}
                      </Text>
                    )
                  ) : null}

                  {typeof this.props.rightIcon === "function" ? (
                    this.props.rightIcon()
                  ) : this.props.direction == ">" ? (
                    <Image
                      style={{ marginRight: CSS.pixel(30) }}
                      source={iconRightArrowDark}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.listItemRightText,
                        { ...this.props.directionStyle }
                      ]}
                    >
                      {this.props.direction}
                    </Text>
                  )}
                </View>
              ) : (
                // </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "flex-end",
                    marginRight: CSS.pixel(30)
                  }}
                >
                  <Switch
                    color="#fdd030"
                    checked={this.state.switchChecked}
                    onChange={this.onSwitchChange.bind(this)}
                  />
                </View>
              )
            ) : null}
          </View>
          {FooterComponent}
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { rightIcon } = this.props;
    // 是否需要底部组件
    if (this.props.footter) {
      return this.renderFootterView();
    }
    return (
      <TouchableOpacity
        onPress={this.props.onPress ? this.props.onPress : null}
      >
        <View style={[styles.listItemBox, { alignItems: "center", borderBottomWidth: this.props.bottomBorder != false ? 1: 0}]}>
          <View
            style={[
              styles.listItemName,
              {
                height: this.props.height
                  ? this.props.height
                  : CSS.pixel(110, true)
              }
            ]}
          >
            {this.props.leftIcon && (
              <View style={{ marginRight: CSS.pixel(20) }}>
                {this.props.leftIcon()}
              </View>
            )}
            <View style={{ justifyContent: "center" }}>
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={[
                    styles.listItemNameText,
                    { ...this.props.listItemNameStyle }
                  ]}
                >
                  {this.props.name}
                </Text>
                {this.props.subTitle ? (
                  <Text
                    style={[
                      { color: "#ccc", fontSize: 12 },
                      { ...this.props.subTitleStyle }
                    ]}
                  >
                    {this.props.subTitle}
                  </Text>
                ) : null}
              </View>
              {this.props.subRowTitle ? (
                <View style={{ marginTop: CSS.pixel(10) }}>
                  <Text style={{ color: "#999", fontSize: CSS.textSize(24) }}>
                    {this.props.subRowTitle}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {this.props.direction != "" ? (
            typeof this.props.direction === "string" &&
            this.props.direction !== "switch" ? (
              // <TouchableOpacity
              //   style={{ width: this.props.subInfo ? "55%" : 50 }}
              //   onPress={this.props.onPress ? this.props.onPress : null}
              // >
              <View style={styles.listItemRightBox}>
                {this.props.subInfo ? (
                  this.props.subInfo.avatar ? (
                    <SDListItemAvatar
                      uri={this.props.subInfo.avatar}
                      text={this.props.subInfo.text}
                    />
                  ) : (
                    <Text
                      style={{
                        paddingRight: CSS.pixel(30),
                        fontSize: CSS.textSize(24),
                        color: "#333",
                        ...this.props.subInfoStyle
                      }}
                    >
                      {typeof this.props.subInfo === "object" &&
                      this.props.subInfo.text
                        ? this.props.subInfo.text
                        : this.props.subInfo}
                    </Text>
                  )
                ) : null}

                {typeof rightIcon === "function" ? (
                  rightIcon()
                ) : this.props.direction == ">" ? (
                  <Image
                    style={{ marginRight: CSS.pixel(30) }}
                    source={iconRightArrowDark}
                  />
                ) : (
                  <Text
                    style={[
                      styles.listItemRightText,
                      { ...this.props.directionStyle }
                    ]}
                  >
                    {this.props.direction}
                  </Text>
                )}
              </View>
            ) : (
              // </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-end",
                  marginRight: CSS.pixel(30)
                }}
              >
                <Switch
                  color="#fdd030"
                  onTintColor="#f00"
                  checked={this.state.switchChecked}
                  onChange={this.onSwitchChange.bind(this)}
                />

                {/* <SDSwitch
                toggleSwitch={this.onSwitchChange.bind(this)}
                switchValue={this.state.switchChecked}
              /> */}
              </View>
            )
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

class SDListItemAvatar extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: CSS.pixel(30)
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 20,
            borderWidth: 1,
            overflow: "hidden",
            borderColor: "#eee",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            style={{
              width: 36,
              height: 36
            }}
            source={
              typeof this.props.uri === "string"
                ? [{ uri: this.props.uri }]
                : this.props.uri
            }
            resizeMode="cover"
          />
        </View>

        {this.props.text ? (
          <View>
            <Text style={{ marginLeft: 5 }}>{this.props.text}</Text>
          </View>
        ) : null}
      </View>
    );
  }
}

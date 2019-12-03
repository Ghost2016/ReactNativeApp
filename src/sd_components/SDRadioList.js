/* @flow */
import React, { PureComponent } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
import * as sdStyles from "@styles";

type Props = {
  index: number,
  radioProps: object,
  selectIndex: number,
  selectValue: string,
  styleName: string,
  onPress: () => void
};

var Style = StyleSheet.create({
  radioForm: {},

  radioWrap: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 5
  },
  radio: {
    justifyContent: "center",
    alignItems: "center",

    width: 30,
    height: 30,

    alignSelf: "center",

    borderColor: sdStyles.SDMainColor,
    borderRadius: 30
  },

  radioLabel: {
    paddingLeft: 10,
    lineHeight: 20
  },

  radioNormal: {
    borderRadius: 10
  },

  radioActive: {
    width: 20,
    height: 20,
    backgroundColor: sdStyles.SDMainColor
  },

  labelWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center"
  },

  labelVerticalWrap: {
    flexDirection: "column",
    paddingLeft: 10
  },

  labelVertical: {
    paddingLeft: 0
  },

  formHorizontal: {
    flexDirection: "row"
  }
});

export default class SDRadioList extends PureComponent<Props> {
  props: Props;
  /*static contextTypes = {
    intl: PropTypes.object.isRequired
  };*/
  //onPressAction = () => this.props.onPress();

  render() {
    const {
      style,
      styleName,
      index,
      radioProps,
      selectIndex,
      selectValue,
      onPress
    } = this.props;
    const selectColor =
      selectIndex == index
        ? sdStyles.SDMainColor
        : sdStyles.SDFontColorSubtitle;
    return (
      <RadioButton labelHorizontal={true} key={index}>
        {/*  You can set RadioButtonLabel before RadioButtonInput */}
        <RadioButtonInput
          obj={radioProps[index]}
          index={index}
          isSelected={selectIndex == index}
          onPress={(value, index) => {
            onPress(value, index);
          }}
          borderWidth={3}
          buttonInnerColor={sdStyles.SDMainColor}
          buttonOuterColor={selectColor}
          buttonSize={20}
          buttonOuterSize={30}
          buttonStyle={{}}
          buttonWrapStyle={{ marginLeft: 10 }}
        />
        <RadioButtonLabel
          obj={radioProps[index]}
          index={index}
          labelHorizontal={true}
          onPress={(value, index) => {
            onPress(value, index);
          }}
          labelStyle={{ fontSize: 18, color: selectColor }}
          labelWrapStyle={{}}
        />
      </RadioButton>
    );
  }
}

export class SDRadioForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_active_index: props.initial
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this._renderButton = this._renderButton.bind(this);
  }
  static defaultProps = {
    radio_props: [],
    initial: 0,
    buttonColor: sdStyles.SDMainColor,
    selectedButtonColor: sdStyles.SDMainColor,
    formHorizontal: false,
    labelHorizontal: true,
    animation: true,
    labelColor: "#000",
    selectedLabelColor: "#000",
    wrapStyle: {},
    disabled: false
  };

  updateIsActiveIndex(index) {
    this.setState({ is_active_index: index });
    this.props.onPress(this.props.radio_props[index], index);
  }

  _renderButton(obj, i) {
    return (
      <View key={"vrb" + i}>
        <RadioButton
          accessible={this.props.accessible}
          accessibilityLabel={
            this.props.accessibilityLabel
              ? this.props.accessibilityLabel + "|" + i
              : "radioButton" + "|" + i
          }
          testID={
            this.props.testID
              ? this.props.testID + "|" + i
              : "radioButton" + "|" + i
          }
          isSelected={this.state.is_active_index === i}
          obj={obj}
          key={i}
          index={i}
          buttonColor={
            this.state.is_active_index === i
              ? this.props.selectedButtonColor
              : this.props.buttonColor
          }
          buttonSize={this.props.buttonSize}
          buttonOuterSize={this.props.buttonOuterSize}
          labelHorizontal={this.props.labelHorizontal}
          labelColor={
            this.state.is_active_index === i
              ? this.props.selectedLabelColor
              : this.props.labelColor
          }
          labelStyle={this.props.labelStyle}
          style={this.props.radioStyle}
          animation={this.props.animation}
          disabled={this.props.disabled}
          onPress={(value, index) => {
            this.props.onPress(value, index);
            this.setState({ is_active_index: index });
          }}
        />
      </View>
    );
  }

  render() {
    var render_content = false;
    if (this.props.radio_props.length) {
      render_content = this.props.radio_props.map(this._renderButton);
    } else {
      render_content = this.props.children;
    }
    return (
      <View
        style={[
          Style.radioFrom,
          this.props.style,
          this.props.formHorizontal && Style.formHorizontal
        ]}
      >
        {render_content}
      </View>
    );
  }
}

/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { CSS } from "@common/SDCSS";
import IntlText from "./IntlText";
//import * as sdStyles from "@styles";
import { Touchable } from "./index";

// 获取手机屏幕的大小
//const { height, width } = Dimensions.get("window");

type Props = {
  title: string,
  onPress: () => void
};

export default class SDButton extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    //refs: PropTypes.object.isRequired,
    //navigator: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.onPressAction.bind(this);
  }
  state = {
    _isSelect: false,
    _isClicked: false,
    timeout: 1000,
    data: null,
    index: 0,
    _isSelectObj: {},
    _selectBtnStyleObj: {},
  };
  onPressAction = () => {

    if (!this.state._isClicked) {
      this.setState({
        _isSelect: !this.state._isSelect
        //_isClicked: true,
      }, async () => {
        //console.log("typeof this.props.onPress===", typeof this.props.onPress)
        if(typeof this.props.onPress === 'function') {
          const qq = await this.props.onPress(this.state._isSelect ? this.props.title : "", this.state.data, this.state.index);

          //如果返回promise为false表示取消选择
          if(typeof qq == "boolean" && qq === false){
            //console.log("qq===", qq)
            setTimeout(()=>{
              this.setState({
                _isSelect: false,
                _selectStyleObj: {},
                _selectBtnStyleObj: {},
              });
              //console.log("qq===_isSelect", this.state._isSelect)
            }, 400)
          }
        }
      }
    );
      // setTimeout(()=>{
        //console.log("onPressAction === ", this.props.title, this.state._isSelect)
      // }, 100)

      /*setTimeout(() => {
        this.setState({
          _isClicked: false,
        });
      }, this.state.timeout)*/
    }
  };

  componentWillMount() {
    const { isSelect, disabled, timeout, data, index, outerSelect,
      selectStyle,
      selectBtnStyle, } = this.props;
    const _isSelect = typeof isSelect === "boolean" ? isSelect : false;

    //是否从外部控制按钮选择状态
    let __isSelect = this.state._isSelect;
    if(typeof outerSelect === 'boolean'){
      __isSelect = outerSelect
    }
    const _selectStyleObj = __isSelect ? selectStyle : {};
    const _selectBtnStyleObj = __isSelect ? selectBtnStyle : {};

    this.setState({
      _isSelect: _isSelect,
      _isClicked: disabled,
      timeout: timeout,
      data: data,
      index: index,
      _selectStyleObj: _selectStyleObj,
      _selectBtnStyleObj: _selectBtnStyleObj,
    });
  }

  componentWillReceiveProps(nextProps){
    const { outerSelect, title } = nextProps;
    const { selectStyle, selectBtnStyle, } = this.props;
    if(outerSelect != this.props._isSelect){

      const _selectStyleObj = outerSelect ? selectStyle : {};
      const _selectBtnStyleObj = outerSelect ? selectBtnStyle : {};
      //console.log("componentWillReceiveProps === ", title, outerSelect)
      this.setState({
        _isSelect: outerSelect ? true : false,
        _selectStyleObj: _selectStyleObj,
        _selectBtnStyleObj: _selectBtnStyleObj,
      })
    }
  }

  render() {
    const {
      style,
      title,
      btnStyle,
      outerStyle,
    } = this.props;

    // _isClicked
    return (
      <TouchableOpacity
        style={[{
          alignSelf: "center",
          flex: -1,
          borderWidth: 0,
          borderColor: '#f00',
          //width: '100%',
          //height: '100%',
         }, outerStyle]}
        disabled={this.state._isClicked ? true : false}
        onPress={this.onPressAction}
        testID={this.props.testID}
      >
        <View
          style={[
            {
              height: CSS.pixel(80, true),
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 0,
              borderColor: '#f00',
            },
            style,
            this.state._selectStyleObj
          ]}
        >
          {typeof title === "function" ? (
            title()
          ) : (
            <IntlText
              style={[
                {
                  //backgroundColor: '#f00',
                  alignSelf: 'center',
                  borderWidth: 0,
                  borderColor: "#f00",
                },
                btnStyle,
                this.state._selectBtnStyleObj
              ]}
              title={title ? title : null}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

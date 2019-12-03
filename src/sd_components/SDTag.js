/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Dimensions, Alert } from "react-native";
import PropTypes from "prop-types";
//import IntlText from "./IntlText";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import SDButton from "@sd_components/SDButton";

// 获取手机屏幕的大小
//const { height, width } = Dimensions.get("window");

type Props = {
  tags: object,
  onPress: () => void
};

export default class SDTag extends PureComponent<Props> {
  props: Props;
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };

  state = {
    isMultiple: true,
    selectValues: [],
    selectIndex: [],
    tags: [],
  };

  resetSelect(){
    let newSelectIndex=[...this.state.selectIndex];
    newSelectIndex.fill(false);
    this.setState({selectIndex:newSelectIndex});
  }

  onPressChoose = (title, data, index) => {
    let newSelectIndex=[...this.state.selectIndex];
    if (this.state.isMultiple) {
      if (!this.state.selectValues.includes(title)) {
        this.state.selectValues.push(title);
        newSelectIndex[index] = true;
        this.setState({selectIndex:newSelectIndex});
      } else {
        this.state.selectValues.splice(
          this.state.selectValues.findIndex((value, index, arr) => {
            return value === title;
          }),
          1
        );
        newSelectIndex[index] = false;
        this.setState({selectIndex:newSelectIndex});
      }
    } else {
      this.setState({selectValues:[]});
      newSelectIndex.fill(false);
      if (title) {
        this.state.selectValues=[title];
        newSelectIndex[index] = true;
        this.setState({selectIndex:newSelectIndex});
      } else {
        this.state.selectValues = [];
        this.setState({selectIndex:newSelectIndex});
      }
    }

    return new Promise((resolve, reject)=>{
      setTimeout(async ()=>{
        //console.log("onPressChoose===", title, data, index)
        const q = await this.props.onPress(this.state.selectValues, data, index, title)
        //如果返回promise为false表示取消选择
        if(typeof q == "boolean" && q === false){
          //setTimeout(async ()=>{
            //console.log("onPressChoose await===", q)
            this.setState({selectValues:[]});
            newSelectIndex.fill(false);
            this.state.selectValues = [];
            this.setState({selectIndex:newSelectIndex});
            resolve(q)
          //}, 200)
        }
        reject(null)
      }, 100)
    })

  };

  componentWillMount() {
    const { isMultiple, tags } = this.props;
    let selectIndex = []
    if(Array.isArray(tags)){
      tags.map((n,i)=>{
        selectIndex[i] = false
      })
    }
    if(typeof isMultiple === 'boolean') {
      this.setState({
        isMultiple: isMultiple,
        selectIndex: selectIndex,
        tags: tags,
      })
    }

  }

  componentDidMount(){
    const { name } = this.props;
    const _name = typeof name === 'string' ? "_SDTags_" + name : "_SDTags"
    this.context.refs[_name] = this;
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isReset == true && nextProps.isReset !== this.props.isReset){
      this.resetSelect()
    }
  }

  render() {
    const { style, tags, tagStyle, tagSelectStyle, btnStyle } = this.props;
    return (
      <View
        style={[{
            marginTop: 0,
            marginBottom: CSS.pixel(30, true),
            padding: 0,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center", //"space-between",
            alignContent: "center", //"space-between"
          }, style]}
      >
        {tags.map((n, i) => {
          return (
            <SDButton
              key={i}
              style={[{
                  borderColor: "#999",
                  borderRadius: 3,
                  borderWidth: 1,
                  //flex: 1,
                  paddingLeft: 20,
                  paddingRight: 20,
                  //paddingTop: 4,
                  //paddingBottom: 4,
                  marginHorizontal: CSS.pixel(15),
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginVertical: CSS.pixel(15, true),
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  //borderColor: '#f00',
                  height: CSS.pixel(70, true),
                }, tagStyle]}
              data={n}
              index={i}
              btnStyle={[{ fontSize: CSS.textSize(30), color: sdStyles.SDFontColorMain }, btnStyle]}
              onPress={this.onPressChoose.bind(this)}
              outerSelect={this.state.selectIndex[i]}
              title={typeof n === 'string' ? n : n.tag}
              isSelect={false}
              selectStyle={[{
                  borderColor: "#999",
                  borderRadius: 3,
                  borderWidth: 1,
                  //flex: 1,
                  paddingLeft: 20,
                  paddingRight: 20,
                  //paddingTop: 4,
                  //paddingBottom: 4,
                  marginHorizontal: CSS.pixel(15),
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  margin: 10,
                  backgroundColor: sdStyles.SDMainColor,
                  borderColor: sdStyles.SDMainColor
                }, tagSelectStyle]}
              selectBtnStyle={[{
                fontSize: CSS.textSize(30),
                color: sdStyles.SDFontColorMain,
              }, btnStyle]}
            />
          );
        })}
      </View>
    );
  }
}

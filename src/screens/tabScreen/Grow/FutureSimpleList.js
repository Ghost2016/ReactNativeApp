/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import store from "@boot/store";
import defaultStyle, { navLightBox } from "@styles";
import { Toast } from "antd-mobile";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
import { navScreen, navRightButton } from "@styles";
//import { getSuitableSize } from "@utils/qiniupic";
import DotSelect from "@sd_components/DotSelect";
//import SDButton from "@sd_components/SDButton";
//import SDCollapse from "@sd_components/SDCollapse";
import SelectButton from "@sd_components/SelectButton";
import SDLine from "@sd_components/SDLine";
import SDRow from "@sd_components/SDRow";
import SDTitle from "@sd_components/SDTitle";
import SDSubtitle from "@sd_components/SDSubtitle";
//import SDEllipsis from "@sd_components/SDEllipsis";
//import { currentJobPlan } from "@src/selectors";
import SchoolDetail from "@src/screens/pushScreen/searchData/tabs/SchoolDetail";
import MajorDetail from "@src/screens/pushScreen/searchData/tabs/MajorDetail";
import JobDetail from "@src/screens/pushScreen/searchData/tabs/JobDetail";
import IndustryDetail from "@src/screens/pushScreen/searchData/tabs/IndustryDetail";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  }
});

type Props = {};

const screenWidth = Dimensions.get("window").width;
const iconArrowYellow = require("@img/grow/growing_btn_click.png")

// 生涯规划查询职位List
class FutureSimpleList extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };
  state={
  }

  componentWillMount(){
    //const { item } = this.props;
    //console.log("item will====", item)
  }

  componentWillReceiveProps(nextProps){

  }

  componentDidMount(){
    //const { target } = this.props;
    //this.context.refs["_FutureListItem_" + target] = this;
  }

  gotoDetail(name, type = "searcher_school", title = "数据解析", id = null){
    //return
    Toast.loading("加载中");
    this.props.actions
      .createRecordAction({
        type: type,
        content: name,
        // 从查询更多直接点击的 不需要出现在搜索历史记录里，但是为tree方便进行收藏
        // 需要保存行业的id
        value: 'tree' + id ? `-${id}` : ''
      })
      .then(res => {
        Toast.hide();
        this.context.refs["__growFutureScreen"].context.navigator.push(
          navScreen("PushScreen", title, {
            passProps: {
              screen: () => {
                if(type.match(/_school/i)) return (
                  <SchoolDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    schoolText={name}
                  />
                )
                if(type.match(/_job/i)) return (
                  <JobDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    jobText={name}
                    isAddTarget={true}
                    title={`${name}职位就业数据报告`}
                  />
                )
                if(type.match(/_major/i)) return (
                  <MajorDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    majorText={name}
                  />
                )
                if(type.match(/_profession/i)) return (
                  <IndustryDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    industryText={name}
                    industryId={id}
                  />
                )
                return (<View />)
              },
              fullScreen: true,
              noScrollView: true
            }
          })
        );
      })
      .catch(err => {});

  }

  //职位详情
  onPressDetail(positionName){
    return new Promise((resolve)=>{
      this.context.navigator.dismissLightBox();
      setTimeout(() => {
        resolve(true)
      }, 400);
    }).then((data)=>{
      //this.context.refs["_growScreen"].onPressDetail(positionName);
      //console.warn("positionName====xx", positionName)
      this.gotoDetail(positionName, "searcher_job", "职位详情");
    })

  }

  render() {
    let { item, captionBefore, captionAfter, type } = this.props;
    //console.log("item future====", item)
    const _captionBefore = typeof captionBefore == "string" ? captionBefore : "";
    const _captionAfter = typeof captionAfter == "string" ? captionAfter : "%";

    return (
        <SDRow
        key={item.id}
        title={()=>{
          return (<View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            //justifyContent: '',
          }}>
                <View style={{
                    maxWidth: CSS.pixel(270),
                  }}>
                  <SDTitle
                    numberOfLines={1}
                    style={{
                      fontSize: CSS.textSize(24),
                      color: sdStyles.SDFontColorMain,
                      textAlign: "left",
                    }}
                  >
                    {item.firstLine}
                  </SDTitle>
                </View>
                <View style={{
                    maxWidth: CSS.pixel(180),
                  }}>
                <SDSubtitle style={{
                    fontSize: CSS.textSize(20),
                    color: sdStyles.SDFontColorSubtitle,
                    textAlign: "left",
                    marginLeft: CSS.pixel(4),
                    position: 'relative',
                    top: CSS.pixel(4, true),
                  }}>
                  {type == "高薪职位" ? `第${item.secondLine}名` : type == "同门经验" ? item.categary : item.secondLine}
                </SDSubtitle>
                </View>
              </View>)
        }}
        titleWidth={450}
        caption={item.y+_captionAfter}
        captionBefore={()=>{
          return (<Text style={{
            fontSize: CSS.textSize(20),
            color: sdStyles.SDFontColorMain,
            fontWeight: 'bold',
          }}>{_captionBefore}</Text>)
        }}
        captionAfter={()=>{
          if(type == "同类去向") return (<Text style={{
            fontSize: CSS.textSize(24),
            color: sdStyles.SDFontColorSubtitle,
            //fontWeight: 'bold',
            marginLeft: CSS.textSize(10),
          }}>{item.n.major}</Text>)
          return null
        }}
        captionStyle={{
          color: sdStyles.SDFontColorMain,
          fontFamily: 'DINCondensedC',
          fontSize: CSS.textSize(30),
          borderWidth: 0,
          borderColor: '#f00',
          position: 'relative',
          top: CSS.pixel(4, true),
        }}
        iconStyle={{
          width: CSS.pixel(140),
          height: CSS.pixel(80, true),
          alignSelf: "center",
          paddingRight: CSS.pixel(30),
        }}
        iconSource={iconArrowYellow}
        onPress={this.onPressDetail.bind(this, item.firstLine)}
        emptyIconStyle={{
          width: CSS.pixel(20),
          height: CSS.pixel(20, true)
        }}
        style={{
          //borderBottomWidth: 1,
          //borderBottomColor: sdStyles.SDHelperColorline,
          borderWidth: 0,
          borderColor: '#f00',
          borderRadius: 0,
          alignSelf: 'center',
          width: CSS.pixel(610),
          height: CSS.pixel(120, true),
          marginVertical: CSS.pixel(15, true),
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3
          },
          shadowRadius: 5,
          shadowOpacity: 0.05,
          elevation: 4,
          paddingTop: CSS.pixel(0, true),
        }}
      />
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //userBaseInfo: getUserBaseInfo(state),
}))(FutureSimpleList);

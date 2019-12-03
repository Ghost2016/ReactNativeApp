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
import SearchSimpleListNoCollapse from "./SearchSimpleListNoCollapse";
import MajorDetail from "@src/screens/pushScreen/searchData/tabs/MajorDetail";
import { NULL_PAGE_RESULTS } from "@src/nullObjects"

import {
  searchMajorDataBList,
  searchMajorDataCList,
  searchMajorDataMList,
  searchMajorDataDList,
  searchPositionDataList,
  searchSubPositionDataList,
 } from "@src/selectors";
import SDRefreshList from "@sd_components/SDRefreshList";

// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  }
});

type Props = {};

const iconArrowDown = require("@img/home/home_ico_list_right.png")
const iconArrowRight = require("@img/home/home_ico_list_down.png")

// 资料查询List
class SearchSimpleList2 extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };
  state={
    isCollapse: false,
  }

  onPressAction(title, data){
    //console.log("onPressAction", title, data)
    if(this.props.isCollapse){
      this.setState({
        isCollapse: !this.state.isCollapse,
      })
    }
    this.props.onPress(title, data);
  }

  componentWillMount(){
    //const { item } = this.props;
    //console.log("item will====", item)
  }

  componentWillReceiveProps(nextProps){
    //
    //nextProps[nextProps.searchListName][this.props.item.name]
    let temp = null
    if(nextProps.searchListName && nextProps[nextProps.searchListName]) temp = nextProps[nextProps.searchListName];
    if(temp && temp[this.props.item.name] && temp[this.props.item.name].results.length == 0){
      //console.log("temp[this.props.item.name] length=0", this.props.item.name, temp)
      this.setState({
        isCollapse: false,
      })
    } else if(temp && !temp[this.props.item.name]){
      //console.log("temp[this.props.item.name] null", this.props.item.name, temp)
      this.setState({
        isCollapse: false,
      })
    }
  }

  componentDidMount(){
    //const { target } = this.props;
    //this.context.refs["_FutureListItem_" + target] = this;
  }

  //职位详情
  onPressDetail(positionName){
    return new Promise((resolve)=>{
      this.context.navigator.dismissLightBox();
      setTimeout(() => {
        resolve(true)
      }, 400);
    }).then((data)=>{
      this.context.refs["_growScreen"].onPressDetail(positionName);
    })

  }

  onPressMajorDetailAction(title, item){
    console.log("onPressMajorDetailAction===", title, item)
    return
  }

  onPressSubPositionAction(title, item){
    this.props.onPress(title, item)
  }

  onPressDetailPosition1(title, item){
    console.log("onPressDetailPosition2===xxx", title, item)
  }

  render() {
    let { item, titleStyle, subTitleStyle, rowStyle, isCustomizedSearchListName } = this.props;
    //console.log("item future====", item)
    return (
        <View>
            <SDRow
                key={item.id}
                data={item}
                scrollViewName={this.props.scrollViewName}
                scrollToMe={(this.props.isCollapse && this.props.scrollViewName) ? true : false}
                title={()=>{
                    return (<View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        borderWidth: 0,
                        borderColor: '#f00',
                        position: 'relative',
                        top: Platform.OS == "android" ? CSS.pixel(-4, true) : CSS.pixel(-4, true),
                    }}>
                        {this.props.isCollapse ? <Image source={this.state.isCollapse ?iconArrowRight : iconArrowDown} style={{
                                marginRight: CSS.pixel(19),
                                position: 'relative',
                                top: this.state.isCollapse ? CSS.pixel(14, true) : CSS.pixel(6, true),
                                borderWidth: 0,
                                borderColor: '#f00',
                            }} /> : null}
                        <View style={{
                            maxWidth: CSS.pixel(500),
                            borderWidth: 0,
                            borderColor: '#f00',
                        }}>
                            <Text
                                numberOfLines={1}
                                style={[{
                                fontSize: CSS.textSize(28),
                                color: sdStyles.SDFontColorMain,
                                //fontWeight: '300',
                            }, titleStyle]}>
                                {item.name}
                            </Text>
                        </View>
                    </View>)
                }}
                titleWidth={450}
                rowHeight={CSS.pixel(84, true)}
                caption=""
                subtitle=""
                onPress={this.onPressAction.bind(this)}
                style={{
                borderTopWidth: 1,
                borderTopColor: sdStyles.SDHelperColorline,
                borderWidth: 0,
                borderColor: '#f00',

                }}
                noIcon={true}
                emptyIconStyle={this.props.emptyIconStyle}
            />
            {(this.state.isCollapse && this.props.searchListName) ? <SDRefreshList
              style={{
                borderWidth: 0,
                borderColor: '#f00',
                width: width,
                flex: 1,
                //height: CSS.pixel(500, true),
                marginTop: CSS.pixel(0, true),
              }}
              keyName={item.name}
              isCustomizedSearchListName={isCustomizedSearchListName}
              searchList={this.props.customizedSearchListName ? this.props[this.props.customizedSearchListName] : (this.props[this.props.searchListName] && this.props[this.props.searchListName][item.name]) ? this.props[this.props.searchListName][item.name] : NULL_PAGE_RESULTS}
              listItem={item => {
                if(!isCustomizedSearchListName) return <SearchSimpleListNoCollapse
                    keyExtractor={item => item.id + ""}
                    key={item.id}
                    item={item}
                    isCollapse={this.props.params ? false : true}
                    onPress={this.props.params ? this.onPressSubPositionAction.bind(this) : this.onPressMajorDetailAction.bind(this)}
                    emptyIconStyle={(!rowStyle && this.props.params) ? {
                      width: CSS.pixel(70),
                      height: CSS.pixel(30, true),
                      borderWidth: 0,
                      borderColor: '#F00',
                    } : rowStyle ? {
                      width: CSS.pixel(0),
                      height: CSS.pixel(30, true),
                      borderWidth: 0,
                      borderColor: '#F00',
                    } : {
                      width: CSS.pixel(30),
                      height: CSS.pixel(30, true),
                      borderWidth: 0,
                      borderColor: '#F00',
                    }}
                    titleStyle={!this.props.params ? {
                      fontWeight: sdStyles.SDFontMedium,
                    } : subTitleStyle}
                    rowStyle={{
                      marginLeft: CSS.pixel(122),
                      borderWidth: 0,
                      borderColor: '#F00',
                    }}
                  />;

                  if(isCustomizedSearchListName) return <SearchSimpleList
                  searchListName={"searchSubPositionDataList"}
                  actionName="getPositionListAction"
                  levelName=""
                  reducerTypeName={"SEARCHSUBPOSITIONDATA"}
                  keyExtractor={item => item.id + ""}
                  key={item.id}
                  item={item}
                  isCollapse={true}
                  params={{
                    parent_id: item.id,
                    page: 1,
                    size: 40,
                  }}
                  onPress={this.onPressDetailPosition1.bind(this)}
                  subTitleStyle={{
                    fontSize: CSS.textSize(28),
                    color: sdStyles.SDFontColorSubtitle,
                  }}
                  emptyIconStyle={{
                    width: CSS.pixel(76),
                    height: CSS.pixel(30, true),
                    borderWidth: 0,
                    borderColor: '#F00',
                  }}
                  titleStyle={{
                    fontWeight: sdStyles.SDFontMedium,
                  }}
                  rowStyle={{
                    marginLeft: CSS.pixel(72),
                  }}
                />;
              }}
              actionName={this.props.customizedActionName ? this.props.customizedActionName : this.props.actionName}
              params={this.props.customizedParams ? this.props.customizedParams : this.props.params ? this.props.params : {
                level: this.props.levelName,
                level1: item.name,
                page: this.state.page,
                size: this.state.size,
              }}
              reducerType={this.props.customizedReducerTypeName ? this.props.customizedReducerTypeName : this.props.reducerTypeName}
            /> : null}
        </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //userBaseInfo: getUserBaseInfo(state),
  searchMajorDataBList: searchMajorDataBList(state),
  searchMajorDataCList: searchMajorDataCList(state),
  searchMajorDataMList: searchMajorDataMList(state),
  searchMajorDataDList: searchMajorDataDList(state),
  searchSubPositionDataList: searchSubPositionDataList(state),
  searchPositionDataList: searchPositionDataList(state),
}))(SearchSimpleList2);

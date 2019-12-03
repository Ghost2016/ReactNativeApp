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
  TouchableOpacity,
  FlatList,
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
import SDImage from "@sd_components/SDImage";
//import { currentJobPlan } from "@src/selectors";
import MajorDetail from "@src/screens/pushScreen/searchData/tabs/MajorDetail";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  }
});

type Props = {};

const iconArrowDown = require("@img/home/home_ico_list_right.png")
const iconArrowRight = require("@img/home/home_ico_list_down.png")

// 资料查询List
class SearchSimpleListNoCollapse extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    console.log("SearchSimpleListNoCollapse===", props)
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
  };
  state={
      isCollapse: false,
  }

  onPressAction(title, data){
    console.log("NoCollapse onPressAction", title, data)
    if(data.list){
        this.setState({
            isCollapse: !this.state.isCollapse,
        })
    }
    this.props.onPress(title, data);
  }

  gotoDetail(name, type = "searcher_school", title = "数据解析", id = null){
    //return
    Toast.loading("加载中");
    this.props.actions
      .createRecordAction({
        type: type,
        content: name,
        // 从查询更多直接点击的 不需要出现在搜索历史记录里，但是为tree方便进行收藏
        value: 'tree' + id ? `-${id}` : ''
      })
      .then(res => {
        Toast.hide();
        this.context.navigator.push(
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
                  />
                )
                if(type.match(/_major/i)) return (
                  <MajorDetail
                    is_liked={res.results.is_liked}
                    id={res.results.id}
                    type={res.results.type}
                    degreeName={this.props.levelName}
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

  onPressSubAction(title, item){
    console.log("onPressSubAction", title, item)
    this.gotoDetail(item.name, "searcher_major", "数据解析");
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

  renderSubRow(_row) {
    const row = _row.item;
    return (
      <SDRow
        key={row.id}
        data={row}
        title={()=>{
            return (<Text style={{
                fontSize: CSS.textSize(26),
                color: sdStyles.SDFontColorSubtitle,
            }}>
                {row.name}
            </Text>)
        }}
        titleWidth={450}
        rowHeight={CSS.pixel(84, true)}
        caption=""
        subtitle=""
        onPress={this.onPressSubAction.bind(this)}
        style={{
          borderTopWidth: 1,
          borderTopColor: sdStyles.SDHelperColorline,
          borderWidth: 0,
          borderColor: '#f00',
        }}
        emptyIconStyle={{
            width: CSS.pixel(0),
            height: CSS.pixel(0, true)
        }}
        noIcon={true}
      />
    );
  }


  render() {
    let { item, titleStyle, rowStyle } = this.props;
    console.log("item future no collapase====", item, this.props)
    return (
        <View>
            <SDRow
                key={item.id}
                data={item}
                title={()=>{
                    return (<View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        paddingLeft: this.props.isCollapse ? CSS.pixel(45) : CSS.pixel(0),
                    }}>
                        {this.props.isCollapse ? <SDImage source={(this.state.isCollapse && item.list) ? iconArrowRight : iconArrowDown} style={{
                                //marginRight: CSS.pixel(19),
                                //marginLeft: CSS.pixel(75),
                                position: 'relative',
                                top: CSS.pixel(-6, true),
                                borderWidth: 0,
                                borderColor: '#f00',
                                width: 25,
                                height: 25,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }} imgStyle={{
                                width: (this.state.isCollapse && item.list) ? CSS.pixel(36) : CSS.pixel(25),
                                height: (this.state.isCollapse && item.list) ? CSS.pixel(13, true) : CSS.pixel(25),
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }} /> : null}
                        <View style={{
                            maxWidth: CSS.pixel(400),
                        }}>
                            <Text
                                numberOfLines={1}
                                style={[{
                                fontSize: CSS.textSize(28),
                                color: sdStyles.SDFontColorMain,
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
                style={[{
                borderTopWidth: 1,
                borderTopColor: sdStyles.SDHelperColorline,
                borderWidth: 0,
                borderColor: '#f00',

                }, rowStyle]}
                noIcon={true}
                emptyIconStyle={this.props.emptyIconStyle}
            />
            {(item.list && this.state.isCollapse) ? <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={item.list.filter((n,i)=>{
                          return n.level == this.props.levelName || ""
                        })}
                        renderItem={this.renderSubRow.bind(this)}
                        style={{
                            //borderBottomWidth: 1,
                            //borderBottomColor: sdStyles.SDHelperColorline,
                            borderWidth: 0,
                            borderColor: '#f00',
                            marginLeft: CSS.pixel(126),
                        }}
                        /> : null}
        </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  //userBaseInfo: getUserBaseInfo(state),
}))(SearchSimpleListNoCollapse);

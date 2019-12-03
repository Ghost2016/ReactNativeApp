import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  TextInput
} from "react-native";
import { Toast } from 'antd-mobile';
import PropTypes from "prop-types";
import connectWithActions from "../../../connectWithActions";
import { CSS } from "../../../common/SDCSS";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navScreen, dismissLightBox } from "../../../styles";
import SDKeyboardSpacer from "../../../common/SDKeyboardSpacer";
import { isIphoneX } from "../../../utils/iphonex";

// 职么课堂-提示评价课程弹窗
class CourseCommentLightBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        currScore: 0,
        leftCommentTextNum: 0,
        commentText: "",
        isEdited: false
    };
  }

  commentOnPress() {
    if(this.state.currScore <= 0) {
        Toast.info("请评分", 1)
        return;
    }
    this.props.actions.addCourseCommentAction({
        id: this.props.liveData.id,
        score: this.state.currScore,
        content: this.state.commentText
      }).then(res => {
        if (res.status == 'ok') {
          dismissLightBox();
          Toast.success("评论成功", 1);
          // 课程详情页面也要更新
          this.props.getDetailThis && this.props.getDetailThis().fetNewData(true);
        } else {
          Toast.fail("评论出错啦", 1);
        }
      }).catch(err => {
        Toast.fail("评论出错啦", 1);
      })
  }

  render() {
    return (
        <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
            <View style={{flex: 1}}></View>
            <View style={{height: CSS.pixel(682)}}>
                <View style={{position: 'absolute', height: 300, left: 0, top: CSS.pixel(50), right: 0, backgroundColor: '#fff', zIndex: -1}}></View>
                <View style={{backgroundColor: '#fff', height: CSS.pixel(88), borderRadius: CSS.pixel(20), justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: '#333', fontSize: CSS.textSize(30), lineHeight: CSS.pixel(42), fontWeight: '500'}}>课程评论</Text>
                
                    <SDTouchOpacity style={{
                        position: 'absolute',
                        right: CSS.pixel(18),
                        top: CSS.pixel(18),
                        width: CSS.pixel(56),
                        height: CSS.pixel(55),
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => {
                        dismissLightBox();
                    }}>
                        <Image source={require("@img/imchat/pay/btn_close.png")}/>
                    </SDTouchOpacity>
                </View>
                <View style={{backgroundColor: '#eee', height: 1, width:'100%'}}></View>
                <View style={{flex: 1}}>
                    <View style={{paddingHorizontal: CSS.pixel(28), paddingVertical: CSS.pixel(32),backgroundColor: '#fff'}}>
                        <View>
                            <Text style={{color: '#666', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40)}}>评分</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: CSS.pixel(12), marginBottom: CSS.pixel(6)}}>
                        {[1, 2, 3, 4, 5].map((c, index) => {
                            let score = parseInt(this.state.currScore);
                            return (
                                <SDTouchOpacity onPress={() => {
                                this.setState({
                                    currScore: c
                                })
                                }} key={index + ""} style={{marginRight: CSS.pixel(43), padding: 0, left: -1}}>
                                <Image
                                    source={
                                    c <= score
                                        ? require("@img/imchat/course/evaluate_ico_yellow.png")
                                        : require("@img/imchat/course/evaluate_ico_gray.png")
                                    }
                                />
                                </SDTouchOpacity>
                            );
                            })}
                        </View>
                    </View>

                    <View style={{paddingHorizontal: CSS.pixel(30)}}>
                        <View style={{backgroundColor: '#f3f3f3', height: 1}}></View>
                    </View>
                    
                    <View style={{paddingHorizontal: CSS.pixel(28), paddingVertical: CSS.pixel(32), flex: 1, backgroundColor: '#fff'}}>
                        <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, justifyContent: 'center'}}>
                            <Text style={{color: '#666', fontSize: CSS.textSize(28), lineHeight: CSS.pixel(40)}}>评论</Text>
                        </View>
                        <View style={{justifyContent: 'center'}}>
                            <Text style={{color: '#666', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>{(150 - this.state.leftCommentTextNum) >= 0 ? (150 - this.state.leftCommentTextNum) : 0}字</Text>
                        </View>
                        </View>
                        <View style={{marginTop: CSS.pixel(16), flexWrap: 'wrap'}}>
                        <TextInput ref="textInput" autoCapitalize="none" autoCorrect={false} enablesReturnKeyAutomatically={true} returnKeyType="default" returnKeyLabel="换行" onChangeText={(t) => {
                            this.setState({
                                isEdited: true,
                                commentText: t.slice(0, 150),
                                leftCommentTextNum: t.length
                            });
                            if(t.length > 150) {
                                Toast.info("已超出字数限制");
                            }
                        }} multiline={true} numberOfLines={10} value={this.state.commentText} underlineColorAndroid="transparent" placeholder="课程讲解如何，是否有收获？" style={{textAlignVertical: 'top', padding: 0, paddingBottom: CSS.pixel(30)}}/>
                        </View>
                    </View>
                    
                    <SDTouchOpacity onPress={this.commentOnPress.bind(this)} style={{backgroundColor: SDMainColor, justifyContent: 'center', alignItems: 'center', height: CSS.pixel(80)}}>
                        <Text style={{color: '#333', fontSize: CSS.textSize(32), lineHeight: CSS.pixel(44), fontWeight: '500'}}>提交</Text>
                    </SDTouchOpacity>
                </View>
            </View>
            {
                <SDKeyboardSpacer onToggle={open => {
                    if(open) {
                        setTimeout(() => {
                            this.refs["textInput"].clear();
                        }, 100);
                    }
                }} topSpacing={isIphoneX() ? -34 : 0} /> 
            }
        </View>
    );
  }
}

export default connectWithActions((state, props) => ({
    user: state.user
  }))(
    CourseCommentLightBox
);
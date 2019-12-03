import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, Text, Input } from '@tarojs/components'

import imgMsgLineLeft from '../../images/suanxinzi/salary_pic_box1_left@2x.png'
import imgMsgLineLeft2 from '../../images/suanxinzi/salary_pic_box2_left@2x.png'
import imgMsgLineRight from '../../images/suanxinzi/salary_pic_box1_right@2x.png'
import imgMsgLineRight2 from '../../images/suanxinzi/salary_pic_box2_right@2x.png'

import './Msgbox.less'

export default class MsgboxMale extends Component {

    constructor(){
        super(...arguments)
        this.state = {
          platform: '',
        }
    }

    componentWillMount () {
      /* Taro.showShareMenu({
        withShareTicket: true
      }) */
      Taro.getSystemInfo({
        success: (res) => {
          if(res.platform == "devtools"){
              this.setState({
                platform: 'pc'
              });
          }else if(res.platform == "ios"){
              this.setState({
                platform: 'ios'
              });
          }else if(res.platform == "android"){
              this.setState({
                platform: 'android'
              });
          }
        }
      })
      //setTimeout(() => {
        //console.log("platform", this.state.platform)
        /* Taro.showModal({
          title: '错误',
          content: this.state.platform,
          showCancel: false
        }) */
      //}, 2000);
    }

    render() {
      const directionClass = this.props.direction == "left" ? "left":"right";
      const floatRightClass = this.props.direction == "left" ? "":"float-right";
      //console.log("directionClass", directionClass, this.props)
      return (
        <View className={`page-row-line ${directionClass}`}>
            {this.props.direction == "left" ? <View className={this.props.postData.data.gender=="男"?"page-row-avator male":"page-row-avator female"}></View> : null}
            <View className={`msg-line ${directionClass} ${floatRightClass}`}>
              <Image className={this.props.direction == "left" ? "msg-line-left" : "msg-line-left2"} src={this.props.direction == "left" ? imgMsgLineLeft:imgMsgLineLeft2} />
              <View className={this.state.platform == "android" ? "msg-line-middle-android" : "msg-line-middle"}>
                {!Array.isArray(this.props.n2) ? <Text className="page-row-title title">{this.props.n2}</Text> : this.props.n2.map((nn,ii)=>{
                  return (<Text key={ii} className="page-row-title title tiny">{nn}</Text>)
                })}
                {this.props.data[9].s[this.props.i2] ? <Text className="page-row-title subTitle">{this.props.data[9].s[this.props.i2]}</Text> : null}
              </View>
              <Image className={this.props.direction == "left" ? "msg-line-right":"msg-line-right2"} src={this.props.direction == "left" ? imgMsgLineRight : imgMsgLineRight2} />
            </View>
            {this.props.direction == "right" ? <View className={this.props.postData.data.gender=="男"?`page-row-avator male ${floatRightClass}`:`page-row-avator female ${floatRightClass}`}></View> : null}
        </View>
      );
    }
  }



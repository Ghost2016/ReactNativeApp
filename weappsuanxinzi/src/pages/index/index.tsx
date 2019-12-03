import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

//import { add, minus, asyncAdd } from '../../actions/counter'

import './index.less'

import mainPic from '../../images/suanxinzi/salary_pic_banner@2x.png'
import btnStart from '../../images/suanxinzi/salary_btn_start@2x.png'
import iconHand from '../../images/suanxinzi/salary_ico_hand@2x.png'

/* @connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  }
})) */

class Index extends Component {
  config = {
    navigationBarTitleText: '算薪资'
  }

  constructor () {
    super(...arguments)

    this.state = {
      shareTicket: '',
    }
  }

  componentWillReceiveProps (nextProps) {
    //console.log(this.props, nextProps)
  }

  componentWillMount () {
    //console.log('componentWillMount', this.$router.params)
    Taro.showShareMenu({
      withShareTicket: true,
    }).then(res => {
      console.log("showShareMenu", res)
      /* if(res.shareTickets){
        Taro.showModal({
          title: 'showShareMenu ok！',
          content: res.shareTickets[0],
          showCancel: false
        })
      } */
    })

  }

  componentWillUnmount () {
    //console.log("componentWillUnmount", this.$router.params)
  }

  onShareAppMessage = (res) => {
    console.log("onShareAppMessage", res)
    if(res.from && res.from === "menu"){
      //
    }
    return {
      title: '算薪资',
      path: 'pages/index/index',
      //shareTicket: 1,
    }
  }

  componentDidShow () {

    // 通过转发入口进来获取到的数据
    if (this.$router.params.shareTicket) {
      /* Taro.getShareInfo({ this.$router.params.shareTicket }).then(res => {
        console.log('getShareInfo', res)
      }) */

    }

    //console.log('componentDidShow', this.$router.params)
    //console.log("getShareInfo wx", Taro.onShareAppMessage)
    /* wx.onShareAppMessage().then(res => {
      console.log("onShareAppMessage", res)
    }) */

    /* if(this.state.shareTicket) Taro.getShareInfo({
      shareTicket: this.state.shareTicket
    }).then(res => {
      console.log("getShareInfo", res)
    }) */
    /* Taro.login().then(res=>{
        console.log('login ok！', res)
        Taro.getUserInfo({
          withCredentials:true,
        }).then(res2 => {
          console.log('getUserInfo ok！', res2)
          Taro.showModal({
            title: 'getUserInfo ok！',
            content: 'res2',
            showCancel: false
          })
          //const simpleUser = res.userInfo
          //console.log("simpleUser", simpleUser)
        }).catch(res3 => {
          console.log('getUserInfo failed！', res3)
          Taro.showModal({
            title: 'getUserInfo failed！',
            content: 'res3',
            showCancel: false
          })
        })
    }).catch(res0 => {
          console.log('login failed！', res0)
          Taro.showModal({
            title: 'login failed！',
            content: 'res0',
            showCancel: false
          })
    }) */
    // 查看是否授权
    /* Taro.getSetting({
      success(res) {
        console.log('getSetting ok！', res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          Taro.getUserInfo({
            success(res) {
              const userInfo = res.userInfo
              const nickName = userInfo.nickName
              const avatarUrl = userInfo.avatarUrl
              const gender = userInfo.gender // 性别 0：未知、1：男、2：女
              const province = userInfo.province
              const city = userInfo.city
              const country = userInfo.country
              console.log('res.userInfo ok！', res.userInfo)
            }
          })
        }
      }
    }) */

    /* Taro.login({
      success(res) {
        if (res.code) {
          // 用户登录凭证（有效期五分钟
          console.log('登录ok！', res.code)
          Taro.request({
            method: 'POST',
            url: `https://server-beat.zhimekaimen.com/api/sd/v1/social/auth/`,
            data: {
              code: res.code
            }
          }).then(data => {
            console.log('authorization ok！', data)
            //openid:"oBCM75L7w5cFP7z6KpnL744ny32s"
            //session_key:"96rCZKFb4khbeteKTqzOag=="

          })
        } else {
          console.log('登录失败！', res.errMsg)
        }
      }
    }) */
  }

  componentDidHide () { }

  startPlay = (e) => {
    e.stopPropagation()
    /* Taro.showModal({
      title: '错误',
      content: 'res.data.msg',
      showCancel: false
    }) */

    // 跳转到目的页面，打开新页面
    /* Taro.navigateTo({
      url: '/pages/page/path/name'
    }) */

    // 跳转到目的页面，在当前页面打开
    Taro.redirectTo({
      url: '/pages/page1/index'
    })
  }

  onGotUserInfo = (e) => {
    e.stopPropagation()
    console.log("e", e)
    //console.log(e.detail.userInfo)
    //console.log(e.detail.rawData)
    Taro.showModal({
      title: 'Info',
      content: e.detail.userInfo.toString(),
      showCancel: false
    })
  }
  /*
  <Button
              className='btn-start img'
              //src={btnStart}
              //onClick={this.startPlay}
              openType="getUserInfo"
              lang="zh_CN"
              onGetUserInfo={this.onGotUserInfo}
            />
   */

  render () {
    return (
      <View className='sxz-page'>
        <View className='sxz-container'>
          <View className='align-center'>
            <Image
              className='mainPic img'
              src={mainPic}
              onClick={this.startPlay}
            />
          </View>
          <View className='align-center'>
            <Image
              className='btn-start img'
              src={btnStart}
              onClick={this.startPlay}
            />
            <Image
              className='hand img'
              src={iconHand}
              onClick={this.startPlay}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default Index

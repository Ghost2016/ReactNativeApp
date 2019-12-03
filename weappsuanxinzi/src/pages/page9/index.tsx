//import PropTypes from 'prop-types';
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, Text, Input } from '@tarojs/components'
//import { connect } from '@tarojs/redux'
//import { add, minus, asyncAdd } from '../../actions/counter'
import { letters, positionTags, initPostData, initData } from '../../lib/data'
import './index.less'

import btnGetResult from '../../images/suanxinzi/salary_btn_generate@2x.png'
import resultHeadLeft from '../../images/suanxinzi/salary_pic_tittle_left@2x.png'
import resultHeadMiddle from '../../images/suanxinzi/salary_pic_tittle_middle@2x.png'
import resultHeadRight from '../../images/suanxinzi/salary_pic_tittle_right@2x.png'
import imgBtnPlay from '../../images/suanxinzi/salary_btn_play_again@2x.png'
import imgBtnShare from '../../images/suanxinzi/salary_btn_share@2x.png'

import NumCard from './NumCard'
import MsgboxMale from './MsgboxMale'

/* @connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  }
})) */

class Index extends Component {
  config = {
    navigationBarTitleText: '算薪资-9'
  }

  constructor () {
    super(...arguments)

    this.state = {
      isPredicting: false,
      isShowResult: false,
      platform: '',
      result: {},
      postData : initPostData,
      data : initData,
      pageNum: 9,
      pageTotal: 9,
      pageTitles: ['教育经历信息'],
      city: '',
      position: '',
      positionName: '',
      degree: '',
      constellation: '',
      gender: '',
      bossCallReaction: '',
      lvBagReaction: '',
      school: '',
      college: '',
      major: '',
      isMultiSelect: false,
      cityArr: ['北京','上海','广州','深圳','杭州','成都','重庆','武汉','西安'],
      positionArr: ['产品狗','攻城狮','射鸡湿','运营人猿','市场商务','暖心行政'],
      degreeArr: ['博士真学霸','硕士学问家','本科大法好','专科逆袭王'],
      constellationArr: ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'],
      genderArr: ['安静的美男子','豪迈的萌妹子'],
      bossCallReactionArr: ['妈蛋，肯定又让我加班', '难道工作出什么突发状况了？', '新发现一家不错的餐厅，相约一同前往'],
      lvBagReactionArr: ['默默的称赞', '默不作声，继续做自己的事情', '认真的说：“仿得不赖，哪买的”'],
      inputData: [
        {
          title: '学校',
          ref: 'schoolInput',
          value: '',
          isSelected: false,
        },
        /* {
          title: '学院',
          ref: 'collegeInput',
          value: '',
          isSelected: false,
        }, */
        {
          title: '专业',
          ref: 'majorInput',
          value: '',
          isSelected: false,
        },
      ],
    }
  }

  onShareAppMessage = (res) => {
    console.log("onShareAppMessage", res)
    if(res.from && res.from === "menu"){
      // 跳转到目的页面，在当前页面打开
      /* Taro.redirectTo({
        url: `/pages/index/index`
      }) */
    }
    return {
      title: '算薪资-9',
      path: 'pages/page9/index',
      //shareTicket: 1,
    }
  }

  //小程序与小游戏获取用户信息接口调整，请开发者注意升级。
  //https://developers.weixin.qq.com/community/develop/doc/0000a26e1aca6012e896a517556c01
  componentWillMount () {
    Taro.showShareMenu({
      withShareTicket: true
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
    setTimeout(() => {
      //console.log("platform", this.state.platform)
      /* Taro.showModal({
        title: '错误',
        content: this.$router.params.city.toString(),
        showCancel: false
      }) */
    }, 100);
    //console.log(this.$router.params)
    /* if(this.$router.params.position_name && positionTags.hasOwnProperty(this.$router.params.position)
      && positionTags[this.$router.params.position].includes(this.$router.params.position_name) && this.$router.params.degree && this.state.degreeArr.includes(this.$router.params.degree)
      && this.$router.params.constellation && this.state.constellationArr.includes(this.$router.params.constellation) && this.$router.params.gender && this.state.genderArr.includes(this.$router.params.gender) && this.$router.params.bossCallReaction && this.state.bossCallReactionArr.includes(this.$router.params.bossCallReaction) && this.$router.params.lvBagReactionArr && this.state.lvBagReactionArr.includes(this.$router.params.lvBagReactionArr)
      ){
      this.setState({
        city: this.$router.params.city,
        position: this.$router.params.position,
        positionName: this.$router.params.position_name,
        degree: this.$router.params.degree,
        constellation: this.$router.params.constellation,
        gender: this.$router.params.gender,
        bossCallReaction: this.$router.params.bossCallReaction,
        lvBagReaction: this.$router.params.lvBagReaction,
      })
    } */
    this.setState({
      city: this.$router.params.city || '',
      position: this.$router.params.position || '',
      positionName: this.$router.params.position_name || '',
      degree: this.$router.params.degree || '',
      constellation: this.$router.params.constellation || '',
      gender: this.$router.params.gender == "豪迈的萌妹子" ? '女' : '男',
      bossCallReaction: this.$router.params.bossCallReaction || '',
      lvBagReaction: this.$router.params.lvBagReaction || '',
    })
  }

  componentWillReceiveProps (nextProps) {
    //console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {
    // 通过转发入口进来获取到的数据
    if (this.$router.params.shareTicket) {
      /* Taro.getShareInfo({ this.$router.params.shareTicket }).then(res => {
        console.log('getShareInfo', res)
      }) */
    }
  }

  componentDidHide () { }

  onInput = (item, index, e) => {
    //console.log("input", item, index, e, this.refs)
    if(item.title === "学校"){
      this.setState({
        school: e.target.value
      })
      //if(this.refs.collegeInput) this.refs.collegeInput.focus()
    }/*  else if(item.title === "学院"){
      this.setState({
        college: e.target.value
      })
      //if(this.refs.majorInput) this.refs.majorInput.focus()
    } */ else if(item.title === "专业"){
      this.setState({
        major: e.target.value
      })
    }

  }

  checkResult = (res, key = "status", value = "ok") => {
      return new Promise((resolve, reject)=>{
          if (res && res[key] == value) {
              resolve(res)
          } else {
              let info = "";
              if(res && res.msg && res.msg == "form error" && res.results && res.results.form){
                  info = Object.keys(res.results.form).map((k,i)=>{
                      return res.results.form[k]
                  }).join(" ")
              } else {
                  info = res.msg || "未知请求错误！"
              }
              reject(info)
          }
      })
  }

  prepareResult(res){
    const data = this.state.data;
    console.log("this.state.postData", this.state.postData)
    const gender = this.state.gender.match(/(妹|女)/i)?'女':'男';
    data[9] = {
      t: 'result',
      q: ['我能拿到的月薪'],
      a: ['独/立/'+gender, this.state.positionName, (res.buy_house_year || 10)+'年', ['赶上一年黄金周', '祖国河山随便游']],
      s: ['', '-毕业后从事的职业-', '-不吃不喝在'+this.state.city+'买房-', ''],
      c: '',
    };
    console.log("prepareResult", gender, data[9], res)
    this.setState({
      //page: 10,
      result: res,
      data: data,
      isPredicting: false,
    })

    setTimeout(() => {
      this.setState({
        isShowResult: true,
      })
    }, 1000);
  }

  getResult = (e) => {
    e.stopPropagation()
    if(!this.state.school){
      Taro.showModal({
        title: '错误',
        content: '请输入学校名称！',
        showCancel: false
      })
      return
    }
    /* if(!this.state.college){
      Taro.showModal({
        title: '错误',
        content: '请输入学院名称！',
        showCancel: false
      })
      return
    } */
    if(!this.state.major){
      Taro.showModal({
        title: '错误',
        content: '请输入专业名称！',
        showCancel: false
      })
      return
    }

    if(this.state.isPredicting) return;
    this.setState({
      isPredicting: true,
    })
    Taro.showLoading({
      title: "提交中..."
    })
    //console.log("this.state.bossCallReactionArr", this.state.bossCallReactionArr)
    //console.log("this.state.bossCallReaction", this.state.bossCallReaction)
    const q1Index = this.state.bossCallReactionArr.findIndex(k => k==this.state.bossCallReaction)
    const q2Index = this.state.lvBagReactionArr.findIndex(k => k==this.state.lvBagReaction)
    let q1 = {};
    let q2 = {};
    q1[q1Index] = this.state.bossCallReaction;
    q2[q2Index] = this.state.lvBagReaction;
    let params = {
      data: {
        degree: this.state.degree,
        gender: this.state.gender,
        jobType: this.state.position,
        secondClass: [this.state.positionName, this.state.position],
        city: this.state.city,
        workLength: "1-2",
        scale: "0-50",
        constellation: this.state.constellation,
        src: "img/rw/woman/gcs/5/gcs_5_jn.png",
        school: this.state.school,
        major: this.state.college,
        college: this.state.major,
      },
      ext: {
        q1: q1,
        q2: q2
      }
    };
    //console.log("params", params)
    /* this.setState({
      isPredicting: false,
    })
    return */

    const isTest = false;
    const HOST_SXZ = 'https://sxz.zhimekaimen.com'
    const HOST_SXZ_TEST = 'https://sxz-beat.zhimekaimen.com'
    Taro.request({
      url: `${isTest ? HOST_SXZ_TEST : HOST_SXZ}/salary_predict_pro`,
      data: {
        p: JSON.stringify(params)
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {

      //console.log("res", res.data)
      //console.warn("res", res, this.state.city)
      this.checkResult(res.data, "city", this.state.city).then(res2=>{
        //console.warn("res", res)
        this.prepareResult(res.data);
        Taro.hideLoading();
        //window.scrollTo(0,0);
      }).catch(err=>{
        Taro.hideLoading();
        Taro.showModal({
          title: '出错啦！',
          content: '接口请求失败！',
          showCancel: false
        })
        //this.prepareResult(res);
      })
      this.setState({
        isPredicting: false,
      })
    }).catch(err=>{
      Taro.hideLoading();
      this.setState({
        isPredicting: false,
      })
    })

  }

  onPressPlayAgain = (e) => {
    e.stopPropagation()
    setTimeout(() => {
      // 跳转到目的页面，在当前页面打开
      Taro.redirectTo({
        url: `/pages/index/index`
      })
    }, 1000);
  }

  onPressShare = (e) => {
    e.stopPropagation()
    console.log("onPressShare", 1)

  }

  render () {
    const notShowResultClassName = !this.state.isShowResult ? 'align-center' : 'align-center hide';
    const isShowResultClassName = this.state.isShowResult ? 'align-center' : 'align-center hide';
    //console.log("data", this.state.data)
    return (
      <View className='sxz-page'>
        <View className='sxz-container'>
          <View className={notShowResultClassName} >
            <View className='mainBg' >
              <View className='pageHeader' >
                <Text className='txt header-num'>
                {this.state.pageNum}/{this.state.pageTotal}</Text>
              </View>
              <View className='pageTitle' >
                {this.state.pageTitles.map((item, index) => {
                  return (
                    <View key={index} className='header-title'>
                      <Text className='txt header-title-span'>{item}</Text>
                    </View>
                  )
                })}
              </View>
              <View className='pageContent' >
                {this.state.inputData.map((item, index) => {
                  const letter = letters[index];
                  const innerClass = item.isSelected ? 'inner active' : 'inner'
                  return (
                    <View key={index} className='label one'>
                      <View className='header-letter-long'>
                        <Text className='txt'>{item.title}</Text>
                      </View>
                      <View className='input-layer'>
                        <Input type='text' ref={item.ref} className="input" placeholder={`请输入${item.title}`} placeholderStyle='color:#cccccc;' onInput={this.onInput.bind(this, item, index)}/>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
            <View className='align-center'>
              <Image
                className='btn-get-result img'
                src={btnGetResult}
                onClick={this.getResult}
              />
            </View>
          </View>
          <View className={isShowResultClassName} >
                <View className="mainBg result">
                  <View className="result-head">
                    <View className="result-head-left">
                      <Image className="img" src={resultHeadLeft} />
                    </View>
                    <View className={this.state.platform == "android" ? "result-head-middle-android" : "result-head-middle"}>
                      <Text className="txt">我能拿到的月薪</Text>
                    </View>
                    <View className="result-head-right">
                      <Image className="img" src={resultHeadRight} />
                    </View>
                  </View>

                  <View className="page-row">
                    <NumCard />
                    {parseInt(this.state.result.median || '4500', 10).toString().split("").map((n,i)=>{
                      return (<NumCard key={i} num={parseInt(n, 10)} />)
                    })}
                  </View>

                  {this.state.data[9].a.map((n2,i2)=>{
                    return (i2%2==0) ? (<MsgboxMale
                      key={i2}
                      direction='left'
                      postData={this.state.postData}
                      data={this.state.data}
                      n2={n2}
                      i2={i2}
                      />) : (<MsgboxMale
                        key={i2}
                        direction='right'
                        postData={this.state.postData}
                        data={this.state.data}
                        n2={n2}
                        i2={i2}
                        />)
                  })}

                  <View className="bottom-bg" >
                    <View className="btns-bg">
                      <View className="btn-play">
                        <Image className="img"
                          src={imgBtnPlay}
                          onClick={this.onPressPlayAgain.bind(this)}
                          />
                      </View>
                      <View className="btn-share">
                        {/* <Image className="img"
                          src={imgBtnShare}
                          onClick={this.onPressShare.bind(this)}
                          /> */}
                      </View>
                    </View>
                  </View>

                </View>
          </View>
        </View>
      </View>
    )
  }
}

export default Index


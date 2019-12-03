import React, { PropTypes,
  DeviceEventEmitter } from "react";
import { connect } from "react-redux";
import { action } from "../../redux/action/index.js";
import "./index.less";
import { Row, Col, Input, Button, Tooltip } from 'antd';
import { Config, CSS, isMobile, checkResult,
  openNotificationWithIcon,
  isInWeiXin,
  //setCookie,
  //getCookie,
  wxShare,
  isInQQ,
  //notValidField,
  //_onPressGetCode,
 } from '../../libs/func'
//import ScrollMagic from 'scrollmagic'
import GamePage from './GamePage'
import GamePageNum from './GamePageNum'
import FooterDownload from '../footerDownload/index.js';
import Api from '../../config/apiurl';
import * as HOSTS from '../../../src/config/host';

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const numMoney = require('../images/suanxinzi/salary_pic_¥@2x.png')
const numUp = require('../images/suanxinzi/salary_pic_number_bg_top@2x.png')
const numDown = require('../images/suanxinzi/salary_pic_number_bg_down@2x.png')
const num0 = require('../images/suanxinzi/salary_pic_0@2x.png')
const num1 = require('../images/suanxinzi/salary_pic_1@2x.png')
const num2 = require('../images/suanxinzi/salary_pic_2@2x.png')
const num3 = require('../images/suanxinzi/salary_pic_3@2x.png')
const num4 = require('../images/suanxinzi/salary_pic_4@2x.png')
const num5 = require('../images/suanxinzi/salary_pic_5@2x.png')
const num6 = require('../images/suanxinzi/salary_pic_6@2x.png')
const num7 = require('../images/suanxinzi/salary_pic_7@2x.png')
const num8 = require('../images/suanxinzi/salary_pic_8@2x.png')
const num9 = require('../images/suanxinzi/salary_pic_9@2x.png')

const positionTags = {
  '产品狗' : ['产品经理', '产品总监', '产品助理'],
  '攻城狮' : ['C/C++', 'C#', 'Java', 'Python', 'PHP', 'JavaScript', 'Android', 'iOS', '前端', '后端', '测试', '运维', '项目经理', '架构师', '总监'],
  '射鸡湿' : ['视觉设计','交互设计','平面设计','游戏美术','动画','原画','用研','UI','UE','WEB','APP','总监'],
  '运营人猿' : ['运营专员', '运营总监', '编辑', '主编'],
  '市场商务' : ['销售', '市场推广', '总监'],
  '暖心行政' : ['行政', '人事', '财务', '客服', '总监/经理', '助理']
};

const cityQuestions = {
  //  ['土豪扎堆-羡慕死了，你在深', '圳。除了吸金狂shopping，', '你想在哪个领域深耕？']
  北京: ['烤鸭文青-羡慕死了，你在帝', '都。除了吃烤鸭赏话剧，', '你想在哪个领域深耕？'],
  成都: ['天腐之国-羡慕死了，你在成', '都。除了吃串串逗基友，', '你想在哪个领域深耕？'],
  广州: ['养生胜地-羡慕死了，你在羊', '城。除了游珠江喝早茶，', '你想在哪个领域深耕？'],
  杭州: ['人间天堂—羡慕死了，你在杭', '州。除了游西湖品龙井，', '你想在哪个领域深耕？'],
  上海: ['红酒小资-羡慕死了，你在魔', '都。除了品红酒听JAZZ，', '你想在哪个领域深耕？'],
  深圳: ['土豪扎堆-羡慕死了，你在深', '圳。除了吸金狂shopping，', '你想在哪个领域深耕？'],
  武汉: ['学霸云集-羡慕死了，你在武', '汉。除了啃鸭脖赏樱花，', '你想在哪个领域深耕？'],
  西安: ['千年古都-羡慕死了，你在西', '安，除了逛皇陵忆历史，', '你想在哪个领域深耕？'],
  重庆: ['火锅辣妹-羡慕死了，你在山', '城。除了吃火锅看美女，', '你想在哪个领域深耕？']
};

const _formKeys = ['school','college','major']
const _initPostData = {
  data: {
    degree: "本科",
    gender: "男",
    jobType: "攻城狮",
    secondClass: ["Java", "项目经理"],
    city: "上海",
    workLength: "1-2",
    scale: "0-50",
    constellation: "金牛座",
    src: "img/rw/woman/gcs/5/gcs_5_jn.png",
    school: "",
    major: "",
    college: "",
  },
  ext: {
    q1: {
      "1": "妈蛋，肯定又让我加班！"
    },
    q2: {
      "4": "善意地称赞"
    }
  }
};
let _initData = [
  {
    t: 'singleSelect2city',
    q: ['日照香炉升紫烟', '姐们儿你在哪混圈？'],
    a: [['北京', '上海'], ['广州', '深圳'], ['杭州', '成都'], ['重庆', '武汉'], ['西安']],
    s: [[false, false], [false, false], [false, false], [false, false], [false]],
    c: '',
  },
  {
    t: 'singleSelect2position',
    q: ['土豪扎堆-羡慕死了，你在深', '圳。除了吸金狂shopping，', '你想在哪个领域深耕？'],
    a: [['产品狗', '攻城狮'], ['射鸡湿', '运营人猿'], ['市场商务', '暖心行政']],
    s: [[false, false], [false, false], [false, false]],
    c: '',
  },
  {
    t: 'singleSelect',
    q: ['选择职位标签'],
    a: ['C/C++','C#','Java','Python','PHP','Javascript','Android','iOS','前端','后端','测试','运维','项目经理','架构师','总监'],
    s: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    c: '',
  },
  {
    t: 'singleSelect1degree',
    q: ['英雄莫问出处，', '学历这些都是浮云！'],
    a: [['博士真学霸'], ['硕士学问家'], ['本科大法好'], ['专科逆袭王']],
    s: [[false], [false], [false], [false]],
    c: '',
  },
  {
    t: 'singleSelectIcon',
    q: ['这年头，新朋友认识不问问星','座都不好意思聊天，那你是？'],
    a: ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'],
    i: ['home_ico_Aries','home_ico_Taurus','home_ico_Gemini','home_ico_Cancer','home_ico_Leo','home_ico_Virgo','home_ico_Libra','home_ico_Scorpio','home_ico_Sagittarius','home_ico_Capricorn','home_ico_Aquarius','home_ico_Pisces'],
    s: [false,false,false,false,false,false,false,false,false,false,false,false],
    c: '',
  },
  {
    t: 'singleSelect1gender',
    q: ['正确的自我认识'],
    a: [['安静的美男子'], ['豪迈的萌妹子']],
    s: [[false], [false]],
    c: '',
  },
  {
    t: 'singleSelect1q1',
    q: ['如果BOSS周末给你打电话，', '你的第一反应是'],
    a: [['妈蛋，肯定又让我加班'], ['难道工作出什么突发状况了？'], ['新发现一家不错的餐厅，相约一同前往']],
    s: [[false], [false], [false]],
    c: '',
  },
  {
    t: 'singleSelect1q2',
    q: ['同事今天上班提了一个山寨LV', '的包包，你会'],
    a: [['默默的称赞'], ['默不作声，继续做自己的事情'], ['认真的说：“仿得不赖，哪买的”']],
    s: [[false], [false], [false]],
    c: '',
  },
  {
    t: 'form',
    q: ['教育经历信息'],
    a: ['学校：', '专业：'], //'学院：',
    s: ['', '', ''],
    c: '',
  },
  {
    t: 'result',
    q: ['我能拿到的月薪'],
    a: ['独/立/女', '产品经理', '6年', ['赶上一年黄金周', '祖国河山随便游']],
    s: ['', '-毕业后从事的职业-', '-不吃不喝在成都买房-', ''],
    c: '',
  },
];

let userTotal = {}

document.addEventListener("message", (event) => {

  if(event && event.data){
    userTotal = JSON.parse(event.data);
    //console.log("userTotal", userTotal);
    const school = userTotal && userTotal.school_name
            ? userTotal.school_name
            : ""
    const major = userTotal && userTotal.major_name
            ? userTotal.major_name
            : ""
    const college = userTotal && userTotal.college_name
            ? userTotal.college_name
            : ""
    //console.log("userTotal", school, college, major);
    if(school && college && major) _initData[8].s = [school, college, major];
    //console.log("MessageEvent", _initData[8].s);
  }

}, false);

class GameBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ua: '',
      debug: '',
      keyboardSpace: 0,
      isPredicting: false,
      isDisableChoose: false,
      isInWeixinBrowser: false,
      result: {},
      postData : _initPostData,
      page: 0,
      data: _initData,
      openid: '',
    };
  }
  static contextTypes = {
    router: PropTypes.object.isRequired
  };
  componentDidMount() {

    //获取wx.config 所需 timestamp / nonceStr / signature
    const wxCallBackUrl = document.location.href.toString();
    const shareUrl = `${HOSTS.SHARE}/#/predictSalary`;
    //const wxCallBackUrl = 'http://192.168.100.70:1616/#/predictSalary';
    let wxConfig = {
        debug: false,
        appId: 'wx7a1075b3e0bd819e', // 必填，公众号的唯一标识
        timestamp: '', // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名
        jsApiList: [
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
        ] // 必填，需要使用的JS接口列表
    };
    this.props.getWxJsSignatureAction(wxCallBackUrl, res => {
      //console.warn("getWxJsSignatureAction", res)
      checkResult(res).then(res=>{
        wxConfig.nonceStr = res.results.noncestr;
        wxConfig.timestamp = res.results.timestamp;
        wxConfig.signature = res.results.signature;

        wx.config(wxConfig);
        wx.ready(() => {
          console.log("wx success", wx.updateAppMessageShareData)
          setTimeout(() => {

            const shareData = {
              title: '毕业薪资测算，你能拿多少月薪', // 分享标题
              desc: '未来身价大揭秘，看看你值多少钱', // 分享描述
              link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: `${HOSTS.SHARE}/images/logo.png`, // 分享图标
            };
            wxShare(wx, 'friend', shareData);
            wxShare(wx, 'timeline', shareData);

          }, 2000);

        });
        wx.error(function(res){
          console.warn("wx error", res)
          //openNotificationWithIcon('error', ' 请使用微信访问本页～', '', 3)

        });
      })
    })

    /* DeviceEventEmitter.addListener('keyboardDidShow',(frames)=>{
      if (!frames.endCoordinates) return;
      this.setState({keyboardSpace: frames.endCoordinates.height});
    });
    DeviceEventEmitter.addListener('keyboardWillHide',(frames)=>{
      this.setState({keyboardSpace:0});
    }); */
    /* const animController = new ScrollMagic.Controller();
    const animScene = new ScrollMagic.Scene({
      triggerElement: '#hand', // starting scene, when reaching this element
      offset: 10, // start scene after scrolling for 100px
      duration: 400 // pin the element for 400px of scrolling
    }).setPin('#hand');
    animController.addScene(animScene); */
    //console.warn(animController)
    //if(this.state.page == 0) openNotificationWithIcon('info', '欢迎！点击下面按钮开始测试吧～', '', 3)
    //console.warn("navigator.userAgent", navigator.userAgent)
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
    this.setState({
      ua: navigator.userAgent,
    })

    setTimeout(() => {
      let _data = this.state.data;
      _data[8].s = _initData[8].s;
      //console.log("MessageEvent data", _initData[8].s);
      this.setState({
        data: _data,
      })
    }, 2000);

  }

  onPressStart(){
    //openNotificationWithIcon('info', '开始啦！', '')
    this.setState({
      page: 1,
    })

    /* if(!this.props.showDownload){
      window.addEventListener("message", function(event) {
        console.log("Received post message from native", event);
      }, false);
    } */
  }

  onPressTag(page, row, col, type){
    setTimeout(() => {
      window.scrollTo(0,0);
    }, 1000);
    if(this.state.isDisableChoose) return
    this.setState({
      isDisableChoose: true,
    })
    //console.log("on tag", page, row, col)
    let positions = []
    let dataAll = {}
    let i = 0;
    let data = this.state.data;
    const timeout = 400;
    let value = '';
    let index = 0;
    //openNotificationWithIcon('info', '好的，请稍后～', '', 1)
    if(type.match(/^(singleSelect2|singleSelect1[0-9a-z]+|singleSelect2city|singleSelect2position)$/i)){

      if(data[page] && data[page].s[row] && data[page].s[row].hasOwnProperty(col)){
        if(data[page].s[row][col]){
          //已经选择
          data[page].s[row][col] = false
          data[page].c = ''
          value = data[page].c
          index = row;
        } else {
          //单选需要重设所有状态为false
          data[page].s.map((n, i)=>{
            n.map((n2, i2)=>{
              data[page].s[i][i2] = false
            })
          })
          //set true
          data[page].s[row][col] = true
          data[page].c = data[page].a[row][col]
          value = data[page].c
          index = row;
          setTimeout(() => {
            //下一页
            this.setState({
              page: this.state.page + 1,
              isDisableChoose: false,
            })
            if ( this.state.page + 1 == 9) {
              //get userdata
              window.postMessage("get userdata", "*");
            }
            //if(!this.props.showDownload) window.postMessage("scroll to top", "*");
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 10);
          }, timeout);
        }
        this.setState({
          data: data,
        })
      }

      //动态刷新城市职位数据
      if(type == "singleSelect2city"){
        //初始化城市数据
        i = page + 1;
        if(cityQuestions && this.state.data[i-1].c && cityQuestions[this.state.data[i-1].c]){
            positions = cityQuestions[this.state.data[i-1].c];
            dataAll = this.state.data;
            dataAll[i].q = positions;
            this.setState({
              data: dataAll
            });
        }
      }

      //动态刷新职位数据
      if(type == "singleSelect2position"){
        //初始化职位数据
        i = page + 1;
        if(positionTags && this.state.data[i-1].c && positionTags[this.state.data[i-1].c]){
            positions = positionTags[this.state.data[i-1].c];
            dataAll = this.state.data;
            dataAll[i].a = positions;
            dataAll[i].s = Array.from({ length: positions.length }).fill(false);
            this.setState({
              data: dataAll
            });
        }
      }

    } else if(type.match(/^(singleSelect|singleSelectIcon)$/i)){
      if(data[page] && data[page].s.hasOwnProperty(row)){
        if(data[page].s[row]){
          //已经选择
          data[page].s[row] = false
          data[page].c = ''
          value = data[page].c
        } else {
          //单选需要重设所有状态为false
          data[page].s.map((n, i)=>{
            data[page].s[i] = false
          })
          //set true
          data[page].s[row] = true
          data[page].c = data[page].a[row]
          value = data[page].c
          setTimeout(() => {
            //下一页
            this.setState({
              page: this.state.page + 1,
              isDisableChoose: false,
            })
            if ( this.state.page + 1 == 9) {
              //get userdata
              window.postMessage("get userdata", "*");
            }
            //if(!this.props.showDownload) window.postMessage("scroll to top", "*");
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 10);
          }, timeout);
        }
        this.setState({
          data: data,
        })
      }
    }

    //同步提交数据
    //console.warn(type, value, index)
    let postData = this.state.postData;
    let temp = {}
    if(type == "singleSelect2city"){
      postData.data.city = value;
    }
    if(type == "singleSelect2position"){
      postData.data.secondClass[1] = value;
    }
    if(type == "singleSelect"){
      postData.data.secondClass[0] = value;
    }
    if(type == "singleSelect1degree"){
      postData.data.degree = value;
    }
    if(type == "singleSelectIcon"){
      postData.data.constellation = value;
    }
    if(type == "singleSelect1gender"){
      postData.data.gender = value.match(/(妹|女)/i)?'女':'男';
    }
    if(type == "singleSelect1q1"){
      temp = {}
      temp[index] = value
      postData.ext.q1 = temp;
    }
    if(type == "singleSelect1q2"){
      temp = {}
      temp[index] = value
      postData.ext.q2 = temp;
    }
    //console.warn(postData.data)
    //console.warn(postData.ext)
    this.setState({
      postData: postData,
    })
  }

  _handleKeyPress(index, e){
    /* this.setState({
      debug: (`${e.toString()} ${index}`)
    })
    return */
    if (e.key === 'Enter') {
      if(!this.props.showDownload) window.postMessage("keyboard dismiss", "*");
      if(index == 0){
        setTimeout(() => {
          this.collegeInput.focus();
        }, 100);
      } else if(index == 1) {
        setTimeout(() => {
          this.majorInput.focus();
        }, 100);
      } else if(index == 2) {
        setTimeout(() => {
          //if(!this.props.showDownload) window.postMessage("keyboard dismiss", "*");
          //this.onPressConclude();
          this.majorInput.blur();
        }, 100);
      }

    }
  }

  onFocus = (index, trg, e) => {
    if(isMobile.Android()){
      if(index == 0){
        //window.scrollTo(0, 20);
      }
      if(index == 1){
        window.scrollTo(0, 60);
      }
      /* if(index == 2){
        window.scrollTo(0, 140);
      } */
    }
  }

  onChange = (index, trg, e) => {
    const _trg = trg;
    const data = this.state.data;
    let postData = this.state.postData;
    _trg[index] = e.target.value.trim();
    data[index].s = _trg;
    //console.log("onchange", e.target.value, index, data[index])
    if(index == 0){
      postData.data.school = _trg[index]
    }
    if(index == 1){
      postData.data.college = _trg[index]
    }
    if(index == 2){
      postData.data.major = _trg[index]
    }
    //console.warn(postData.data)
    this.setState({
      data: data,
      postData: postData,
    });
  }

  onPressConclude(){

    const title = this.state.data[8].a;
    const info = this.state.data[8].s;
    if(this.state.data[8].s[0].length <= 0){
      this.schoolInput.focus();
      openNotificationWithIcon('error', '请填写学校名称！', '', 2)
      return
    }
    /* if(this.state.data[8].s[1].length <= 0){
      this.collegeInput.focus();
      openNotificationWithIcon('error', '请填写学院名称！', '', 2)
      return
    } */
    if(this.state.data[8].s[1].length <= 0){
      this.majorInput.focus();
      openNotificationWithIcon('error', '请填写专业名称！', '', 2)
      return
    }
    openNotificationWithIcon('info', '提交中～', '', 3)
    /* setTimeout(() => {
      window.scrollTo(0,0);
    }, 1000); */

    if(this.state.isPredicting) return;
    this.setState({
      isPredicting: true,
    })

    //for test
    /* const data = this.state.data;
    data[9] = {
      t: 'result',
      q: ['我能拿到的月薪'],
      a: ['独/立/'+this.state.postData.data.gender.match(/(妹|女)/i)?'女':'男', this.state.postData.data.secondClass[0], (10)+'年', ['赶上一年黄金周', '祖国河山随便游']],
      s: ['', '-毕业后从事的职业-', '-不吃不喝在'+this.state.postData.data.city+'买房-', ''],
      c: '',
    };
    this.setState({
      page: 10,
      result: {},
      data: data,
    })
    return */

    this.props.suanxinziAction(this.state.postData, res => {

      checkResult(res, "city", this.state.postData.data.city).then(res=>{
        //console.warn("res", res)

        const data = this.state.data;
        const gender = this.state.postData.data.gender.match(/(妹|女)/i)?'女':'男';
        data[9] = {
          t: 'result',
          q: ['我能拿到的月薪'],
          a: ['独/立/'+gender, this.state.postData.data.secondClass[0], (res.buy_house_year || 10)+'年', ['赶上一年黄金周', '祖国河山随便游']],
          s: ['', '-毕业后从事的职业-', '-不吃不喝在'+this.state.postData.data.city+'买房-', ''],
          c: '',
        };
        this.setState({
          page: 10,
          result: res,
          data: data,
          isPredicting: false,
        })

        if(!this.props.showDownload){
          //window.postMessage("scroll to top", "*");
        } else {
          window.scrollTo(0,0);
        }

      }).catch(err=>{
        openNotificationWithIcon('error', '出错啦！', err)
      })
      this.setState({
        isPredicting: false,
      })
    }, err => {
      this.setState({
        isPredicting: false,
      })
    });
  }

  onPressPlayAgain(){
    this.setState({
      postData : _initPostData,
      page: 0,
      data: _initData,
    })
    if(!this.props.showDownload) {
      window.postMessage("reload", "*");
    } else {
      document.location.reload();
    }
  }

  onPressShare(){
    //openNotificationWithIcon('info', '请稍后～', '')
    if(this.props.showDownload){
      //如果是web端
      this.setState({
        isInWeixinBrowser: isInWeiXin(),
      })
    } else {
      //如果是APP端
      window.postMessage("share from weixin", "*");
    }
  }

  onPressHideWeixinShare(){
    this.setState({
      isInWeixinBrowser: false,
    })
  }

  render() {
    //console.warn(letters)
    const { result } = this.state;
    let tmp = 0;
    if(this.props.showDownload && !isInWeiXin() && !isInQQ()){
      return (<div style={{
        display: 'flex',
        position: 'absolute',
        left: 0, right: 0, bottom: 0, top: 0,
        //background: "url(../images/suanxinzi/salary_pic_bg@2x.png)",
        backgroundColor: '#fff',
        width:'100%',
        height:'100%',
        zIndex: 5,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        //overflow: 'hidden',
        paddingBottom: '80px',
        border: '0px #f00 solid',
        textAlign: 'center',
      }}>
        请使用微信或QQ浏览本页
      </div>)
    }
    if (
      (this.props.showDownload && (isInWeiXin() || isInQQ())) || (!this.props.showDownload && (!this.context.router ||
      !this.context.router.location ||
      JSON.stringify(this.context.router.location.query) === "{}"))
    ) {
      return (<div style={{
        display: 'flex',
        position: 'absolute',
        left: 0, right: 0, bottom: 0, top: 0,
        background: "url(../images/suanxinzi/salary_pic_bg@2x.png)",
        backgroundColor: '#fff',
        width:'100%',
        height:'15rem',
        zIndex: 5,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        //overflow: 'hidden',
        paddingBottom: '80px',
        border: '0px #f00 solid',
      }}>
          {this.state.page == 0 ? <GamePage num={0}>
            <div style={{
              display: 'flex',
              width: CSS.px(694),
              height: CSS.px(1030),
              marginTop: '10px',
              alignSelf: 'center',
            }}>

              <a href="javascript:void(0);" style={{
                    display: 'inline-block',
                    width: CSS.px(694),
                    height: CSS.px(1030),
                    border: '0px #f00 solid',
                }}
                onClick={this.onPressStart.bind(this)}
                >
                  <img style={{
                    width: CSS.px(694),
                    height: CSS.px(1030),
                  }} src={require('../images/suanxinzi/salary_pic_banner@2x.png')} />
                </a>
            </div>

            <div style={{
              display: 'flex',
              width: CSS.px(418),
              height: CSS.px(96),
              alignSelf: 'center',
              marginTop: '13px',
            }}>
              <a href="javascript:void(0);" style={{
                    display: 'inline-block',
                    width: CSS.px(418),
                    height: CSS.px(96),
                    border: '0px #f00 solid',
                }} >
                  <img style={{
                    width: CSS.px(418),
                    height: CSS.px(96),
                  }}
                  src={require('../images/suanxinzi/salary_btn_start@2x.png')}
                  onClick={this.onPressStart.bind(this)}
                  />
                </a>
            </div>

            <div style={{
              display: 'block',
              width: CSS.px(86),
              height: CSS.px(98),
              position: 'absolute',
              top: '544px',
              left: '62px',
              zIndex: 10,
            }}>
              <a id="hand" href="javascript:void(0);" style={{
                    display: 'inline-block',
                    width: CSS.px(86),
                    height: CSS.px(98),
                    border: '0px #f00 solid',
                }} >
                  <img style={{
                    width: CSS.px(86),
                    height: CSS.px(98),
                  }}
                  src={require('../images/suanxinzi/salary_ico_hand@2x.png')}
                  onClick={this.onPressStart.bind(this)}
                  />
                </a>
            </div>
            {this.props.showDownload ? <FooterDownload black={true} /> : null}
          </GamePage> : null}

          {this.state.data.map((n,i)=>{

            return this.state.page == i + 1 ? <GamePage num={i + 1}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: CSS.px(702),
                height: this.state.page == 9 ? CSS.px(1246, true) : CSS.px(1146, true),
                marginTop: this.props.showDownload ? '28px' : '2px',
                alignSelf: 'center',
                background: this.state.page==10 ? 'url(../images/suanxinzi/salary_pic_screen_bg@2x.png) 0px 0px no-repeat' : 'url(../images/suanxinzi/salary_pic_answer_bg@2x.png) 10px 0px no-repeat',
                backgroundSize: 'contain',
                border: '0px #f00 solid',
              }}>
                {this.state.page!=10 ? <GamePageNum num={i + 1} total={9} /> : null}
                {this.state.page!=10 ? <div id="page_question" style={{
                    position: 'relative',
                    top: '34px',
                    left: this.props.showDownload ? '18px' : '18px',
                    width: '300px',
                    height: '90px',
                    border: '0px #00f solid',
                    zIndex: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  {this.state.data[i].q.map((n2,i2)=>{
                    return (<span>{n2}</span>)
                  })}
                </div> : null}
                <div id="page_answer" style={{
                position: 'relative',
                top: this.state.page!=10 ? '78px' : '48px',
                left: this.state.page!=10 ? this.props.showDownload ? '18px' : '18px' : '24px',
                //left: '18px',
                width: '300px',
                height: '340px',
                border: '0px #00f solid',
                zIndex: 5,
              }}>

                  {this.state.page == 6 ? <div className="page-row"><span className="page-row-title">你觉得你是</span></div> : null}

                  {(this.state.data[i].t.match(/^(singleSelect2|singleSelect1[0-9a-z]+|singleSelect2city|singleSelect2position)$/i)) ? this.state.data[i].a.map((n2,i2)=>{

                    if(Array.isArray(n2) && n2.length <= 2){
                      return (<div className="page-row">
                          {n2.map((n3, i3)=>{
                              tmp++;
                              return n3 ? <div className={this.state.data[i].t.match(/^singleSelect1/i)?"page-col":"page-col-2"}>
                              <span>{letters[tmp-1]}.</span>
                              <span className="page-text">
                                <span className={this.state.data[i].s[i2][i3]?"page-tag active":"page-tag"} onClick={this.onPressTag.bind(this, i, i2, i3, this.state.data[i].t)}>{n3}</span>
                              </span>
                            </div> : null
                          })}
                        </div>)
                    } else if(typeof n2 == "string") {
                      return null
                    } else {
                      return null
                    }

                  }) : null}

                {(this.state.data[i].t== "singleSelect") ? <div className="page-row">
                        <span className="page-row-title">{this.state.data[i-1].c}</span>
                        {this.state.data[i].a.map((n2,i2)=>{
                            return (<span className={this.state.data[i].s[i2]?"page-tag-small active":"page-tag-small"} onClick={this.onPressTag.bind(this, i, i2, null, this.state.data[i].t)}>{n2}</span>)
                          })}
                  </div> : null}

                {(this.state.data[i].t== "singleSelectIcon") ? <div className="page-row">
                        {/* <span className="page-row-title">我不问，你自己说</span> */}
                        {this.state.data[i].a.map((n2,i2)=>{
                          return (<span className={this.state.data[i].s[i2]?"page-tag-small icon active":"page-tag-small icon"} onClick={this.onPressTag.bind(this, i, i2, null, this.state.data[i].t)}>
                            <span style={{
                              display: 'flex',
                              width: CSS.px(80),
                              height: CSS.px(80),
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                              <img style={{
                                width: CSS.px(80),
                                height: CSS.px(80),
                              }}
                              src={require(`../images/suanxinzi/${this.state.data[i].i[i2]}${this.state.data[i].s[i2]?"_sel":"_nor"}@2x.png`)}
                              />
                            </span>
                            <span className="txt">{n2}</span>
                          </span>)
                          })}
                  </div> : null}

                {(this.state.data[i].t== "form") ? this.state.data[i].a.map((n2,i2)=>{
                      return (
                        <div className="page-row">
                          <span className="page-row-title small">{n2}</span>
                          <div className="form-underline"><Input
                                placeholder=""
                                value={this.state.data[i].s[i2]}
                                onChange={this.onChange.bind(this, i2, this.state.data[i].s)}
                                onFocus={this.onFocus.bind(this, i2, this.state.data[i].s)}
                                maxLength="100"
                                ref={node => this[`${_formKeys[i2]}Input`] = node}
                                onKeyPress={this._handleKeyPress.bind(this, i2)}
                                style={{
                                  display: 'flex',
                                  width: '100%',
                                  marginBottom: '18px',
                                }}
                              /></div>
                      </div>
                    )
                }) : null}

                {(this.state.data[i].t== "result") ? <div style={{
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '0px #00f solid',
                  position: 'relative',
                  left: '-4px',
                }}>
                  <div className="page-row" style={{
                    marginTop: '0px',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      display: 'flex',
                      width: CSS.px(370),
                      height: CSS.px(70),
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '15px',
                    }}>
                      <img style={{
                        width: CSS.px(40),
                        height: CSS.px(70),
                      }}
                      src={require('../images/suanxinzi/salary_pic_tittle_left@2x.png')}
                      />
                      <span style={{
                        display: 'inline-block',
                        background: 'url(/images/suanxinzi/salary_pic_tittle_middle.png) 0 0 repeat-x',
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#333',
                        width: '100%',
                        height: CSS.px(70),
                        lineHeight: '180%',
                      }}>我能拿到的月薪</span>
                      <img style={{
                        width: CSS.px(40),
                        height: CSS.px(70),
                      }}
                      src={require('../images/suanxinzi/salary_pic_tittle_right@2x.png')}
                      />
                    </div>

                  </div>

                  <div className="page-row" style={{
                    marginTop: '6px',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      border: '0px #0ff solid',
                      marginBottom: '10px',
                    }}>
                      <NumCard />
                      {parseInt(result.median || '4500', 10).toString().split("").map((n,i)=>{
                        return (<NumCard num={parseInt(n, 10)} />)
                      })}
                    </div>
                  </div>

                  {this.state.data[i].a.map((n2,i2)=>{
                      if(i2%2==0) return (
                        <div className="page-row left" style={{
                          border: '0px #f00 solid',
                          width: '100%',
                          height: '37px',
                          margin: '5px 5px 14px 5px',
                          padding: '0px 10px',
                        }}>
                          <span className={this.state.postData.data.gender=="男"?"page-row-avator male":"page-row-avator female"}></span>
                          <div className="msg-line" style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                          }}>
                            <img style={{
                              width: CSS.px(30),
                              height: CSS.px(82),
                            }}
                            src={require('../images/suanxinzi/salary_pic_box1_left@2x.png')}
                            />
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'url(/images/suanxinzi/salary_pic_box1_middle.png) 0 0 repeat-x',
                              width: '100%',
                              height: CSS.px(82),
                              padding: '0px 2px',
                            }}>
                              {!Array.isArray(n2) ? <span className="page-row-title title">{n2}</span> : n2.map((nn,ii)=>{
                                return (<span className="page-row-title title tiny">{nn}</span>)
                              })}
                              {this.state.data[i].s[i2] ? <span className="page-row-title subTitle">{this.state.data[i].s[i2]}</span> : null}
                            </div>
                            <img style={{
                              width: CSS.px(10),
                              height: CSS.px(82),
                            }}
                            src={require('../images/suanxinzi/salary_pic_box1_right@2x.png')}
                            />
                          </div>
                      </div>)
                      if(i2%2==1) return (
                        <div className="page-row right" style={{
                          border: '0px #f00 solid',
                          width: '100%',
                          height: '37px',
                          margin: '5px 5px 5px 5px',
                          padding: '0px 10px',
                        }}>
                          <div className="msg-line" style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                          }}>
                            <img style={{
                              width: CSS.px(10),
                              height: CSS.px(82),
                            }}
                            src={require('../images/suanxinzi/salary_pic_box2_left@2x.png')}
                            />
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'url(/images/suanxinzi/salary_pic_box1_middle.png) 0 0 repeat-x',
                              width: '100%',
                              height: CSS.px(82),
                              padding: '0px 2px',
                            }}>
                              {!Array.isArray(n2) ? <span className="page-row-title title">{n2}</span> : n2.map((nn,ii)=>{
                                return (<span className="page-row-title title tiny">{nn}</span>)
                              })}
                              {this.state.data[i].s[i2] ? <span className="page-row-title subTitle">{this.state.data[i].s[i2]}</span> : null}
                            </div>
                            <img style={{
                              width: CSS.px(30),
                              height: CSS.px(82),
                            }}
                            src={require('../images/suanxinzi/salary_pic_box2_right@2x.png')}
                            />
                          </div>
                          <span className={this.state.postData.data.gender=="男"?"page-row-avator male":"page-row-avator female"}></span>

                      </div>)
                  })}
                </div> : null}

                </div>
              </div>

              {(this.state.data[i].t== "result") ? <div style={{
                  //再玩一次分享按钮
                  display: 'flex',
                  width: CSS.px(694),
                  height: CSS.px(280),
                  flexDirection: 'column',
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'flex-end',
                  border: '0px #00f solid',
                  position: 'relative',
                  left: this.props.showDownload? '-2px' : '0px',
                  top: this.props.showDownload? '10px' : '-10px',
                  zIndex: 10,
                  background: "url(../images/suanxinzi/salary_pic_keyboard_bg@2x.png) 0 0 no-repeat",
                  backgroundSize: 'contain',
                }}>
                <div style={{
                  display: 'flex',
                  width: '100%',
                  height: CSS.px(72),
                  flexDirection: 'row',
                  alignItems: 'center',
                  border: '0px #f00 solid',
                  position: 'relative',
                  left: '0px',
                  top: '-20px',
                }}>
                  <div style={{
                    display: 'flex',
                    width: '50%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img style={{
                        width: CSS.px(298),
                        height: CSS.px(72),
                      }}
                      src={require('../images/suanxinzi/salary_btn_play_again@2x.png')}
                      onClick={this.onPressPlayAgain.bind(this)}
                      />
                  </div>
                  <div style={{
                    display: 'flex',
                    width: '50%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img style={{
                        width: CSS.px(298),
                        height: CSS.px(72),
                      }}
                      src={require('../images/suanxinzi/salary_btn_share@2x.png')}
                      onClick={this.onPressShare.bind(this)}
                      />
                  </div>
                </div>
              </div> : null}

              {(!this.state.isPredicting && this.state.page == 9) ? <div style={{
                width: '100%',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '0px #f00 solid',
                position: 'relative',
                top: '0px',
              }}>
                <div style={{
                  display: 'flex',
                  width: CSS.px(418),
                  height: CSS.px(96),
                  alignSelf: 'center',
                  marginTop: '13px',
                  //justifyContent: 'center',
                }}>
                  <a href="javascript:void(0);" style={{
                        display: 'inline-block',
                        width: CSS.px(418),
                        height: CSS.px(96),
                        border: '0px #f00 solid',
                    }} >
                      <img style={{
                        width: CSS.px(418),
                        height: CSS.px(96),
                      }}
                      src={require('../images/suanxinzi/salary_btn_generate@2x.png')}
                      onClick={this.onPressConclude.bind(this)}
                      />
                    </a>
                </div>

                <div style={{
                  display: 'block',
                  width: CSS.px(86),
                  height: CSS.px(98),
                  position: 'relative',
                  top: '-30px',
                  left: '-100px',
                  zIndex: 10,
                }}>
                  <a id="hand" href="javascript:void(0);" style={{
                        display: 'inline-block',
                        width: CSS.px(86),
                        height: CSS.px(98),
                        border: '0px #f00 solid',
                    }} >
                      <img style={{
                        width: CSS.px(86),
                        height: CSS.px(98),
                      }}
                      src={require('../images/suanxinzi/salary_ico_hand@2x.png')}
                      onClick={this.onPressConclude.bind(this)}
                      />
                    </a>
                </div>
              </div> : null}

              {this.props.showDownload ? <FooterDownload black={true} /> : null}

              {this.state.isInWeixinBrowser ? <div style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '100%',
                height: '100%',
                zIndex: '99999',
                background: 'rgba(0,0,0,0.8)',
              }}
                onClick={this.onPressHideWeixinShare.bind(this)}
              >
                <img style={{
                    width: CSS.px(560),
                    height: CSS.px(380),
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                  }}
                  src={require('../images/suanxinzi/salary_pic_share_tips@2x.png')}
                  />
              </div>:null}

            </GamePage> : null
          })}

          <div style={this.state.keyboardSpace ? {
            height: `${this.state.keyboardSpace}px`,
          }:{
            height: `0px`,
          }}></div>

      </div>);
    }
    return (
      <div className="postbody"></div>
    );
  }
}

class NumCard extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const { num } = this.props;
    let img = numMoney;
    let _n = 0;
    if(typeof num == "number"){
      _n =  parseInt(num, 10);
      switch (_n) {
        case 0:
          img = num0
          break;
        case 1:
          img = num1
          break;
        case 2:
          img = num2
          break;
        case 3:
          img = num3
          break;
        case 4:
          img = num4
          break;
        case 5:
          img = num5
          break;
        case 6:
          img = num6
          break;
        case 7:
          img = num7
          break;
        case 8:
          img = num8
          break;
        case 9:
          img = num9
          break;
        default:
          break;
      }
    }

    return (
      <div className="num-card" style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '0px #f00 solid',
          margin: '0px 2px',
      }}>
        <div className="num-card-up" style={{
          width: CSS.px(86),
          height: CSS.px(56),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img style={{
            width: CSS.px(86),
            height: CSS.px(56),
          }}
          src={numUp}
          />
        </div>
        <div className="num-card-down" style={{
          width: CSS.px(86),
          height: CSS.px(53),
        }}>
          <img style={{
            width: CSS.px(86),
            height: CSS.px(53),
          }}
          src={numDown}
          />
        </div>
        <div style={{
            width: '100%',
            height: '100%',
            zIndex: 20,
            position: 'absolute',
            top: '0px',
            left: '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <img style={{
            width: CSS.px(42),
            height: CSS.px(82),
            alignSelf: 'center',
          }}
          src={img}
          />
        </div>
      </div>
    );
  }
}

const maptodispatchaction = dispatch => ({
  /* signupAction: (param, success) => {
    dispatch(action.resgister(param, success));
  },
  signupCodeAction: (param, success) => {
    dispatch(action.signupCode(param, success));
  }, */
  suanxinziAction: (param, success, failed) => {
    dispatch(action.suanxinzi(param, success, failed));
  },
  getWxJsSignatureAction: (url, success) => {
    dispatch(action.getWxJsSignature(url, success));
  }
});

export default connect(
  null,
  maptodispatchaction
)(GameBody);

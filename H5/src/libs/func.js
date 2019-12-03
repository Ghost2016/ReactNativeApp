
import { notification } from 'antd';
import * as HOSTS from '../config/host';

export const Config = {
    website: `${HOSTS.WWW}/`,
    androidWebsite: 'http://android.myapp.com/myapp/detail.htm?apkName=com.shandudata.zhimekaimen',//`${HOSTS.APPSHARE}/qEkh`,
    iosWebsite: 'https://itunes.apple.com/cn/app/%E8%81%8C%E4%B9%88%E5%BC%80%E9%97%A8-%E5%A4%A7%E5%AD%A6%E7%94%9F%E7%9A%84%E8%81%8C%E4%B8%9A%E8%A7%84%E5%88%92%E5%B8%88/id1434294728?mt=8',//`${HOSTS.APPSHARE}/b8y3`,
    downloadApi: `${HOSTS.WWW}/`,//`${HOSTS.APPSHARE}/apiv2/app/install?appKey=3550035a1f49e45a737084adfd1426d0&_api_key=c71ebecb5c02daaa9127ea9c023af468`,
}

//https://ant.design/components/notification-cn/
export const openNotificationWithIcon = (type, title, msg, timeout = 3) => {
  notification[type]({
    message: title,
    description: msg,
    duration: timeout,
  });
};

export const checkResult = (res, key = "status", value = "ok") => {
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

export const isInWeiXin = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
      return true;
  }else{
      return false;
  }
}

export const isInQQ = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if(ua.indexOf('qq/') != -1 && ua.indexOf('mobile') != -1){
      return true;
  }else{
      return false;
  }
}

export const isInWeiBo = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  if(ua.match(/weibo/i) == "weibo"){
      return true;
  }else{
      return false;
  }
}

export const isMobile = {
    Windows: function() {
        return /IEMobile/i.test(navigator.userAgent);
    },
    Android: function() {
        return /Android/i.test(navigator.userAgent);
    },
    BlackBerry: function() {
        return /BlackBerry/i.test(navigator.userAgent);
    },
    iOS: function() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

export const CSS = {
    px: (n) => {
        return `${parseInt(n/2, 10)}px`
    },
    textSize: (n) => {
        return parseInt(n/2, 10)
    },
 }

//所有表单字段验证
export const notValidField = (value, type, msg = "", timeout = 0.5) => {
    let result = false;
    const _value = value === null ? "" : value === undefined ? "" : value.toString().trim();
    switch (type) {
      case "phone":
        if (!_value.match(/^1[0-9]{10}$/i)) {
          //Toast.fail(msg || "请输入11位手机号", timeout);
          openNotificationWithIcon('error', msg || "请输入11位手机号", '')
          result = true;
        }
        break;
      case "code":
        if (!_value.match(/^[0-9]{4,6}$/i)) {
          //Toast.fail(msg || "请输入四位验证码", timeout);
          openNotificationWithIcon('error', msg || "请输入四位验证码", '')
          result = true;
        }
        break;
      case "password":
        if (!_value.match(/^.{6,}$/i) && !_value.match(/[0-9]/i) && !_value.match(/[a-z]/i)) {
          //Toast.fail(msg || "请输入至少6位数同时含字母和数字的密码", timeout);
          openNotificationWithIcon('error', msg || "请输入至少6位数同时含字母和数字的密码", '')
          result = true;
        }
        break;
      case "email":
        if (!_value.match(/^[0-9a-z_\.\-]+@[0-9a-z\-]+\.[0-9a-z\.\-]+$/i) && _value.length > 50) {
          //Toast.fail(msg || "请输入合法邮箱地址", timeout);
          openNotificationWithIcon('error', msg || "请输入合法邮箱地址", '')
          result = true;
        }
        break;
      case "confirm":
        if (_value !== msg) {
          //Toast.fail("请确认密码正确", timeout);
          openNotificationWithIcon('error', msg || "请确认密码正确", '')
          result = true;
        }
        break;
      case "nickname":
        if (!_value.match(/^.{2,20}$/i)) {
          //Toast.fail(msg || "请输入昵称", timeout);
          openNotificationWithIcon('error', msg || "请输入昵称", '')
          result = true;
        }
        break;
      default:
        break;
    }
    return result
  }

export const _onPressGetCode = async (context, confirmOk) => {
    //console.log("props.actions", props.actions)
    const { props } = context;
    const postData = await confirmOk();
    if (!postData) {
      return false;
    }
    //return
    // 获取验证码
    props.signupCodeAction(postData, res => {
      checkResult(res).then(res=>{
        openNotificationWithIcon('info', '验证码发送中...', '')
      }).catch(err=>{
        openNotificationWithIcon('error', '出错啦！', err)
      })
    });

    context.setState(
      {
        isLoadCode: true,
        isActive: false,
        isNeedReLoad: false,
        currLeftTime: 60
      },
      () => {
        // 倒计时剩余时间
        let timeLeft = context.state.currLeftTime;
        const timer = setInterval(() => {
          timeLeft--;
          if (timeLeft == 0) {
            context.setState(
              {
                isLoadCode: false,
                isActive: true,
                isNeedReLoad: true,
              },
              () => {
                clearInterval(timer);
              }
            );
          } else {
            context.setState({
              isLoadCode: true,
              isActive: false,
              isNeedReLoad: false,
              currLeftTime: timeLeft,
            });
          }
        }, 1000);
      }
    );
  }

/**
 * @function setCookie
 * @memberOf pbFunc
 * @ngdoc function
 * @description 设置cookie
 * @param {string} key   [cookie名称]
 * @param {string} value [cookie值]
 * @param {number} day   [有效天数]
 */
export const setCookie = function(key, value, day) {
  /**
   * cookie保存秒数
   * @type {number}
   */
  var ckTime = (day !== undefined && typeof day === 'number') ? parseInt(day) * 86400000 : 86400000;
  /**
   * 过期时间对象
   * @type {object}
   */
  var expires = new Date();
  /**
   * 更多设置内容
   * @type {string}
   */
  var more = '';
  if (document.location.href.toString().match(/^https:/i))
    more += 'secure;';
  expires.setTime(expires.getTime() + ckTime);
  //secure   : 表示cookie只能被发送到http服务器。
  //httponly : 表示cookie不能被客户端脚本获取到。(后弹才能用)
  document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + ';path=/;' + more;
}
/**
 * @function delCookie
 * @memberOf pbFunc
 * @ngdoc function
 * @description 删除cookie
 * @param {string} key   [cookie名称]
 */
export const delCookie = function(key) {
  /**
   * 过期时间对象
   * @type {object}
   */
  var expires = new Date();
  expires.setTime(expires.getTime() - 86400);
  document.cookie = key + '=;expires=' + expires.toUTCString() + ';path=/;';
}
/**
 * @function getCookie
 * @memberOf pbFunc
 * @ngdoc function
 * @description 获取cookie
 * @param {string} key   [cookie名称]
 * @returns {string} [返回cookie值]
 */
export const getCookie = function(key) {
  /**
   * cookie值
   * @type {object}
   */
  var keyValue = document.cookie.match('(^|;) ?' + key + '=([^; ]*)(;|$)');
  return keyValue ? keyValue[2] : null;
}

export const wxShare = (wx, type, {
  title = '分享标题', // 分享标题
  desc = '分享描述', // 分享描述
  link = '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  imgUrl = `${HOSTS.SHARE}/images/logo.png`, // 分享图标
}) => {
  return new Promise((resolve, reject)=>{
    if(type == "friend"){
      if(false){
        /* wx.updateAppMessageShareData({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl, // 分享图标
        }, (res) => {
          //分享回调
          resolve(res)
        }); */
      } else {
        wx.onMenuShareAppMessage({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl, // 分享图标
          type: 'link', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: (res) => {
            // 用户点击了分享后执行的回调函数
            resolve(res)
          },
        })
      }
    } else if (type == "timeline") {
      if(false){
        /* wx.updateTimelineShareData({
          title: title, // 分享标题
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl, // 分享图标
        }, (res) => {
          //分享回调
          console.log("分享回调", res)
          resolve(res)
        }); */
      } else {
        wx.onMenuShareTimeline({
          title: title, // 分享标题
          link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: imgUrl, // 分享图标
          success: (res) => {
            // 用户点击了分享后执行的回调函数
            resolve(res)
          },
        })
      }
    } else {
      reject(true)
    }
  })

}

export const downloadApp = () => {
  //不管有没有安装，都会跳到app下载页，如果安装了APP，会提示切换到APP
  // if(isInWeiXin()) window.open("elephantapp://signUp")
  // if(!isInWeiXin()) window.location = "elephantapp://signUp";
  var t = Date.now();
  setTimeout(function(){
      let url = Config.website
      //alert('ok')
      if (Date.now() - t < 2200) {
          //alert("检测到本地没有安装职么开门\n即将下载APP");
          //Config.downloadApi
          if(isMobile.Android()){
              url = Config.androidWebsite;
          } else if(isMobile.iOS()){
              url = Config.iosWebsite;
          } else {
              url = Config.website;
          }

        if(isInWeiXin() || isInQQ()) window.open(url)
        if(!isInWeiXin() && !isInQQ()) window.location = url; //ConfigVars.downloadApi;
      }
  }, 1000);

  if(isInWeiXin()) {
    if(isMobile.iOS()) {
      // let aDom2 = document.createElement('a');
      // aDom2.click();
      // window.open("https://share-beat-01.zhimekaimen.com/openapp");
      // 直接跳应用宝最好
      window.open("elephantapp://signUp");
    } else {
      window.open("elephantapp://signUp");
    }
  } else {
    let aDom = document.createElement('a');
    aDom.href = "elephantapp://signUp";
    aDom.click();
  }
  
}


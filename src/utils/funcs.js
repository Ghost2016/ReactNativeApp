import * as WeChat from "react-native-wechat";
import { StyleSheet, Alert } from "react-native";
import store from "@boot/store";
import { Toast } from "antd-mobile";
import { getJobPlanList, punchState } from "@api/index";
import { setUserState } from "@boot/actions";
import { dismissLightBox } from "@src/styles";
import { morningPunchListAction, punchStateWeekAction } from "@boot/actions";
import { formatPower } from "./user"
import { SERVER_TIME_CONFIG } from "../screens/AppLaunchScreen";
import * as HOSTS from "@src/host";

export const _getTodayMorningPunchList = (context) => {
  const start_time = getDateObj(null, true);
  //const end_time = getDateObj(null, true);
  //console.log("punch list[][][]", start_time ,end_time)
  context.props.actions.punchListAction(
    {
      target: "morning",
      start_date: start_time,
      end_date: '',//end_time
    },
    res => {
      console.log("morning res===", res);
      store.dispatch(morningPunchListAction(res.results));
    }
  );
}

const shareToWx = (options, props = {}) => {
  return new Promise((resolve, reject)=>{
    WeChat.isWXAppInstalled()
    .then(installed => {
      if (installed) {
        if (props.onClose) {
          props.onClose();
        } else {
          dismissLightBox();
        }
        resolve(options)
      } else {
        Alert.alert("微信未安装");
      }
    })
    .catch(err => {
      reject(err)
      Alert.alert("err:" + err);
    });
  });
}

export const shareToWxTimeLine = (options = {}, props = {}) => {
  shareToWx(options, props).then(options => {
    WeChat.shareToTimeline({
      ...options
    });
  })
}

export const shareToWxFriends = (options = {}, props = {}) => {
  shareToWx(options, props).then(options => {
    WeChat.shareToSession({
      ...options
    });
  })
}

export const responseOk = (res, customizeResultOk) => {
  // && res.hasOwnProperty('results') && res.results.length
  return new Promise((resolve, reject)=>{
    if(customizeResultOk){
      if (customizeResultOk) {
        resolve(res);
      } else {
        reject(res);
      }
    } else {
      if (res && res.hasOwnProperty('status') && res.status === "ok") {
        resolve(res);
      } else {
        reject(res);
      }
    }
  });

}

export const sdDispatch = (type, data, more = {}) => {
  store.dispatch(
    Object.assign({}, { type: type, json: data }, more)
  );
}

export const _apiAction = (
  apiCb: () => Promise<void>,
  params: object,
  callBack: () => void
) => (dispatch, getState) => {
  return apiCb(params, res => {}).then(res => {
    if (res && res.hasOwnProperty('status') && res.status === "ok") {
      if(typeof callBack == "function") callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！", 1.1);
    }
    return res;
  }).catch(err => {
    return err
  });
};

export const _apiActionAwait = (
  apiCb: () => Promise<void>,
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await apiCb(params, res => {}).then(res => {
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

export const _onPressGetCode = async (context, Toast, confirmOk) => {
  //console.log("props.actions", props.actions)
  const { props, state } = context;
  const postData = await confirmOk();
  if (!postData || !Toast) {
    return false;
  }

  //return
  // 获取验证码
  props.actions.getVerifyCodeAction(postData, res => {
    if (res.status === "ok") {
      Toast.info("验证码发送中...");
    }
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
};

export const _getPower = (context, isUpdateState = false) => {
  return new Promise((resolve, reject) => {
    context.props.actions.getPowerAction({}, res => {}).then(res => {
      if (res.status == "ok") {
        //console.log("getPower", res.results);
        let data = res.results;
        data.power = formatPower(data.power);
        data.up_power = formatPower(data.up_power);
        //up_salary salary
        data.salary = formatPower(data.salary);
        data.up_salary = formatPower(data.up_salary);
        if(isUpdateState) context.setState({
          loading: false,
          powerInfo: data
        });
        resolve({
          results: data,
        });
      }
      reject(false);
    })
  });
};

export const getPowerWeek = () => {
  const today = getDateObj();
  const [start, end] = getCurrentWeek(today.y, today.m, today.d);
  return new Promise((resolve, reject)=>{
    punchState(
      {
        start_date: start,
        end_date: end,
        size: 7,
        page: 1
      },
      res => {
        //console.log("punchState====", res);
        // task_info: { total: 4, data: [ 0, 0, 1, 1, 1, 1, 0 ] }, power_up: 66.61949626774137 }
      }
    ).then(res => {
      console.log("punchState====[][]", res.results, punchStateWeekAction);
      store.dispatch(punchStateWeekAction(res.results));
      resolve(res.results)
    }).catch(err => {
      reject(err)
    })
  })
}

export const _pickerPhoto = (BUTTONS: array, callback: () => {}) => {
  //const BUTTONS = ["相机", "图库", "取消"];
};

export const paddingZero = function(n) {
  if (parseInt(n, 10) < 10) {
    return "0" + n;
  } else {
    return n + "";
  }
};

export const getDateObj = function(
  t,
  returnString,
  isFull = false,
  isFormat = false,
  gapChar = "-",
  isMonth = false,
  isChinese = false,
) {
  /**
   * 时间对象
   * @type {object}
   */
  var dt, t;
  if (t !== undefined) {
    //fixStrTime
    if (typeof t === "string") {
      dt = new Date(fixStrTime(t));
    } else if (typeof t === "number") {
      dt = new Date(t);
    } else {
      dt = new Date();
    }
  } else {
    dt = new Date();
  }
  t = returnString
    ? dt.getFullYear() +
      gapChar +
      paddingZero(dt.getMonth() + 1) +
      gapChar +
      paddingZero(dt.getDate())
    : {
        y: dt.getFullYear(),
        m: dt.getMonth() + 1,
        d: dt.getDate(),
        h: isFull ? dt.getHours() : 0,
        i: isFull ? dt.getMinutes() : 0,
        s: isFull ? dt.getSeconds() : 0
      };
  if (isFull && isFormat) {
    if(isMonth){
      if(isChinese){
        t = t.y +
          '年' +
          paddingZero(t.m) + '月';
      } else {
        t = t.y +
          gapChar +
          paddingZero(t.m);
      }
    } else {
      t = t.y +
        gapChar +
        paddingZero(t.m) +
        gapChar +
        paddingZero(t.d) +
        " " +
        paddingZero(t.h) +
        ":" +
        paddingZero(t.i);
    }
  }
  return t;
};

//1-31
export const daysInMonth = function(year, month) {
  return new Date(year, month, 0).getDate();
};

//0-6
export const weekDay = function(year, month, day) {
  return new Date(year, month - 1, day).getDay();
};

export const getTodayIndexOfWeek = function(year, month, day){
  return new Date(year, month - 1, day).getDay();
}

export const getCurrentWeek = function(year, month, day) {
  const today = getTodayIndexOfWeek(year, month, day);
  //console.log("today", today, year, month, day)
  let start = {};
  let end = {};
  //查询接口日期需要多加一天，比如7-31需要查询8-1，但是，这里不需要，请注意
  const offset = 0;//86400000;
  if (today == 0) {
    //周日
    end = new Date(`${year}-${paddingZero(month)}-${paddingZero(day)}`).getTime() + offset;
    start = new Date(`${year}-${paddingZero(month)}-${paddingZero(day)}`).getTime() - 86400000 * 6;
  } else if (today == 1) {
    //周一
    start = new Date(`${year}-${paddingZero(month)}-${paddingZero(day)}`).getTime();
    end = new Date(`${year}-${paddingZero(month)}-${paddingZero(day)}`).getTime() + 86400000 * 6 + offset;
  } else {
    start = new Date(`${year}-${paddingZero(month)}-${paddingZero(day)}`).getTime() - 86400000 * (today - 1);
    end = new Date(`${year}-${paddingZero(month)}-${paddingZero(day)}`).getTime() + 86400000 * (6 - today + 1) + offset;
  }
  //console.log("start=end", start, end)
  return [
    getDateObj(start, true),
    getDateObj(end, true)
  ];
};

//搜索查询需要：比如八月份需要搜索8-1到9-1
export const getDayByMonthForSearch = (d, isNextMonth = null) => {
  let startDate = '';
  let endDate = '';
  if(isNextMonth === true){
    if (d.m == 12) {
      startDate = `${d.y + 1}-01-01`;
      //endDate = `${d.y + 1}-01-${paddingZero(daysInMonth(d.y + 1, 1))}`;
      endDate = `${d.y + 1}-02-01`;
    } else {
      startDate = `${d.y}-${paddingZero(d.m + 1)}-01`;
      /* endDate = `${d.y}-${paddingZero(d.m + 1)}-${paddingZero(
        daysInMonth(d.y, d.m + 1)
      )}`; */
      endDate = `${d.y}-${paddingZero(d.m + 2)}-01`;
      if(parseInt(d.m, 10) + 2 > 12) endDate = `${d.y+1}-01-01`;
    }
  } else if(isNextMonth === false) {
    if (d.m == 1) {
      startDate = `${d.y - 1}-12-01`;
      /* endDate = `${d.y - 1}-12-${paddingZero(
        daysInMonth(d.y - 1, 12)
      )}`; */
      endDate = `${d.y}-01-01`;
    } else {
      startDate = `${d.y}-${paddingZero(d.m - 2)}-01`;
      if(d.m - 2 <= 0) startDate = `${d.y-1}-12-01`;
      /* endDate = `${d.y}-${paddingZero(d.m - 1)}-${paddingZero(
        daysInMonth(d.y, d.m - 1)
      )}`; */
      endDate = `${d.y}-${paddingZero(d.m - 1)}-01`;
    }
  } else {
    startDate = `${d.y}-${paddingZero(d.m)}-01`;
    endDate = `${d.y}-${paddingZero(d.m+1)}-01`;
    if(parseInt(d.m, 10) + 1 > 12) endDate = `${d.y+1}-01-01`;
  }
  console.log("getDayByMonthForSearch", startDate, endDate, d)
  return [startDate, endDate];
}

export const chineseDateNum = function(m, useWeekday = false) {
  let arr = "零一二三四五六七八九十".split("");
  if (useWeekday) arr[0] = "日";
  const n = parseInt(m / 11, 10);
  const left = m <= 10 ? m % 11 : (m % 11) + 1;
  if (n == 0) return arr[left];
  const shi = n == 1 ? "" : arr[n];
  return shi + "十" + arr[left];
};

export const fixStrTime = function(strtime) {
  //2018-08-02T11:11:11
  let a = "";
  let b = "";
  if(strtime && strtime.toString().match(/^([0-9\/\-]+)T([0-9]{2}:[0-9]{2}:[0-9]{2})/i)){
    b = RegExp.$2;
    a = RegExp.$1.replace(/\-/g, "/");
    return a + " " + b;
  }
  return strtime
}

export const countHour = function(start_time, finish_time) {
  let startTime = 0;
  let endTime = 0;
  console.log("countHour===1", start_time, finish_time)
  if(start_time && finish_time){
    startTime = (new Date(fixStrTime(start_time))).getTime();
    endTime = (new Date(fixStrTime(finish_time))).getTime();
  }

  console.log("countHour===2", fixStrTime(start_time), fixStrTime(finish_time))
  return parseInt(100 * (endTime - startTime) / 3600000, 10) / 100;
}

export const countHour2 = function(item) {

  const {created_time, end_time, finish_time, start_time} = item;
  const createdTime = (new Date(fixStrTime(created_time))).getTime();
  const endTime = (new Date(fixStrTime(end_time))).getTime();
  const finishTime = (new Date(fixStrTime(finish_time))).getTime();
  const startTime = (new Date(fixStrTime(start_time))).getTime();

  if(finishTime <= startTime){
    return parseInt(100 * (finishTime - createdTime) / 3600000, 10) / 100;
  } else {
    return parseInt(100 * (finishTime - startTime) / 3600000, 10) / 100;
  }

}

//判断当前tab对应查询type类型，用于按类型查询数据
export const getTabType = (name) => {
  let index = 0;
  let title = "";
  let type = "";
  if(typeof name === "number"){
    index = name;
    if (index == 2) {
      type = "custom"
    } else if (index == 1) {
      type = "goal"
    } else {
      type = "common"
    }
  } else if(typeof name === "string"){
    title = name;
    if (title == "通用技能" || title == "通用证书") {
      type = "common"
    } else if (title == "目标职位技能" || title == "目标职位证书") {
      type = "goal"
    } else {
      type = "custom"
    }
  }
  return type;
}

// 首字母大写
export const ucfirst = function(str) {
  if (str.length > 0)
    return str.substr(0, 1).toUpperCase() + str.substr(1, str.length);
  return str;
};

export const copyToObj = function(
  savedObj,
  chkObj,
  name,
  type,
  aliasName = ""
) {
  const isOk = type => {
    if (type.match(/^(boolean|number)$/i) && typeof chkObj[name] === type) {
      return true;
    } else if (type.match(/^(string)$/i) && chkObj[name]) {
      return true;
    } else {
      return false;
    }
  };
  if (chkObj.hasOwnProperty(name) && isOk(type)) {
    if (aliasName) {
      savedObj[aliasName] = chkObj[name];
    } else {
      savedObj[name] = chkObj[name];
    }
  }
};

export const hidePhone = function(phone) {
  if(!phone) return "";
  return phone.toString()
    .split("")
    .map((n, i) => {
      if (i > 2 && i < 7) {
        return "*";
      } else {
        return n;
      }
    })
    .join("");
};

export const toastErr = function(Toast, res) {
  //form error
  let err = res.msg || "请求失败！";
  if (err.match(/^form error$/i) && res.results && res.results.form) {
    err = Object.keys(res.results.form)
      .map((n, i) => {
        return `[${n}]:${res.results.form[n]} `;
      })
      .join("");
  }
  Toast.fail(err);
};

export const isValidRangeDate = function(start, end, isYear, isEq) {
  debugger;
  if (typeof start === "string") {
    start = new Date(fixStrTime(start)).getTime();
  } else if (typeof start === "object") {
    start = start.getTime();
  }
  if (typeof end === "string") {
    end = new Date(fixStrTime(end)).getTime();
  } else if (typeof end === "object") {
    end = end.getTime();
  }
  if(isYear) {
    if((end - start) > (1000 * 60 * 60 * 24 * 265)) {
      return true;
    } else {
      return false;
    }
  }
  if(isEq) {
    return start <= end
  }
  return start < end;
};

export const ftime = function(time) {
  if (time == null || time == "") {
    return "";
  }
  var datePart = time.substring(0, 10).replace(/\-/g, "/");
  var timePart = time.substring(11, 19);
  //console.log(datePart + ' ' + timePart);
  var oldTime = new Date(datePart + " " + timePart).getTime();
  var currTime = new Date().getTime();
  var diffValue = currTime - oldTime;

  var days = Math.floor(diffValue / (24 * 3600 * 1000));
  if (days === 0) {
    //计算相差小时数
    var leave1 = diffValue % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    if (hours === 0) {
      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000));
      if (minutes === 0) {
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000);
        return seconds + "秒前";
      }
      return minutes + "分钟前";
    }
    return hours + "小时前";
  }

  // 如果大于了 7 天 则输出日期
  if (days > 7) {
    var datetime = new Date(time);
    var month = fixStrTime(datetime.getMonth() + 1);
    var day = fixStrTime(datetime.getDate());
    return datetime.getFullYear() + "-" + month + "-" + day;
  }
  return days + "天前";
};

export const fixTime = t => {
  if (t < 0) {
    t = "00";
  } else if (t < 10) {
    t = "0" + t;
  }
  return t;
};

export const getUnixTime = () => {
  if(SERVER_TIME_CONFIG.time) {
    return SERVER_TIME_CONFIG.time.getTime();
  } else {
    return Date.parse(new Date());
  }
};

export const cv2UnixTime = (t) => {
  // 判断是否是已经格式化的时间
  if(typeof t === 'string' && t.length > 13) {
    t =  Date.parse(new Date(t.replace(/-/g, '/').replace("T", " ")));
    // 转时区
    // let offsetmsec = new Date().getTimezoneOffset() * 60000;
    // t = t - offsetmsec;
  }
  t = t + "";
  if (t.length == 10) {
    return parseInt(t + "" + "000");
  }
  return parseInt(t);
};

export const isValidStartEndTime = (startDate, endDate) => {
  let start = 0;
  let end = 0;
  //console.log("isValidStartEndTime==", startDate, endDate)
  //console.log("isValidStartEndTime==", fixStrTime(startDate), fixStrTime(endDate))
  if(typeof startDate === "number"){
    start = new Date(startDate)
    end = new Date(endDate)
  } else {
    start = new Date(fixStrTime(startDate))
    end = new Date(fixStrTime(endDate))
  }
  console.log("isValidStartEndTime==2", end.getTime(), start.getTime())
  return end.getTime() > start.getTime() ? true : false;
}

//所有表单字段验证
export const notValidField = (value, type, msg = "", timeout = 2.5) => {
  let result = false;
  const _value = value === null ? "" : value === undefined ? "" : value.toString().trim();
  switch (type) {
    case "phone":
      /**
       * 正则：手机号（精确）
       * <p>移动：134(0-8)、135、136、137、138、139、147、150、151、152、157、158、159、178、182、183、184、187、188、198</p>
       * <p>联通：130、131、132、145、155、156、175、176、185、186、166</p>
       * <p>电信：133、153、173、177、180、181、189、199</p>
       * <p>全球星：1349</p>
       * <p>虚拟运营商：170</p>
       */
      if (!_value.match(/^1[3456789]{1}[0-9]{9}$/i)) {
        Toast.fail(msg || "请输入正确的手机号", timeout);
        result = true;
      } else if(_value.match(/^[1]{3}/i)) {
        Toast.fail(msg || "手机号码前缀不合法", timeout);
        result = true;
      }
      break;
    case "code":
      if (!_value.match(/^[0-9]{4,6}$/i)) {
        Toast.fail(msg || "验证码错误", timeout);
        result = true;
      }
      break;
    case "password":
      if (!_value.match(/^.{6,}$/i) || !_value.match(/[0-9]/i) || !_value.match(/[a-z]/i)) {
        Toast.fail(msg || "请输入至少6位数同时含字母和数字的密码", timeout);
        result = true;
      }
      break;
    case "email":
      if (!_value.match(/^[0-9a-z_\.\-]+@[0-9a-z\-]+\.[0-9a-z\.\-]+$/i)) {
        Toast.fail(msg || "请输入合法邮箱地址", timeout);
        result = true;
      }
      break;
    case "confirm":
      if (_value !== msg) {
        Toast.fail("请再次输入新密码", timeout);
        result = true;
      }
      break;
    case "nickname":
      if (!_value.match(/^[^ ]{2,20}$/i)) {
        Toast.fail(msg || "请输入2到20位且不包含空格的昵称", timeout);
        result = true;
      }
      break;
    default:
      break;
  }
  return result
}

export function prepareShareData(data, userInfo, targetName = "职场技能"){
  const title = data.content ? data.content : (data.data.course ? data.data.course.name : data.data.task.name);
  const {nickname, gender, avatar, power, salary, up_power} = userInfo;
  const task = (userInfo.total.certificate_count ? userInfo.total.certificate_count : 0) + (userInfo.total.tech_count ? userInfo.total.tech_count : 0);
  //power, salary, skill, up, targetName
  const url = `${HOSTS.SHARE}/#/?skill=${targetName}&name=${nickname}&gender=${gender}&school=${userInfo.total.school_name}&major=${userInfo.total.major_name}&degree=${userInfo.total.degree_name}&power=${power.toString().slice(0, 4)}&salary=${salary}&up=${up_power}&task=${task}`+(avatar && avatar.file_name ? `&userpic=${avatar.file_name}` : '');
  console.log("url wx====", url, userInfo);
  return {
    type: "news",
    title: `${nickname}在职么开门里完成任务${
      title
    },大家也来试试👊`,
    description: `${
      nickname
    }在职么开门里完成任务${
      title
    },大家也来试试👊`,
    webpageUrl: url,
  };
}

export function refreshJobPlanListAction(context, opt = {}) {
  //检查是否有职业规划
  return getJobPlanList({}, res => {}).then(res => {
    context.props.actions.getJobPlanListAction(res.results);
    return res;
  });
}

//刷新职么力
export function refreshPowerAction(context) {
  return _getPower(context).then(({results, data}) => {
    store.dispatch(setUserState(results));
    return results;
  });
}

export function getCourseType(type) {
  switch(type) {
    case 1:
      return "公共基础课";
    case 2:
      return "必修课";
    case 3:
      return "选修课";
    case 4:
      return "专业课";
    default :
      return "未知";
  }
}

export function getEducationStatusName(type) {
  //doing:正在验证, ok:验证成功, error:登录失败, new:未登录过, failed: 绑定失败
  switch(type) {
    case "doing":
      return "正在验证中";
    case "ok":
      return "已绑定";
    case "error":
      return "验证失败";
    case "new":
      return "未绑定";
    case "failed":
      return "绑定失败,教育经历认证不一致";
    default:
      return "接口未返回status字段"
  }
}
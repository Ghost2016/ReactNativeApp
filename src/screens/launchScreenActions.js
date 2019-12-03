import { tokenCheck } from "../api";

export function appInitialized() {
  return async function(dispatch, getState) {
    if(getState().isFirstStart) {
      // 如果是第一次打开安装的App
      // 进入到启动屏
      dispatch(changeAppRoot("login"));
    } else {
      // 判断是否有登录
      // 检查是否有token
      if (!getState().user || !getState().user.token || getState().user.token == "") {
        // 没有登录
        // 进入登录界面
        dispatch(changeAppRoot("loginReal"));
      } else {
        // 有token
        // 则检查token是否有效
        let timer = setTimeout(() => {
          dispatch(changeAppRoot("loginReal"));
        }, 3000);
        tokenCheck().then(res => {
          // 说明token有效
          // 可以进入home首页
          clearTimeout(timer);
          dispatch(changeAppRoot("after-login"));
        }).catch(err => {
          // 说明token无效
          // 进入登录界面
          clearTimeout(timer);
          dispatch(changeAppRoot("loginReal"));
        })
      }
    }
  };
}

export function changeAppRoot(root, opt = {}) {
  return Object.assign({}, { type: "ROOT_CHANGED", root: root }, opt);
}

//after-login login
export function login(root = "login", opt = {}) {
  return async function(dispatch, getState) {
    dispatch(changeAppRoot(root, opt));
  };
}
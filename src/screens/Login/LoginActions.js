// /* @flow */
// import type { GetState, Dispatch, Narrow, Topic, InitTopicsAction } from '../types';
import {
  login,
  logout,
  findPassword,
  tokenCheck,
  getUserInfo
} from "../../api";
import { changeAppRoot } from "../launchScreenActions";
import { setAppToken, setAppNewToken, cleanAppToken, getUserInfoAction } from "../../boot/actions";
// import { INIT_TOPICS } from '../actionConstants';
import { Toast } from "antd-mobile";
import { isTesting, testVersion, testAccount, testPassword } from 'react-native-dotenv'
import { _apiAction, _apiActionAwait } from "@utils/funcs";

//token验证
//zxy 已弃用
export const tokenCheckAction = (
  params: object,
  navigator: object,
  actions: object
) => async (dispatch, getState) => {
  //debugger;
  return null;
  return await tokenCheck(params, res => {
    if (res.status === "ok") {
      actions.chkUserInfoAction({}).then(res => {
        if (
          !res.results.total.school_name ||
          !res.results.total.major_name ||
          !res.results.total.degree_name
        ) {
          //如果注册信息不完善，需要跳转到完善信息页面
          if (navigator)
            navigator.push({
              screen: "example.OtherInfoRegisterScreen",
              title: "职么开门",
              navigatorStyle: {
                navBarHidden: true
              }
            });
        } else {
          dispatch(changeAppRoot("after-login"));
        }
      });

      // 更新用户信息
      /*getUserInfo(params, res => {
        if (res.status === "ok") {
          dispatch({
            type: "SETUSERSTATE",
            json: res.results
          });
        } else {
          Toast.fail(res.msg || "请求失败！");
        }
      });*/
    } else {
      //dispatch(errMsg(res.msg || "请求失败！"));
      Toast.fail(res.msg || "请求失败！");
    }
    return res;
  });
};

//摘回密码
/* export const findPasswordAction = (params: object) => async (
  dispatch,
  getState
) => {
  return findPassword(params, res => {});
}; */
export const findPasswordAction = (params: object, callBack: () => void) =>
  _apiAction(findPassword, params, callBack);

// 直接退出
export const logoutAction = (params: object) => async (dispatch, getState) => {
  logout(params, res => {
    if (res.status === "ok") {
      dispatch(cleanAppToken(""));
      dispatch(changeAppRoot("loginReal"));
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

// 直接登录
// zxy change
export const loginAction = (params: object, navigator: object) => async (
  dispatch,
  getState
) => {
  const version = (isTesting == "true") ? testVersion : "0.2.0"
  return login(params, res => {
    // Toast.hide();
    // if(version != "0.2.0"){
    //   dispatch(setAppNewToken(res.results.token));
    // } else {
    //   dispatch(setAppToken(res.results.token));
    // }
    dispatch(setAppToken(res.results.token))
    // console.warn('setAppToken')
    dispatch(getUserInfoAction()).then(
      res => {
        // console.warn('getUserInfoAction', res)
        dispatch(changeAppRoot("after-login"));
      }
    )
    // 判断登录方式
    if (params.type === "phone") {
      // password
      dispatch({
        type: "UPDATE_LOGIN_TYPE",
        json: "password"
      });
    } else if (params.type === "code") {
      dispatch({
        type: "UPDATE_LOGIN_TYPE",
        json: "phoneCode"
      });
    }
  }, version);
};

// export const loginAction = (params: object, navigator: object) => async (
//   dispatch,
//   getState
// ) => {
//   login(params, res => {
//     if (res.status === "ok") {
//       console.log("total", res.results.total);
//       if (
//         !res.results.total.school_name ||
//         !res.results.total.major_name ||
//         !res.results.total.degree_name
//       ) {
//         //如果注册信息不完善，需要跳转到完善信息页面
//         if (navigator)
//           navigator.push({
//             screen: "example.OtherInfoRegisterScreen",
//             title: "职么开门",
//             navigatorStyle: {
//               navBarHidden: true
//             }
//           });
//       } else {
//         dispatch(setAppToken(res.results.token));
//         dispatch(changeAppRoot("after-login"));
//       }

//       // 判断登录方式
//       if (params.type === 'phone') {
//         // password
//         dispatch({
//           type: "UPDATE_LOGIN_TYPE",
//           json: "password"
//         })
//       } else if(params.type === 'code') {
//         dispatch({
//           type: "UPDATE_LOGIN_TYPE",
//           json: "phoneCode"
//         })
//       }

//     } else {
//       //dispatch(errMsg(res.msg || "请求失败！"));
//       Toast.fail(res.msg || "请求失败！");
//     }
//   });
// };

// 注册后直接登录
export const loginAfterRegisteAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  const version = (isTesting == "true") ? testVersion : "0.2.0"
  // console.warn("loginAction version", version)
  return login(params, res => {
    // if (res.status === "ok") {
      // if(version != "0.2.0"){
      //   dispatch(setAppNewToken(res.results.token));
      // } else {
      //   dispatch(setAppToken(res.results.token));
      // }
      // dispatch(setAppToken(res.results.token));
      // // 设置登录方式
      // dispatch({
      //   type: "UPDATE_LOGIN_TYPE",
      //   json: "password"
      // });
      // // 保留注册登录后完善信息流程
      // dispatch(changeAppRoot("after-login"));
      // callBack && callBack instanceof Function && callBack();
    // }
  }, version);
};

// 微信登录后没有教育信息设置token
export const wechatSetTokenAction = (token: string) => async (
  dispatch,
  getState
) => {
  dispatch(setAppToken(token));
  dispatch(changeAppRoot("after-login"));
  // 设置登录方式
  dispatch({
    type: "UPDATE_LOGIN_TYPE",
    json: "wechat"
  });
};

export const wechatLoginAction = (token: string) => async (
  dispatch,
  getState
) => {
  dispatch(setAppToken(token));
  dispatch(changeAppRoot("after-login"));
  // 设置登录方式
  dispatch({
    type: "UPDATE_LOGIN_TYPE",
    json: "wechat"
  });
};

/* @flow */
// import type { Auth, ResponseExtractionFunc } from '../types';
// import { getAuthHeader, encodeAsURI, isValidUrl } from '../utils/url';
// import userAgent from '../utils/userAgent';
import { networkActivityStart, networkActivityStop } from '../utils/networkActivity';
import { Alert } from "react-native";
import apiConfig from "./apiConfig";
import { queryParams } from "../utils/query";
import { Toast } from "antd-mobile";
import store from "../boot/store";
import { changeAppRoot } from "../screens/launchScreenActions";
import { cleanAppToken } from "../boot/actions";
import { logErrorRemotely, logWarningToSentry } from "../utils/logging";
import _fetch from "../utils/timeoutFetch";
import APIError from "../utils/error";

export const apiGet = async (api, apiCall) => {
  // debugger;
  const test = function() {
    return new Promise((resolve, rejects) => {
      setTimeout(() => {
        resolve(api);
      }, 1000);
    });
  };
  const result = await test();
  return result;
  // try {
  //   networkActivityStart(isSilent);
  //   const response = await apiFetch(auth, route, params);

  //   if (!response.ok) {
  //     console.log('Bad response for:', { auth, route, params, response }); // eslint-disable-line
  //     const error = new Error('API');
  //     // $FlowFixMe
  //     error.response = response;
  //     // $FlowFixMe
  //     throw error;
  //   }

  //   const json = await response.json();

  //   if (json.result !== 'success') {
  //     console.log('Bad response for:', { auth, route, params, response }); // eslint-disable-line
  //     const error = new Error('API');
  //     // $FlowFixMe
  //     error.response = response;
  //     // $FlowFixMe
  //     error.code = json.code;
  //     throw error;
  //   }

  //   return resFunc(json);
  // } finally {
  //   networkActivityStop(isSilent);
  // }
};

const formatFormErr = (form = {}) => {
  let err = "";
  Object.keys(form).map((key,i) => {
    if(Array.isArray(form[key])) {
      err += form[key][0];
    } else {
      err += form[key] + "";
    }
    if(i > 0) err += ";";
  });
  return err;
}

export let lastApiPath = '';
export let lastApiReq = '';
export let lastApiRes = '';

export const apiFetch = async (api, apiCall, params = {}, method = "GET", version = '0.2.0', isSilent = false) => {
  let path = api.indexOf('http') >= 0 ? api :
    (api.indexOf("/v1/") >= 0 ? version != "0.2.0" ? apiConfig.newAapiHost : apiConfig.newAapiHost : apiConfig.biHost) +
    ":" +
    (api.indexOf("/v1/") >= 0 ? apiConfig.port : apiConfig.biPort) +
    "/" +
    (api.indexOf("/v1/") >= 0 ? apiConfig.prefix : apiConfig.biPrefix) +
    api;

  lastApiPath = path;
  lastApiReq = JSON.stringify(params);

  let temp = "";
  let temp2 = "";
  const isAdamTest =
    apiConfig.isDebug &&
    path.match(/^(https?:\/\/[0-9a-z\.\-]+:3000\/)(.+)\/$/i);
  //http://localhost:3000/api.sd/v1/auth/login/ =>
  //http://localhost:3000/api.sd_v1_auth_login/
  if (isAdamTest) {
    temp = RegExp.$1;
    temp2 = RegExp.$2;
    //console.log("temp", temp, temp2);
    path = `${temp}${temp2.replace(/[\/]/gi, "_")}/`;
  }
  console.log("path", path, params, method);

  if (api.indexOf('http') < 0) {
    if (method === "GET" || method === "DELETE") {
      if (JSON.stringify(params) !== "{}") {
        path += queryParams(params);
      }
    }
  }

  let bodyParams =
    method !== "GET" && method !== "DELETE"
      ? {
          body: JSON.stringify(params)
        }
      : {};

  let headers = {
    "Content-Type": "application/json"
  };
  //console.log("store", store.getState())
  if (store.getState().user && (store.getState().user.token !== "" || store.getState().user.newToken !== "")) {
    if (version !== "0.2.0") headers["Authorization"] = "Token " + store.getState().user.token;
    headers["Authorization"] = "Token " + store.getState().user.token;
  }
  console.log("headers", headers, path, bodyParams);
  // Toast.loading();
  try {
    if(typeof isSilent == "boolean") networkActivityStart(isSilent)
    return _fetch(path, {
      method: method,
      headers: {
        ...headers
      },
      ...bodyParams,
      // timeout:5000
    })
    .then(response => {
      // console.warn("response==== ", path, response)

      console.log("response==== ", path, response);
      let data = null;
      let pathName = "";

      if (path.match(/^https?:\/\/[0-9a-z:\.\-]+\/([0-9a-z_\/\.\-]+)/i)) {
        pathName = RegExp.$1;
      }

      if (response && response._bodyText && response._bodyText.indexOf("Server Error (500)") >= 0) {
        lastApiRes = response._bodyText;
        throw new APIError(api, JSON.stringify({
          status: "error",
          msg: "服务器内部错误：" + pathName
        }))
        return {
          status: "error",
          msg: "服务器内部错误：" + pathName
        }
      }

      const errCb = err => {
        throw new APIError(api, JSON.stringify({
          status: "error",
          msg: `Invalid Json response: ${err.toString()}`
        }))
        return {
          status: "error",
          msg: `Invalid Json response: ${err.toString()}`
        };
      };
      try {
        if (response && response._bodyText && response._bodyText.match(/^[\{\[].*[\}\]]$/)) {
          lastApiRes = response._bodyText;
          data = response.json();
        } else {
          data = errCb(`[${pathName}]`);
        }
      } catch (err) {
        return errCb(`[${pathName}]${err.toString()}`);
      }
      return data;
    })
    .then(responseJson => {
      let res = responseJson;
      if (isAdamTest) {
        res.status = "ok";
        res.status_code = "200";
      }
      console.log("responseJson ", res, path);
      // Toast.hide();
      lastApiRes = JSON.stringify(res);
      return new Promise((resolve, reject)=>{
        if (res.status === "ok" || res instanceof Array) {
          apiCall && apiCall instanceof Function && apiCall(res);
          resolve(res)
        } else {
          if (res.status_code == "403") {
            Toast.fail("身份认证信息已经过期，请重新登录。");
            //403 自动退出
            store.dispatch(cleanAppToken({ token: "" }));
            store.dispatch(changeAppRoot("loginReal"));
          } else if(res.status_code == '400' && res && res.msg != "form error") {
            reject(res);
          } else {
            if (res.msg && res.msg == "form error") {
              let err = "";
              // 特殊需求
              // 这里判断是否是登录接口报错
              if (api == "/v1/auth/login/") {
                Object.keys(res.results.form).findIndex(c => c == "phone") >= 0
                  ? Toast.fail("该账号不存在")
                  : Object.keys(res.results.form).findIndex(c => c == "code") >= 0 ? Toast.fail(res.results.form.code) : Toast.fail("未知错误");
              } else {
                Toast.fail(formatFormErr(res.results.form));
              }
              resolve(res)
            } else {
              // 特殊需求
              // 这里判断是否是登录接口报错
              if (api == "/v1/auth/login/") {
                if (res.msg == 'Unable to log in with provided credentials.') {
                  Toast.fail("用户名或密码错误");
                } else {
                  Toast.fail(res.msg || "未知错误");
                }
              } else if(api == "/v1/school/course/check_sync_course/"){
                // 如果是检查是否有同步课程接口
                resolve(res);
              } else {
                Toast.fail(res.msg ? res.msg : path + "接口返回信息错误");
                throw new APIError(api, JSON.stringify(res.msg))
              }
            }
          }
          reject(res)
        }
      });
      //return res;
    })
    .catch(_handleCatchError);
  } finally {
    networkActivityStop(isSilent);
  }
};

export const apiFetchOther = async (
  api,
  apiCall,
  params = {},
  method = "GET"
) => {
  // debugger;
  // body
  lastApiPath = api;
  lastApiReq = JSON.stringify(params);

  return _fetch(api, {
    method: method,
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      return response.json();
    })
    .then(res => {
      lastApiRes = JSON.stringify(res);
      apiCall && apiCall instanceof Function && apiCall(res);

      return res;
    })
    .catch(error => {
      // debugger;
      //Alert.alert(error.toString());
      Toast.hide();
      return _handleCatchError(error)
      // console.error("apifetch err", error);
    });
};

export const apiPostUpload = async (
  api,
  formdata,
  callBack,
  method = "POST"
) => {
  return _fetch(api, {
    method: method,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    body: formdata,
    timeout: 100000
  })
    .then(response => {
      return response.json();
    })
    .then(res => {
      callBack && callBack instanceof Function && callBack(res);
      return res;
    })
    .catch(error => {
      // debugger;
      //Alert.alert(error.toString());
      Toast.hide();
      return _handleCatchError(error)
      // console.error("apifetch err", error);
    });
};

/**
 * 处理请求异常
 * @param {Error} error 异常信息
 */
const _handleCatchError = (error) => {
  //console.warn(error.message)
  if ('Network request failed' === error.message) {
    // Toast.fail('请检查网络', 1, null, false);
  }
  // 超时
  else if('timeout' === error.message) {
    Toast.fail('请检查网络', 1, null, false);
  }
  else {
    logErrorRemotely(error, 'API_ERROR')
  }
  try {
    throw error;
  } catch (error) {
    return error;
  }
}
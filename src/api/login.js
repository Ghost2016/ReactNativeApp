/* @flow */
// import type { Auth, Topic } from '../types';
import { apiFetch } from "./apiFetch";
import { testVersion } from 'react-native-dotenv'

//token验证
export const tokenCheck = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/auth/verify/`, callBack, params, "POST");
};

export const login = async (params: object, callBack: () => {}, version = "0.2.0") => {
  console.log("login version", version)
  return apiFetch(`/v1/auth/login/`, callBack, params, "POST", version);
};

export const findPassword = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/auth/recover_password/`, callBack, params, "POST");
};

export const logout = async (params: object, callBack: () => {}) => {
  //return apiFetch(`/v1/auth/login/`, callBack, params, "POST");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        callBack({
          status: "ok",
          status_code: "200"
        })
      );
    }, 1000);
  });
};

/**
 * 获取验证码
 * @param {*} params {type: "signup", phone: "13440014742"}
 * @param {*} callBack
 */
export const getVerifyCode = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/verify/get_verify_code/`, callBack, params, "POST", testVersion);
};

/**
 * 注册
 * @param {*} params
 * {
    "phone": "13440017472",
    "password": "q1w2e3r4",
    "code": "7nCL",
    "nickname": "zxy",
    "type": "phone"
    }
 * @param {*} callBack
 */
export const signup = (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/auth/signup/`, callBack, params, "POST", testVersion);
};

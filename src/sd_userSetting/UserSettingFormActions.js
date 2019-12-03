//import { login, logout, findPassword, tokenCheck } from "../../api/index";
import {
  addCredentialInfo,
  editCredentialInfo,
  getCredentialInfo
} from "@api/index";
import { prepareUserInfo } from "@boot/actions";
import { Toast } from "antd-mobile";

// 暂存用户数据，统一保存
export const prepareUserInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  dispatch(prepareUserInfo(params));
  callBack(params);
};

// 添加实名认证
export const getCredentialInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  dispatch(getCredentialInfo(params), res => {
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

// 添加实名认证
export const addCredentialInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  dispatch(addCredentialInfo(params), res => {
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

// 修改实名认证
export const editCredentialInfAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  dispatch(editCredentialInfo(params), res => {
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

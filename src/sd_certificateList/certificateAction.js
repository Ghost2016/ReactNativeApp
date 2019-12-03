// /* @flow */

import { getUserCertificate } from "../api";

// 获取证书列表
export const getUserCertificateAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getUserCertificate(params, res => {
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type: "GET_CERTIFICATELIST",
        json: res.results
      });
    }
  });
};

export const getOtherUserCertificateAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getUserCertificate(params, res => {
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res.results);
      dispatch({
        type: "GET_OTHERUUSERCERTIFICATELIST",
        json: res.results
      });
    }
  });
};

export const getCertificateAction = (
  params: object
) => async (dispatch, getState) => {
  return getUserCertificate(params, () => null);
};
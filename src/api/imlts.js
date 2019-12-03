/* @flow */
// import type { Auth, Topic } from '../types';
import { apiFetchOther, apiFetch } from "./apiFetch";

export const getImSig = async (params: object, callBack: () => void) => {
  let { appid } = params;
  return apiFetchOther(
    `http://118.24.187.152:30001/sig/hash/${appid}`,
    callBack,
    params,
    "GET"
  );
};

export const updateImUserProfile = async (params: object, callBack: () => void) => {
  let { sig, id, sdkAppId, body } = params;
  return apiFetchOther(
    `https://console.tim.qq.com/v4/profile/portrait_set?usersig=${sig}&identifier=${id}&sdkappid=${sdkAppId}&random=${parseInt(Math.random() * 100000)}&contenttype=json`,
    callBack,
    body,
    "POST"
  );
};



export const getV1ImSig = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/live/teacher/get_sig/`, callBack, params, "GET");
};

/* @flow */
import { apiFetch } from "./apiFetch";

// 获取所有关注的用户的动态
export const getAllDynamic = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/dynamic/`, callBack, params, "GET");
};

// 获取动态个数
export const getDynamicCount = async (params: object, callBack: () => {}) => {
  // isSilent: true
  return apiFetch(`/v1/dynamic/count/`, callBack, params, "GET", '', true);
};

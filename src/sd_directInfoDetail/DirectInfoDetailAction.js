import { addToFav, readIt } from "@api/index";
import { Toast } from "antd-mobile";
import { getLikeNews, toggleNewsUse } from "../api";

//收藏
export const addToFavAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  addToFav(params, res => {
    if (res.status === "ok") {
      callBack && callBack instanceof Function && callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

export const readItAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  await readIt(params, res => {
    if (res.status === "ok") {
      //callBack(res);
    }
  });
};

export const getLikeNewsAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return getLikeNews(params, res => {
    if (res.status === "ok") {
      //callBack(res);
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};

export const toggleNewsUseAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return toggleNewsUse(params, res => {
    if (res.status === "ok") {
      //callBack(res);
      callBack && callBack instanceof Function && callBack(res.results);
    }
  });
};
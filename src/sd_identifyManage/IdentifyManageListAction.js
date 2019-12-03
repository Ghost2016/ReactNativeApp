import {
  getUserEduInfo,
  addUserEduInfo,
  editUserEduInfo,
  delUserEduInfo
} from "@api/index";
import { Toast } from "antd-mobile";
import { getUserInfoAction } from "../boot/actions";

export const getEduListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await getUserEduInfo(params, res => {
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

//统一添加身份信息
export const addUserEduInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  await addUserEduInfo(params, res => {
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

//统一修改身份信息
export const updateUserEduInfoAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return editUserEduInfo(params, res => {
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

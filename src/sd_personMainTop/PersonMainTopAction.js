import { getUserInfo, getPower } from "@api/index";
import { Toast } from "antd-mobile";

export const getPowerAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return getPower(params, res => {
    callBack && callBack(res);
  });
};

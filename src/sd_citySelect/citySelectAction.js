import { getArea } from "../api/index";

// 获取城市选择
export const getCityAreaAction = (
  params: object
) => async (dispatch, getState) => {
    return getArea(params);
};

import store from "@boot/store";
import { getUserInfo, getPower } from "@api/index";
import { Toast } from "antd-mobile";
import { setUserState } from "@boot/actions";
import {
  getJobPlanIndustry,
  getJobPlanPostionsByIndustry,
  searchLevelOneMajorData,
  searchMajorData,
  searchSchoolData,
  searchCityData,
} from "@api/index";
import { _apiAction } from "@utils/funcs";

//制定目标城市查询
export const getJobPlanCityAction = (params: object, callBack: () => void) =>
  _apiAction(searchCityData, params, callBack);

//制定目标学校查询
export const getJobPlanSchoolAction = (params: object, callBack: () => void) =>
  _apiAction(searchSchoolData, params, callBack);

//制定目标一级专业查询
export const getJobPlanLvelOneMajorAction = (params: object, level: number = 1) =>
  _apiAction(searchLevelOneMajorData, params, level);

//制定目标专业查询
export const getJobPlanMajorAction = (params: object, level: number = 1) =>
  _apiAction(searchMajorData, params, level);

//制定目标行业查询
export const getJobPlanIndustryAction = (params: object, callBack: () => void) =>
  _apiAction(getJobPlanIndustry, params, callBack);

//制定目标职位查询
export const getJobPlanPositionAction = (params: object, callBack: () => void) =>
  _apiAction(getJobPlanPostionsByIndustry, params, callBack);

//暂没使用
export const setUserInfoAction = (params: object, callBack: () => void) => (
  dispatch,
  getState
) => {
  getUserInfo(params, res => {
    //callBack(res);
    if (res.status === "ok") {
      store.dispatch(setUserState(res.results));
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

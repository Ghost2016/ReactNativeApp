/* @flow */
import {
  punch,
  punchMorningTypesList,
  punchMorningList,
  punchReadingList,
  punchCertList,
  punchSkillList,
  goalList,
  punchState,
  getJobPlanList,
  addJobPlan,
  getIndustryList,
  getJobPaths,
  getIndustryPosition,
  getMajorProfile,
  getMajorPositions,
  getSchoolMajorPositions,
  getSchoolMajorSimilarityPositions,
  getPositionsByRank,
  getPostGraduateSalary,
  getSkillList,
  getSkillCourseList,
  getCertList,
  getCertById,
  getJobPlanIndustryList,
  getJobPlanPositionList,
  postMakeGoal,
  postChangeGoal,
  patchPunchSkill,
  patchPunchSkillCourse,
  patchPunchCert,
  addMySkillTask,
  stateSkillList,
  stateCertList,
  hasTargetPosition,
  getJobPlanIndustry,
  getJobPlanPostionsByIndustry,
  searchLevelOneMajorData,
  searchMajorData,
  searchSchoolData,
} from "@api/index";
import { Toast } from "antd-mobile";
import { _apiAction, _apiActionAwait } from "@utils/funcs";
import { getNewIndustryDetail } from "../../../api";

export function setCertStateState(result, opt = {}) {
  return Object.assign({}, { type: "SETCERTSTATESTATE", json: result }, opt);
}

export function setSkillStateState(result, opt = {}) {
  return Object.assign({}, { type: "SETSKILLSTATESTATE", json: result }, opt);
}

//查询目标职位是否已经添加
export const hasTargetPositionAction = (params: object, callBack: () => void) =>
  _apiAction(hasTargetPosition, params, callBack);

export const stateSkillListAction = (params: object, callBack: () => void) =>
  _apiAction(stateSkillList, params, callBack);

export const stateCertListAction = (params: object, callBack: () => void) =>
  _apiAction(stateCertList, params, callBack);

export const postChangeGoalAction = (params: object, callBack: () => void) =>
  _apiAction(postChangeGoal, params, callBack);

export const postMakeGoalAction = (params: object, callBack: () => void) =>
  _apiAction(postMakeGoal, params, callBack);

export const getIndustryListAction = (params: object, callBack: () => void) =>
  _apiAction(getJobPlanIndustryList, params, callBack);

export const getPositionListAction = (params: object, callBack: () => void) =>
  _apiAction(getJobPlanPositionList, params, callBack);

export const getSkillListAction = (params: object, callBack: () => void) =>
  _apiAction(getSkillList, params, callBack);

export const getSkillCourseListAction = (params: object, callBack: () => void) =>
  _apiAction(getSkillCourseList, params, callBack);

export const getCertListAction = (params: object, callBack: () => void) =>
  _apiAction(getCertList, params, callBack);

export const getCertByIdAction = (params: object, callBack: () => void) =>
  _apiAction(getCertById, params, callBack);

//专业对口
export const getMajorIdPositions = (params: object, callBack: () => void) =>
  _apiAction(getMajorPositions, params, callBack);

/*export const getMajorIdAction = (params: object, callBack: () => void) =>
  _apiAction(getMajorProfile, params, callBack);*/

//同门经验
export const getSchoolMajorPositionsAction = (params: object, callBack: () => void) =>
  _apiAction(getSchoolMajorPositions, params, callBack);

//同类去向
export const getSchoolMajorSimilarityPositionsAction = (params: object, callBack: () => void) =>
  _apiAction(getSchoolMajorSimilarityPositions, params, callBack);

//高薪职位
export const getPositionsByRankAction = (params: object, callBack: () => void) =>
  _apiAction(getPositionsByRank, params, callBack);


export function getJobPlanListAction(result, opt = {}) {
  return Object.assign({}, { type: "GETJOBPLANLIST", json: result }, opt);
}

export function morningPunchTypeAction(result, opt = {}) {
  return Object.assign({}, { type: "MORNINGPUNCHTYPE", json: result }, opt);
}

export function morningPunchListAction(result, opt = {}) {
  return Object.assign({}, { type: "MORNINGPUNCHLIST", json: result }, opt);
}

export function skillPunchListAction(result, opt = {}) {
  return Object.assign({}, { type: "SKILLPUNCHLIST", json: result }, opt);
}

export function certPunchListAction(result, opt = {}) {
  return Object.assign({}, { type: "CERTPUNCHLIST", json: result }, opt);
}

export function punchStateWeekAction(result, opt = {}) {
  return Object.assign({}, { type: "PUNCHSTATE", json: result }, opt);
}

export const getPunchState = (params: object, callBack: () => void) =>
  _apiAction(punchState, params, callBack);

export const punchAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return await punch(params, res => {
    //console.log("punchAction res", res);
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

export const addMySkillTaskAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return await addMySkillTask(params, res => {
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

export const punchSkillAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return await patchPunchSkill(params, res => {
    //console.log("punchAction res", res);
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

export const punchSkillCourseAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return await patchPunchSkillCourse(params, res => {
    //console.log("punchAction res", res);
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

export const punchCertAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return await patchPunchCert(params, res => {
    //console.log("punchAction res", res);
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

export const punchTypeListAction = (
  params: object,
  callBack: () => void
) => async (dispatch, getState) => {
  return punchMorningTypesList({}, res => {
    //console.log("punchAction res", res);
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

export const punchListAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  const target = params.target || "";
  let cb = null;
  if (target.match(/^morning$/i)) {
    cb = punchMorningList;
  } else if (target.match(/^reading/i)) {
    cb = punchReadingList;
  } else if (target.match(/^cert/i)) {
    cb = punchCertList;
  } else if (target.match(/^skill/i)) {
    cb = punchSkillList;
  }
  delete params.target;
  if (cb)
    return cb(params, res => {})
      .then(res => {
        if (res.status === "ok") {
          callBack(res);
        } else {
          Toast.fail(res.msg || "请求失败！");
        }
        return res;
      })
      .catch(err => {
        return err;
      });
};

export const goalListAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  goalList(params, res => {
    //console.log("punchList res", res);
    if (res.status === "ok") {
      callBack(res);
    } else {
      Toast.fail(res.msg || "请求失败！");
    }
  });
};

export const getNewIndustryDetailAction = (params: object, callBack: () => void) => async (
  dispatch,
  getState
) => {
  return getNewIndustryDetail(params);
};

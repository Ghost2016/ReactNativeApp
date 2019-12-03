/* @flow */
// import type { Auth, Topic } from '../types';
import { apiFetch } from "./apiFetch";
import { getTabType } from "@utils/funcs";

//切换默认定制目标
export const postChangeGoal = async (
  params: object,
  callBack: () => {}
) => {
  const id = params.id || 0;
  return apiFetch(`/v1/profession/${id}/change_profession/`, callBack, params, "PATCH");
};

//定制目标
export const postMakeGoal = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`/v1/profession/add_profession/`, callBack, params, "POST");
};

//选择行业
export const getJobPlanIndustryList = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`/v1/profession/get_industry/`, callBack, params, "GET");
};

//选择职位
export const getJobPlanPositionList = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`/v1/profession/get_position/`, callBack, params, "GET");
};

//数据查询城市ID
export const searchCityData = async (
  params: object,
  callBack: () => void
) => {
  const city = params.city || "";
  console.log("city[][]", city)
  return apiFetch(`/v1/area/?name=${city}&common_level__name=市`, callBack, {}, "GET");
};

//数据查询学校
export const searchSchoolData = async (
  params: object,
  callBack: () => void
) => {
  const city_id = params.city_id || 0;
  const page = params.page || 1;
  const size = params.size || 10;
  return apiFetch(`/v1/university/?city_id=${city_id}&page=${page}&size=${size}`, callBack, {}, "GET");
};

//数据查询一级专业
export const searchLevelOneMajorData = async (
  params: object,
) => {
  const _level = params.level || "";
  return apiFetch(`major/level1?level=${_level}`, null, {}, "GET");
};

//数据查询专业
export const searchMajorData = async (
  params: object,
) => {
  return apiFetch(`major/profile`, null, params, "GET");
};

//专业对口
//http://222.211.90.70:8845/major/rank?major=%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B
//http://222.211.90.70:8845/major/2position?major=%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B&level=%E4%B8%8D%E9%99%90
export const getMajorPositions = async (
  params: object,
  callBack: () => void
) => {
  return apiFetch(`major/position`, callBack, params, "GET");
};
//http://222.211.90.70:8845/major/rank?major=%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B
/*export const getMajorId = async (params: object, callBack: () => void) => {
  return apiFetch(`major/rank`, callBack, params, "GET");
};*/

//同门经验
//http://222.211.90.70:8845/school-major/position?school_name=%E4%B8%8D%E9%99%90&major=%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B&degree=%E6%9C%AC%E7%A7%91?page_size=5
export const getSchoolMajorPositions = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`school-major/position`, callBack, params, "GET");
};

//同类去向
//http://222.211.90.70:8845/school-major/similarity-major2position?school_name=%E4%B8%8D%E9%99%90&major=%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B&degree=%E6%9C%AC%E7%A7%91?page_size=5
export const getSchoolMajorSimilarityPositions = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(
    `school-major/similarity-major2position`,
    callBack,
    params,
    "GET"
  );
};

//高薪职位
//http://222.211.90.70:8845/position/rank?page_size=5
export const getPositionsByRank = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`position/rank`, callBack, params, "GET");
};

//制定目标行业查询
//http://222.211.90.70:9999/api/sd/v1/profession/get_industry/
export const getJobPlanIndustry = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`/v1/profession/get_industry/`, callBack, params, "GET");
};

//制定目标职位查询
//http://222.211.90.70:9999/api/sd/v1/profession/get_position/?industry_id=1
export const getJobPlanPostionsByIndustry = async (
  params: object,
  callBack: () => {}
) => {
  return apiFetch(`/v1/profession/get_position/`, callBack, params, "GET");
};

//职场技能列表
//http://222.211.90.70:9999/api/sd/v1/tasks/skill/?page=1&size=10
export const getSkillList = async (params: object, callBack: () => void) => {
  params.type = getTabType(params.type);
  if(params.hasOwnProperty('type') && params.type == "custom"){
    //我的技能是从tech_list获取列表，而不是skill ?type=我的技能
    return apiFetch(`/v1/tasks/tech_list/`, callBack, params, "GET");
  } else {
    return apiFetch(`/v1/tasks/skill/`, callBack, params, "GET");
  }
};

export const getSkillCourseList = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/tasks/course/`, callBack, params, "GET");
};

export const addMySkillTask = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/tasks/add_tech_task/`, callBack, params, "POST");
};

//职场技能完成
//http://222.211.90.70:9999/api/sd/v1/tasks/1/tech_punch/
/*
{
  "status": "string",
  "is_remind": true,
  "title": "string",
  "description": "string",
  "profession_id": 0
}
 */
export const punchSkill = async (params: object, callBack: () => void) => {
  const id = params.id || 0;
  return apiFetch(`/v1/tasks/${id}/tech_punch/`, callBack, params, "PATCH");
};

//证书考取列表
//http://222.211.90.70:9999/api/sd/v1/users/certificate/
export const getCertList = async (params: object, callBack: () => void) => {
  params.type = getTabType(params.type);
  //return apiFetch(`/v1/users/certificate/list/`, callBack, params, "GET");
  return apiFetch(`/v1/certificates/`, callBack, params, "GET");
};

export const getCertById = async (params: object, callBack: () => void) => {
  const id = params.id || 0;
  return apiFetch(`/v1/users/certificates/${id}/get_user_certificate/`, callBack, params, "GET");
};

//证书考取完成
//http://222.211.90.70:9999/api/sd/v1/tasks/1/certificate_punch/
/*
{
  "status": "string",
  "is_remind": true,
  "title": "string",
  "description": "string",
  "certificate_id": 0,
  "profession_id": 0
}
 */
export const punchCert = async (params: object, callBack: () => void) => {
  const id = params.id || 0;
  return apiFetch(`/v1/tasks/${id}/read_punch/`, callBack, params, "PATCH");
};

//切换我的目标
export const changeJobPlan = async (params: object, callBack: () => void) => {
  const id = params.id || 0;
  return apiFetch(
    `/v1/profession/${id}/change_profession/`,
    callBack,
    params,
    "PATCH"
  );
};

export const getJobPlanList = (params: object, callBack: () => void) => {
  return apiFetch(`/v1/users/profession/`, callBack, params, "GET");
};

export const addJobPlan = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/professions/add_profession`, callBack, params, "POST");
};

export const getIndustryList = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/professions/get_industry/`, callBack, params, "GET");
};

export const getJobPaths = async (params: object, callBack: () => void) => {
  return apiFetch(`/v1/professions/get_paths/`, callBack, params, "GET");
};

export const getIndustryPosition = async (
  params: object,
  callBack: () => void
) => {
  return apiFetch(`/v1/professions/get_position/`, callBack, params, "GET");
};

export const getNewIndustryDetail = async (
  params: object,
  callBack: () => void
) => {
  const {id} = params;
  return apiFetch(`/v1/profession/${id}/industry/`, callBack, params, "GET");
};

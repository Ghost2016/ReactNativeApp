import {
  NULL_PUNCHTYPELIST,
  NULL_PUNCHLIST,
  NULL_USERJOBPLANLIST,
  NULL_SKILLLIST,
  NULL_COURSELIST,
  NULL_CERTLIST,
  NULL_PAGE_RESULTS,
  NULL_JOBPLANINDUSTRY,
  NULL_JOBPLANPOSITION,
  NULL_PUNCHSTATEWEEK,
} from "@src/nullObjects";

import type {
  PunchTypeListState,
  PunchListState,
  UserJobPlanListState,
  SkillListState,
  SkillCourseListState,
  CertListState,
  JobPlanIndustry,
  JobPlanPosition,
  PunchStateWeek,
} from "@src/types";

const MORNINGPUNCHTYPE = "MORNINGPUNCHTYPE";
const MORNINGPUNCHLIST = "MORNINGPUNCHLIST";
const SKILLPUNCHLIST = "SKILLPUNCHLIST";
const CERTPUNCHLIST = "CERTPUNCHLIST";
const GETMAJORPOSITIONS = "GETMAJORPOSITIONS";
const GETSCHOOLMAJORPOSITIONS = "GETSCHOOLMAJORPOSITIONS";
const GETSCHOOLMAJORSIMILARITYPOSITIONS = "GETSCHOOLMAJORSIMILARITYPOSITIONS";
const GETPOSITIONSBYRANK = "GETPOSITIONSBYRANK";
const GETJOBPLANLIST = "GETJOBPLANLIST";
const SKILLLIST = "SKILLLIST";
const SKILLCOURSELIST = "SKILLCOURSELIST";
const CERTLIST = "CERTLIST";
const GETJOBPLANINDUSTRYLIST = "GETJOBPLANINDUSTRYLIST";
const GETJOBPLANPOSITIONLIST = "GETJOBPLANPOSITIONLIST";
const SETCERTSTATESTATE = "SETCERTSTATESTATE";
const SETSKILLSTATESTATE = "SETSKILLSTATESTATE";
const PUNCHSTATE = "PUNCHSTATE";

export const certState = (
  state = {
    common: {},
    goal: {},
    custom: {},
    other: {},
  },
  action = {}
) => {
  switch (action.type) {
    case SETCERTSTATESTATE:
      return Object.assign({}, state, action.json);
    default:
      return state;
  }
};

export const skillState = (
  state = {
    common: {},
    goal: {},
    custom: {},
    other: {},
  },
  action = {}
) => {
  switch (action.type) {
    case SETSKILLSTATESTATE:
      console.log("SETSKILLSTATESTATE===", action.json)
      return Object.assign({}, state, action.json);
    default:
      return state;
  }
};

export const jobPlanIndustryList = (
  state: JobPlanIndustry = NULL_JOBPLANINDUSTRY,
  action = {}
) => {
  switch (action.type) {
    case GETJOBPLANINDUSTRYLIST:
      return action.json;
    default:
      return state;
  }
};

export const jobPlanPositionsList = (
  state: JobPlanPosition = NULL_JOBPLANPOSITION,
  action = {}
) => {
  switch (action.type) {
    case GETJOBPLANPOSITIONLIST:
      return action.json;
    default:
      return state;
  }
};

export const jobPlanPositionList = (
  state = {
    majorPosition : NULL_PAGE_RESULTS,
    schoolPosition : NULL_PAGE_RESULTS,
    similarityPosition : NULL_PAGE_RESULTS,
    rankPosition : NULL_PAGE_RESULTS,
  },
  action = {}
) => {
  const arr = (action.json && action.json.results) || [];
  let newData = []
  let data = {}
  let _state = action.isRefreshingAll ? {
    majorPosition : NULL_PAGE_RESULTS,
    schoolPosition : NULL_PAGE_RESULTS,
    similarityPosition : NULL_PAGE_RESULTS,
    rankPosition : NULL_PAGE_RESULTS,
  } : state;
  switch (action.type) {
    case GETMAJORPOSITIONS:
      newData = arr.map((n,i)=>{
        return {
          firstLine: n.position_name,
          secondLine: n.major,//n.industry_alias,
          categary: n.major,
          x: i + 1, y: parseInt(n.ratio * 1000, 10) / 10,
          n: n,
        };
      });
      data = Object.assign({}, _state.majorPosition, {
        results: action.isRefreshing ? [...newData] : [..._state.majorPosition.results, ...newData],
        count: action.json.count,
        total_num: action.json.total_num,
        major_level2: '',
        current_page: action.json.current_page,
        per_page: action.json.per_page,
      });
      return Object.assign({}, _state, { majorPosition : data});
    case GETSCHOOLMAJORPOSITIONS:
      newData = arr.map((n,i)=>{
        return {
          firstLine: n.position_name,
          secondLine: n.school_name,
          categary: n.major,
          x: i + 1, y: parseInt(n.ratio * 1000, 10) / 10,
          n: n,
        };
      });
      data = Object.assign({}, _state.schoolPosition, {
        results: action.isRefreshing ? [...newData] : [..._state.schoolPosition.results, ...newData],
        count: action.json.count,
        total_num: action.json.total_num,
        major_level2: '',
        current_page: action.json.current_page,
        per_page: action.json.per_page,
      });
      return Object.assign({}, _state, { schoolPosition : data});
    case GETSCHOOLMAJORSIMILARITYPOSITIONS:
      newData = arr.map((n,i)=>{
        return {
          firstLine: n.position_name,
          secondLine: n.school_name,
          category: n.major,
          x: i + 1, y: parseInt(n.ratio * 1000, 10) / 10,
          n: n,
        };
      });
      data = Object.assign({}, _state.similarityPosition, {
        results: action.isRefreshing ? [...newData] : [..._state.similarityPosition.results, ...newData],
        count: action.json.count,
        total_num: action.json.total_num,
        major_level2: action.json.major_level2,
        current_page: action.json.current_page,
        per_page: action.json.per_page,
      });
      return Object.assign({}, _state, { similarityPosition : data});
    case GETPOSITIONSBYRANK:
      newData = arr.sort(function(a, b) {
          return b.avg_salary - a.avg_salary;
        }).map((n,i)=>{
        return {
          firstLine: n.position_name,
          secondLine: n.rank,
          categary: n.person_num,
          //按x轴排序
          x: i + 1,
          y: parseInt(n.avg_salary * 10, 10) / 10,
          n: n,
        };
      });
      data = Object.assign({}, _state.rankPosition, {
        results: action.isRefreshing ? [...newData] : [..._state.rankPosition.results, ...newData],
        count: action.json.count,
        total_num: action.json.total_num,
        major_level2: '',
        current_page: action.json.current_page,
        per_page: action.json.per_page,
      });
      return Object.assign({}, _state, { rankPosition : data});
    default:
      return state;
  }
};

export const certList = (
  state: CertListState = NULL_CERTLIST,
  action = {}
) => {
  let type = "";
  let obj = {}
  switch (action.type) {
    case CERTLIST:
      action.json.results.map((n,i)=>{
        if(!type && n.hasOwnProperty('type')){
          type = n.type || 'common';
        }
      })
      console.log("CERTLIST==", state, type)
      obj[type] = action.json
      return Object.assign({}, state, obj);
    default:
      return state;
  }
};

export const skillList = (
  state: SkillListState = NULL_SKILLLIST,
  action = {}
) => {
  let type = "";
  let obj = {}
  switch (action.type) {
    case SKILLLIST:
      action.json.results.map((n,i)=>{
        if(!type && n.hasOwnProperty('type')){
          type = n.type;
        }
      })
      //console.log("SKILLLIST==", state, type)
      obj[type] = action.json
      return Object.assign({}, state, obj);
    default:
      return state;
  }
};

export const skillCourseList = (
  state: SkillCourseListState = NULL_COURSELIST,
  action = {}
) => {
  let type = "";
  let obj = {}
  switch (action.type) {
    case SKILLCOURSELIST:
      type = action.name || "common";
      console.log("SKILLCOURSELIST==", state, type, action)
      obj[type] = action.json
      return Object.assign({}, state, obj);
    default:
      return state;
  }
};

export const userJobPlanList = (
  state: UserJobPlanListState = NULL_USERJOBPLANLIST,
  action = {}
) => {
  switch (action.type) {
    case GETJOBPLANLIST:
      return [...action.json];
    default:
      return state;
  }
};

export const punchMorningTypeList = (
  state: PunchTypeListState = NULL_PUNCHTYPELIST,
  action = {}
) => {
  switch (action.type) {
    case MORNINGPUNCHTYPE:
      return [...action.json];
    default:
      return state;
  }
};

export const punchMorningList = (
  state: PunchListState = NULL_PUNCHLIST,
  action = {}
) => {
  switch (action.type) {
    case MORNINGPUNCHLIST:
      console.log("MORNINGPUNCHLIST===", action.json)
      return [...action.json];
    default:
      return state;
  }
};

export const punchSkillList = (
  state: PunchListState = NULL_PUNCHLIST,
  action = {}
) => {
  let data = {};
  switch (action.type) {
    case SKILLPUNCHLIST:
      //可以通过多个id查询返回任务列表,除了我的技能，其他类别只要在任务列表中，即表示已完成。
      //我的技能必须是status是done表示已完成
      console.log("[][]SKILLPUNCHLIST===", action.json)
      action.json.map((n,i)=>{
        if(!data[n.type]) data[n.type] = [];
        data[n.type].push(n);
      })
      return Object.assign({}, state, data);
    default:
      return state;
  }
};

export const punchCertList = (
  state: PunchListState = NULL_PUNCHLIST,
  action = {}
) => {
  let data = {};
  switch (action.type) {
    case CERTPUNCHLIST:
      console.log("[][]CERTPUNCHLIST===", action.json, state)
      action.json.map((n,i)=>{
        if(!data[n.type]) data[n.type] = [];
        data[n.type].push(n);
      })
      return Object.assign({}, state, data);
    default:
      return state;
  }
};

//
export const punchStateWeek = (
  state: PunchStateWeek = NULL_PUNCHSTATEWEEK,
  action = {}
) => {
  switch (action.type) {
    case PUNCHSTATE:
      console.log("[][]PUNCHSTATE===", action.json, state)
      return Object.assign({}, state, action.json);
    default:
      return state;
  }
};

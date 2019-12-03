/* @flow */
import { createSelector } from "reselect";
import { NULL_CURRENTJOBPLAN } from "@src/nullObjects";
import { formatPower } from "@utils/user";

//import { getDrafts } from '../directSelectors';
//import type { Narrow } from '../types';

//每日打卡任务完成情况列表
const punchMorningTypeList = (state: Object): Object[] => state.punchMorningTypeList;
const punchMorningList = (state: Object): Object[] => state.punchMorningList;
export const getMorningTaskList = createSelector(
  punchMorningTypeList,
  punchMorningList,
  (typeList, list) => {
    if (!Array.isArray(typeList) || !Array.isArray(list)) return [];
    return typeList.map((n, i) => {
      let is_check = false;
      list.map((n2, i2) => {
        list[i2].children.map((n3, i3) => {
          if (!is_check) {
            is_check = (n3 && n3.id === n.id) ? true : false;
          }
        });
      });
      return Object.assign(n, {
        is_check: is_check
      });
    });
  }
);

//通用技能课程任务完成情况列表
const skillCourseList = (state: Object): Object[] => state.skillCourseList;
const punchSkillList = (state: Object): Object[] => state.punchSkillList;
export const getSkillCourseTaskList = createSelector(
  skillCourseList,
  punchSkillList,
  (courseList, punchList) => {
    let newObj = {};
    if (!Object.keys(courseList).length || !Object.keys(punchList).length) return {};
    let checkedIds = [];
    let checkedIdsData = {};
    //console.log("getSkillCourseTaskList punchList.common===", courseList, punchList)
    if(punchList.common) checkedIds = punchList.common.filter((n,i)=>{
      return n.type == "common" //n.profession_id == null && n.type == "通用技能"
    }).map((n,i)=>{
      checkedIdsData[n.skill_course_id]=n;
      return n.skill_course_id;
    })
    //console.log("checkedIds====", checkedIds)
    Object.keys(courseList).map((k, i) => {
      if(Array.isArray(courseList[k].results) && checkedIds.length) newObj[k] = Object.assign({}, courseList[k], {
        results: courseList[k].results.map((n,j)=>{
          //console.log("includes====n", n)
          const is_check = checkedIds.includes(n.id) ? true : false;
          return Object.assign({}, n, {
            is_check: is_check,
            data: is_check ? checkedIdsData[n.id] : {},
          })
        })
      })
    });
    console.log("courseList====", courseList, newObj)
    return newObj;
  }
);

//目标技能课程任务完成情况列表
export const getSkillCourseProTaskList = createSelector(
  skillCourseList,
  punchSkillList,
  (courseList, punchList) => {
    //console.log("getSkillCourseProTaskList===22", courseList,punchList)
    let newObj = {};
    if (!Object.keys(courseList).length || !Object.keys(punchList).length) return {};
    let checkedIds = [];
    //console.log("punchList.goal===22", punchList)
    if(punchList.goal) checkedIds = punchList.goal.filter((n,i)=>{
      return n.profession_id && n.type == "goal" //n.profession_id == null && n.type == "通用技能"
    }).map((n,i)=>{
      return n.skill_course_id;
    })
    console.log("checkedIds pro====", checkedIds)
    Object.keys(courseList).map((k, i) => {
      if(Array.isArray(courseList[k].results) && checkedIds.length) newObj[k] = Object.assign({}, courseList[k], {
        results: courseList[k].results.map((n,j)=>{
          const is_check = (checkedIds.includes(n.id) || n.is_punch) ? true : false;
          return Object.assign({}, n, {
            is_check: is_check,
          })
        })
      })
    });
    console.log("pro [][]courseList====", courseList, newObj)
    return newObj;
  }
);

//通用证书任务完成情况列表
const certList = (state: Object): Object[] => state.certList;
const punchCertList = (state: Object): Object[] => state.punchCertList;
export const getCertTaskList = createSelector(
  certList,
  punchCertList,
  (courseList, punchList) => {
    console.log("getCertTaskList===22", courseList, punchList)
    let newObj = {};
    if (!Object.keys(courseList).length || !Object.keys(punchList).length) return {};
    let checkedIds = {};
    let _checkedIds = [];
    if(punchList.common) punchList.common.filter((n,i)=>{
      return n.type == "common" || n.certificate_type == "common"
    }).map((n,i)=>{
      checkedIds[n.certificate.certificate.id] = n.certificate;
      return n.title;
    })
    _checkedIds = Object.keys(checkedIds);
    Object.keys(courseList).map((k, i) => {
      if(Array.isArray(courseList[k].results) && _checkedIds.length) newObj[k] = Object.assign({}, courseList[k], {
        results: courseList[k].results.map((n,j)=>{
          const is_check = _checkedIds.includes(n.id.toString()) ? true : false;
          return Object.assign({}, n, {
            is_check: is_check,
            certificate: checkedIds[n.id],
          })
        })
      })
    });
    console.log("cert courseList====", courseList, newObj)
    return newObj;
  }
);

//目标职位证书任务完成情况列表
export const getCertProTaskList = createSelector(
  certList,
  punchCertList,
  (courseList, punchList) => {
    console.log("getCertTaskList goal===22", courseList, punchList)
    let newObj = {};
    if (!Object.keys(courseList).length || !Object.keys(punchList).length) return {};
    let checkedIds = {};
    let _checkedIds = [];
    if(punchList.goal) punchList.goal.filter((n,i)=>{
      return n.type == "goal" || n.certificate_type == "goal"
    }).map((n,i)=>{
      checkedIds[n.certificate.certificate.id] = n.certificate;
      return n.title;
    })
    _checkedIds = Object.keys(checkedIds);
    console.log("_checkedIds===[][]", _checkedIds, checkedIds)
    Object.keys(courseList).map((k, i) => {
      if(Array.isArray(courseList[k].results) && _checkedIds.length) newObj[k] = Object.assign({}, courseList[k], {
        results: courseList[k].results.map((n,j)=>{
          //console.log("is_check===[][]", _checkedIds, n.id)
          const is_check = _checkedIds.includes(n.id.toString()) ? true : false;
          return Object.assign({}, n, {
            is_check: is_check,
            certificate: checkedIds[n.id],
          })
        })
      })
    });
    console.log("cert pro courseList====", courseList, newObj)
    return newObj;
  }
);

//当前选中目标职位
const userJobPlanList = (state: Object): Object[] => state.userJobPlanList;
export const currentJobPlan = createSelector(
  userJobPlanList,
  (userJobPlanList) => {
    const found = userJobPlanList.filter(item => item.is_default);
    //NULL_CURRENTJOBPLAN //
    //return NULL_CURRENTJOBPLAN;
    return found.length == 1 ? found.map((n,i)=>{
      return Object.assign({}, n, {
        position: Object.assign({}, n.position, {
          title: n.position.name,
        })
      })
    })[0] : NULL_CURRENTJOBPLAN;
  }
);

//当前周任务完成数
const punchStateWeek = (state: Object): Object[] => state.punchStateWeek;
export const taskWeekList = createSelector(
  punchStateWeek,
  (punchStateWeek) => {
    console.log("punchStateWeek.task_info.data==", punchStateWeek.task_info.data)
    return {
      weekTask: punchStateWeek.task_info.total || 0.0,
      //up_power?
      weekPowerUp: formatPower(punchStateWeek.power_up) || 0,
      weekDays: punchStateWeek.task_info.data || Array.from({length: 7}).map((n,i)=>{return 0}),
    }
  }
);


//技能完成数量
const skillState = (state: Object): Object[] => state.skillState;
export const skillTaskState = createSelector(
  skillState,
  (skillState) => {
    return {
      common: skillState.common,
      goal: skillState.goal,
      custom: skillState.custom,
      other: skillState.other,
    }
  }
);

//证书完成数量
const certState = (state: Object): Object[] => state.certState;
export const certTaskState = createSelector(
  certState,
  (certState) => {
    return {
      common: certState.common,
      goal: certState.goal,
      custom: certState.custom,
      other: certState.other,
    }
  }
);


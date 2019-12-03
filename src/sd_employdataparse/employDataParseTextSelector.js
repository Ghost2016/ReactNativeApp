/* @flow */
import { createSelector } from "reselect";
import {
  getSchoolName,
  getMajor,
  getSalaryCaseCount,
  getDomianCaseCount,
  getCompanyCaseCount,
  getFurtherStudyCaseCount
} from "../directSelectors";

export const getSalaryParseText = createSelector(
  [getSchoolName, getMajor, getSalaryCaseCount],
  (schoolName, major, count) => {
    return `本数据收集了${count}个${schoolName}及${major}真实就业案例，为你全面解析本学校本专业就业情况`;
  }
);

export const getDomainParseText = createSelector(
  [getSchoolName, getMajor, getDomianCaseCount],
  (schoolName, major, count) => {
    return `本数据收集了${count}个${schoolName}及${major}真实就业案例，为你全面解析本学校本专业就业情况`;
  }
);

export const getCompanyParseText = createSelector(
  [getSchoolName, getMajor, getCompanyCaseCount],
  (schoolName, major, count) => {
    return `本数据收集了${count}个${schoolName}及${major}真实就业案例，为你全面解析本学校本专业就业情况`;
  }
);

export const getFurtherStudyParseText = createSelector(
  [getMajor, getFurtherStudyCaseCount],
  (major, count) => {
    return `本数据收集了${count}个${major}真实就业案例，为你全面解析本学校本专业就业情况`;
  }
);

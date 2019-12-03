/* @flow */
import { createSelector } from "reselect";
import { getSearchRecord } from "../directSelectors";

export const getSchoolSearchData = createSelector(
  [getSearchRecord],
  searchRecord => {
    // return searchRecord.schoolData.filter((item, index, self) => {
    //   return self.indexOf(item) == index;
    // }).slice(0, 10);
    let distinctObj = {};
    let distinctArr = [];
    searchRecord.schoolData.forEach(element => {
      distinctObj[element.id] = element;
    });
    for (let key in distinctObj) {
      distinctArr.push(distinctObj[key]);
    }
    return distinctArr;
  }
);

export const getMajorSearchData = createSelector(
  [getSearchRecord],
  searchRecord => {
    // return searchRecord.majorData.slice(0, 10);
    let distinctObj = {};
    let distinctArr = [];
    searchRecord.majorData.forEach(element => {
      distinctObj[element.id] = element;
    });
    for (let key in distinctObj) {
      distinctArr.push(distinctObj[key]);
    }
    return distinctArr;
  }
);

export const getJobSearchData = createSelector(
  [getSearchRecord],
  searchRecord => {
    // return searchRecord.jobData.slice(0, 10);
    let distinctObj = {};
    let distinctArr = [];
    searchRecord.jobData.forEach(element => {
      distinctObj[element.id] = element;
    });
    for (let key in distinctObj) {
      distinctArr.push(distinctObj[key]);
    }
    return distinctArr;
  }
);
export const getIndustrySearchData = createSelector(
  [getSearchRecord],
  searchRecord => {
    // return searchRecord.industryData.slice(0, 10);
    let distinctObj = {};
    let distinctArr = [];
    searchRecord.industryData.forEach(element => {
      distinctObj[element.id] = element;
    });
    for (let key in distinctObj) {
      distinctArr.push(distinctObj[key]);
    }
    return distinctArr;
  }
);

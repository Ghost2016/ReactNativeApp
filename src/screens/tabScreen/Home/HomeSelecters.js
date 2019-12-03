/* @flow */
import { createSelector } from "reselect";
//import { formatPower } from "@utils/user";
import { NULL_CITY } from "@src/nullObjects";
//import { getDrafts } from '../directSelectors';

//首页数据查询城市数据
const searchCityData = (state: Object): Object[] => state.searchCityData;
export const searchCityDataState = createSelector(
  searchCityData,
  (list) => {
    return (list && list.results && list.results.length == 1) ? {
      id: list.results[0].id,
      title: list.results[0].name,
      province: {
        id: list.results[0].parent.id,
        title: list.results[0].parent.name,
        alias: ""
      }} : NULL_CITY;
  }
);

//首页数据查询学校列表
const searchSchoolData = (state: Object): Object[] => state.searchSchoolData;
export const searchSchoolDataList = createSelector(
  searchSchoolData,
  (list) => {
    return list;
  }
);

//首页数据查询一级本科专业列表
const searchLevelOneMajorDataB = (state: Object): Object[] => state.searchLevelOneMajorDataB;
export const searchLevelOneMajorDataBList = createSelector(
  searchLevelOneMajorDataB,
  (list) => {
    return Object.assign({}, list, {
      results: list.results.map((n,i)=>{
        return {
          id: i,
          name: n.level1,
        }
      }),
    });
  }
);

//首页数据查询一级专科专业列表
const searchLevelOneMajorDataC = (state: Object): Object[] => state.searchLevelOneMajorDataC;
export const searchLevelOneMajorDataCList = createSelector(
  searchLevelOneMajorDataC,
  (list) => {
    return Object.assign({}, list, {
      results: list.results.map((n,i)=>{
        return {
          id: i,
          name: n.level1,
        }
      }),
    });
  }
);

//首页数据查询一级硕士专业列表
const searchLevelOneMajorDataM = (state: Object): Object[] => state.searchLevelOneMajorDataM;
export const searchLevelOneMajorDataMList = createSelector(
  searchLevelOneMajorDataM,
  (list) => {
    return Object.assign({}, list, {
      results: list.results.map((n,i)=>{
        return {
          id: i,
          name: n.level1,
        }
      }),
    });
  }
);

//首页数据查询一级博士专业列表
const searchLevelOneMajorDataD = (state: Object): Object[] => state.searchLevelOneMajorDataD;
export const searchLevelOneMajorDataDList = createSelector(
  searchLevelOneMajorDataD,
  (list) => {
    return Object.assign({}, list, {
      results: list.results.map((n,i)=>{
        return {
          id: i,
          name: n.level1,
        }
      }),
    });
  }
);


const tidyMajorLevel2 = (list) => {
  const level2Arr = {}
    //BI接口返回的数据包含二三级数据，需要自己过滤
    list.results.map((n,i)=>{
      if(!Object.keys(level2Arr).includes(n.level2)) {
        level2Arr[n.level2]={
          id: 100000 + n.id,
          name: n.level2,
          level: n.level,
          list: [{
            id: n.id,
            name: n.major,
            level: n.level,
          }]
        }
      } else {
        level2Arr[n.level2].list.push({
          id: n.id,
          name: n.major,
          level: n.level,
        })
      }
    })
    return level2Arr;
}

const tidayMajorLevelDataByKey = (list) => {
  let level2Arr = []
  //BI接口返回的数据包含二三级数据，需要自己过滤
  //console.log("searchMajorDataBList selecter ===", Object.keys(list))
  let data = {}
  if(typeof list == "object" && Object.keys(list).length) Object.keys(list).map(k=>{
    if(typeof list[k] == "object" && !Array.isArray(list[k])) {
      level2Arr = tidyMajorLevel2(list[k])
      //onsole.log("searchMajorDataBList selecter ===level2Arr", list[k], level2Arr)
      data[k] = Object.assign({}, list[k], {
        results: Object.keys(level2Arr).map((k)=>{
          return level2Arr[k]
        }),
      });
    }
  })
  //console.log("searchMajorDataBList selecter ===data", data)
  return data;
}

/*
    "id": 509,
      "major": "塔吉克语",
      "level1": "文学",
      "level2": "外国语言文学类",
      "level": "本科"
    */
//searchMajorDataB 首页数据查询二级本科专业列表
const searchMajorDataB = (state: Object): Object[] => state.searchMajorDataB;
export const searchMajorDataBList = createSelector(
  searchMajorDataB,
  (list) => {
    return tidayMajorLevelDataByKey(list);
    /* return Object.assign({}, list, {
      results: Object.keys(level2Arr).map((k)=>{
        return level2Arr[k]
      }),
    }); */
  }
);

//首页数据查询二级专科专业列表
const searchMajorDataC = (state: Object): Object[] => state.searchMajorDataC;
export const searchMajorDataCList = createSelector(
  searchMajorDataC,
  (list) => {
    return tidayMajorLevelDataByKey(list);
    /* const level2Arr = tidyMajorLevel2(list)
    //BI接口返回的数据包含二三级数据，需要自己过滤
    return Object.assign({}, list, {
      results: Object.keys(level2Arr).map((k)=>{
        return level2Arr[k]
      }),
    }); */
  }
);

//首页数据查询二级硕士专业列表
const searchMajorDataM = (state: Object): Object[] => state.searchMajorDataM;
export const searchMajorDataMList = createSelector(
  searchMajorDataM,
  (list) => {
    return tidayMajorLevelDataByKey(list);
    /* const level2Arr = tidyMajorLevel2(list)
    //BI接口返回的数据包含二三级数据，需要自己过滤
    return Object.assign({}, list, {
      results: Object.keys(level2Arr).map((k)=>{
        return level2Arr[k]
      }),
    }); */
  }
);

//首页数据查询二级博士专业列表
const searchMajorDataD = (state: Object): Object[] => state.searchMajorDataD;
export const searchMajorDataDList = createSelector(
  searchMajorDataD,
  (list) => {
    return tidayMajorLevelDataByKey(list);
    /* const level2Arr = tidyMajorLevel2(list)
    //BI接口返回的数据包含二三级数据，需要自己过滤
    return Object.assign({}, list, {
      results: Object.keys(level2Arr).map((k)=>{
        return level2Arr[k]
      }),
    }); */
  }
);

//首页数据查询职位列表
const searchPositionData = (state: Object): Object[] => state.searchPositionData;
export const searchPositionDataList = createSelector(
  searchPositionData,
  (list) => {
    return list;
  }
);

//首页数据查询二级职位列表
const searchSubPositionData = (state: Object): Object[] => state.searchSubPositionData;
export const searchSubPositionDataList = createSelector(
  searchSubPositionData,
  (list) => {
    let data = {}
    if(typeof list == "object" && Object.keys(list).length) Object.keys(list).map(k=>{
      if(typeof list[k] == "object" && !Array.isArray(list[k])) {
        data[k] = Object.assign({}, list[k]);
      }
    })
    //console.log("searchSubPositionDataList selecter ===data", data)
    return data;
  }
);

//首页数据查询行业列表
const searchIndustryData = (state: Object): Object[] => state.searchIndustryData;
export const searchIndustryDataList = createSelector(
  searchIndustryData,
  (list) => {
    return list;
  }
);

const city = (state: Object): Object[] => state.user.city;
export const userCity = createSelector(
  city,
  (city) => {
    //console.warn("city.id", city)
    if(city && city.id && city.hasOwnProperty('common_level')){
      return {
        id: city.id,
        title: city.name,
        province: {
          id: city.parent.id,
          title: city.parent.name,
          alias: ""
        }
      }
    } else {
      return NULL_CITY
    }
  }
);


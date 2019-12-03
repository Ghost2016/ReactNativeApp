import type {
    SearchSchoolDataModel,
    SearchLevelOneMajorDataModel,
    SearchMajorDataModel,
    SearchIndustryDataModel,
    SearchPositionDataModel,
    PageResultModel,
} from "@src/types";

import {
    NULL_SEARCH_POSITION_DATA,
    NULL_SEARCH_INDUSTRY_DATA,
    NULL_SEARCH_MAJOR_DATA,
    NULL_SEARCH_LEVEL_ONE_MAJOR_DATA,
    NULL_SEARCH_SCHOOL_DATA,
    NULL_PAGE_RESULTS,
  } from "@src/nullObjects";

const SEARCHPOSITIONDATA = "SEARCHPOSITIONDATA";
const SEARCHSUBPOSITIONDATA = "SEARCHSUBPOSITIONDATA";
const SEARCHINDUSTRYDATA = "SEARCHINDUSTRYDATA";
const SEARCHMAJORDATAB = "SEARCHMAJORDATAB";
const SEARCHMAJORDATAC = "SEARCHMAJORDATAC";
const SEARCHMAJORDATAM = "SEARCHMAJORDATAM";
const SEARCHMAJORDATAD = "SEARCHMAJORDATAD";
const SEARCHLEVELONEMAJORDATAB = "SEARCHLEVELONEMAJORDATAB";
const SEARCHLEVELONEMAJORDATAC = "SEARCHLEVELONEMAJORDATAC";
const SEARCHLEVELONEMAJORDATAM = "SEARCHLEVELONEMAJORDATAM";
const SEARCHLEVELONEMAJORDATAD = "SEARCHLEVELONEMAJORDATAD";
const SEARCHSCHOOLDATA = "SEARCHSCHOOLDATA";
const SEARCHCITYDATA = "SEARCHCITYDATA";

const mergeResults = (state, json, keyName) => {
    let temp = {}
    if(json && json.results){
        if (keyName) {
            //console.log("mergeResults===", keyName, state, json)
            temp[keyName] = {
                results: state ? [...state[keyName].results, ...json.results] : [...json.results],
                count: json.count,
                current_page: json.current_page,
                per_page: json.per_page,
            }
        } else {
            temp = {
                results: state ? [...state.results, ...json.results] : [...json.results],
                count: json.count,
                current_page: json.current_page,
                per_page: json.per_page,
            }
        }
    }
    //console.log("mayResetState", 1)
    return Object.assign({}, state, temp);
}

//需要重置state为空的情况
const mayResetState = (state, action, keyName) => {
    let temp = {}
    //console.warn('mayResetState', state, action, keyName)
    temp = (!action || action.isRefresh) ? null : state;
    const tmp = mergeResults(temp, action.json, keyName)
    //console.warn('mayResetState tmp', tmp)
    return Object.assign({}, temp, tmp);
}

export const searchCityData = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    action = {}
) => {
    switch (action.type) {
        case SEARCHCITYDATA:
            return Object.assign({}, state, action.json);
        default:
            return state;
    }
};

export const searchSchoolData = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    action = {}
) => {

    switch (action.type) {
        case SEARCHSCHOOLDATA:
            return mayResetState(state, action);
        default:
            return state;
    }
};

// 本科
export const searchLevelOneMajorDataB = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    action = {}
) => {
    switch (action.type) {
        case SEARCHLEVELONEMAJORDATAB:
        return Object.assign({}, state, action.json);
        default:
        return state;
    }
};

// 专科
export const searchLevelOneMajorDataC = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    action = {}
) => {
    switch (action.type) {
        case SEARCHLEVELONEMAJORDATAC:
        return Object.assign({}, state, action.json);
        default:
        return state;
    }
};

// 硕士
export const searchLevelOneMajorDataM = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    action = {}
) => {
    switch (action.type) {
        case SEARCHLEVELONEMAJORDATAM:
        return Object.assign({}, state, action.json);
        default:
        return state;
    }
};

// 博士
export const searchLevelOneMajorDataD = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    action = {}
) => {
    switch (action.type) {
        case SEARCHLEVELONEMAJORDATAD:
        return Object.assign({}, state, action.json);
        default:
        return state;
    }
};

//本科
export const searchMajorDataB = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    //state: object = {},
    action = {}
) => {
    switch (action.type) {
        case SEARCHMAJORDATAB:
            return mayResetState(state, action, action.keyName || "");
        default:
            return state;
    }
};

//专科
export const searchMajorDataC = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    //state: object = {},
    action = {}
) => {
    switch (action.type) {
        case SEARCHMAJORDATAC:
            return mayResetState(state, action, action.keyName || "");
        default:
            return state;
    }
};

//硕士
export const searchMajorDataM = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    //state: object = {},
    action = {}
) => {
    switch (action.type) {
        case SEARCHMAJORDATAM:
            return mayResetState(state, action, action.keyName || "");
        default:
            return state;
    }
};

//博士
export const searchMajorDataD = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    //state: object = {},
    action = {}
) => {
    switch (action.type) {
        case SEARCHMAJORDATAD:
            return mayResetState(state, action, action.keyName || "");
        default:
            return state;
    }
};

export const searchIndustryData = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    action = {}
) => {
    switch (action.type) {
        case SEARCHINDUSTRYDATA:
            return mayResetState(state, action);
        default:
            return state;
    }
};

export const searchPositionData = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    action = {}
) => {
    switch (action.type) {
        case SEARCHPOSITIONDATA:
            return mayResetState(state, action, action.keyName || "");
        default:
            return state;
    }
};

export const searchSubPositionData = (
    state: PageResultModel = NULL_PAGE_RESULTS,
    action = {}
) => {
    switch (action.type) {
        case SEARCHSUBPOSITIONDATA:
            //console.log("SEARCHSUBPOSITIONDATA action===", action)
            return mayResetState(state, action, action.keyName || "");
        default:
            return state;
    }
};


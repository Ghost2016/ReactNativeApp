// import {
//   LOGOUT,
//   LOGIN_SUCCESS,
//   ACCOUNT_SWITCH,
//   INIT_USERS,
//   REALM_INIT,
//   EVENT_USER_ADD,
//   EVENT_USER_REMOVE,
//   EVENT_USER_UPDATE
// } from "../actionConstants";
// import { NULL_ARRAY } from "../nullObjects";

// const initialState: UsersState = NULL_ARRAY;
import type { UserState } from "@src/types";
import { NULL_USERSTATE } from "@src/nullObjects";
import { LocalModel, WeChatTokenModel, LoginType, NotifyModel, SchoolAccountModel, UserAccoutnModel } from "../types";
import { NULL_LOCATION, NULL_WECHAT_TOKEN } from "../nullObjects";
import { ADD_WATCH, CANCEL_WATCH } from "../actionConstants";

const SETAPPTOKEN = "SETAPPTOKEN";
const SETAPPNEWTOKEN = "SETAPPNEWTOKEN";
const CLEANAPPTOKEN = "CLEANAPPTOKEN";
const SETUSERSTATE = "SETUSERSTATE";
const UPDATE_USER_INFO = "UPDATE_USER_INFO";

export const user = (state: UserState = NULL_USERSTATE, action = {}) => {
  console.log("user reducer==", action)
  switch (action.type) {
    case SETAPPTOKEN:
      console.log("SETAPPTOKEN==", action.json)
      return Object.assign({}, state, { token: action.json });
    case SETAPPNEWTOKEN:
      return Object.assign({}, state, { newToken: action.json });
    case CLEANAPPTOKEN:
      return Object.assign({}, state, NULL_USERSTATE);
    case SETUSERSTATE:
      let obj = {
        power: action.json.power,
        salary: action.json.salary,
      }
      if(action.json.up_power) obj = Object.assign(obj, {
        up_power: action.json.up_power,
        up_salary: action.json.up_salary,
      })
      return Object.assign({}, state, obj);
    case UPDATE_USER_INFO:
      return Object.assign({}, state, action.json);
    case ADD_WATCH:
      return Object.assign({}, state, {
        total: {
          ...state.total,
          watches: state.total.watches + 1
        }
      });
    case CANCEL_WATCH:
      return Object.assign({}, state, {
        total: {
          ...state.total,
          watches: state.total.watches - 1
        }
      });
    case "UPDATE_USER_PHONE":
      return Object.assign({}, state, {
        phone: action.json
      });
    case "GET_IM_SIG":
      return Object.assign({}, state, {
        sig: action.json
      });
    default:
      return state;
  }
};

export const location = (state: LocalModel = NULL_LOCATION, action = {}) => {
  switch (action.type) {
    case "UPDATE_LOCATION":
      return Object.assign({}, state, action.json);
    default:
      return state;
  }
};

export const uploadToken = (state = "", action = {}) => {
  switch (action.type) {
    case "UPDATE_UPLODE_TOKEN":
      return action.json;
    default:
      return state;
  }
};

export const wechatToken = (
  state: WeChatTokenModel = NULL_WECHAT_TOKEN,
  action = {}
) => {
  switch (action.type) {
    case "UPDATE_WECHAT_TOKEN":
      return action.json;
    default:
      return state;
  }
};

export const loginType = (state: LoginType = "", action = {}) => {
  switch (action.type) {
    case "UPDATE_LOGIN_TYPE":
      return action.json;
    default:
      return state;
  }
};

type NotifyList = {
  typeNotify: object,
  unReadCount: number
};

export const notifyInfo = (
  state: NotifyList = {
    typeNotify: {},
    unReadCount: 0
  },
  action = {}
) => {
  switch (action.type) {
    case "GET_UNREAD_NOTIFY":
      return Object.assign({}, state, {
        unReadCount: action.json.count
      });
    case "READ_UNREAD_NOTIFY":
      return Object.assign({}, state, {
        unReadCount: state.unReadCount - 1 >= 0 ? state.unReadCount - 1 : 0
      });
    case "GET_TYPE_NOTIFY":
      return Object.assign({}, state, {
        typeNotify: action.json
      });
    default:
      return state;
  }
};

// 是否第一次安装App 打开App
export const isFirstStart = (state = true, action = {}) => {
  switch (action.type) {
    case "SETAPPOPENED":
      return false;
    default:
      return state;
  }
};

export const schoolAccount = (state: UserAccoutnModel[] = [], action = {}) => {
  switch (action.type) {
    case "GETSCHOOLACCOUNT":
      return action.json;
    case "ADDSCHOOLACCOUNT": 
      return [action.json].concat(state);
    default:
      return state;
  }
};

// 是否第一次进入首页
export const isFirstEnterIndex = (state = true, action = {}) => {
  switch (action.type) {
    case "SETAPPNOTFIRSTENTERINDEX":
      return false;
    default:
      return state;
  }
};

// 是否第一次进入排名
export const isFirstEnterRank = (state = true, action = {}) => {
  switch (action.type) {
    case "SETAPPNOTFIRSTENTERRANK":
      return false;
    default:
      return state;
  }
};

// 主页live课程的列表
export const homeLiveCourseList = (state = [], action = {}) => {
  switch (action.type) {
    case "GET_HOME_COURSE":
      return action.json;
    default:
      return state;
  }
};

export const homeNewsList = (state = [], action = {}) => {
  switch (action.type) {
    case "GET_HOME_NEWS":
      return action.json;
    default:
      return state;
  }
};
import {
  otherUserInfoModel,
  UserState,
  LocalModel,
  PunchStatusModel,
  LightBoxState,
  PunchTypeListModel,
  PunchListModel,
  UserJobPlanListModel,
  WeChatTokenModel,
  LoginType,
  PunchStateWeek,
  currentJobPlanModel,
  cityModel,
  SearchSchoolDataModel,
  SearchLevelOneMajorDataModel,
  SearchMajorDataModel,
  SearchIndustryDataModel,
  SearchPositionDataModel,
} from "./types";

/* @flow */

//数据查询职位默认
export const NULL_SEARCH_POSITION_DATA: SearchPositionDataModel = {
  "id": 0,
  "industry_title": "",
  "title": "",
  "description": "",
  "order": 0,
  "is_valid": false,
  "created_time": "",
  "industry": 0
};

//数据查询行业默认
export const NULL_SEARCH_INDUSTRY_DATA: SearchIndustryDataModel = {
  "id": 0,
  "title": "",
  "description": "",
  "order": 0,
  "is_valid": false,
  "created_time": "",
  "parent": null
};

//数据查询专业默认
export const NULL_SEARCH_MAJOR_DATA: SearchMajorDataModel = {
  "id": 0,
  "major": "",
  "level1": "",
  "level2": "",
  "level": ""
};

//数据查询一级专业默认
export const NULL_SEARCH_LEVEL_ONE_MAJOR_DATA: SearchLevelOneMajorDataModel = {
  "level1": ""
};

//数据查询学校默认数据
export const NULL_SEARCH_SCHOOL_DATA: SearchSchoolDataModel = {
  "id": 0,
  "city": NULL_CITY,
  "name": "",
  "alias": null,
  "introduction": null
};

export const nullFunction = () => {};

export const NULL_OBJECT = Object.freeze({});

export const NULL_ARRAY = Object.freeze([]);

export const NULL_CITY: cityModel = {
  id: 32824,
  title: "成都市",
  province: {
    id: 32823,
    title: "四川省",
    alias: ""
  }
};

export const NULL_USERSTATE: UserState = {
  token: "",
  newToken: "",
  avatar_url: "",
  city: NULL_CITY,
  bind_wechat: false,
  content: "",
  courses: [],
  email: "",
  gender: "male",
  id: 0,
  is_verified: false,
  nickname: "",
  phone: "",
  power: 0.0,
  rank: 0,
  salary: 0,
  up_power: 0.0,
  up_salary: 0,
  settings: null,
  sig: "",
  total: {
    certificate_count: 0,
    fans: 0,
    major_name: "",
    degree_name: "",
    punch_count: 0,
    read_count: 0,
    school_name: "",
    tech_count: 0,
    watches: 0,
    college_name: "",
  },
  wechat_info: null,
  created_time: "2018-08-01T00:00:00.215798"
};

export const NULL_OTHERUSERINFO: otherUserInfoModel = {
  id: 0,
  power: 0,
  rank: 0,
  gender: "",
  nickname: "",
  edu_info: {
    school_name: "",
    major_name: "",
    degree_name: ""
  },
  is_verified: false,
  watch_info: {
    fans: 0,
    watches: 0,
    related: ''
  },
  avatar_url: "",
  task_info: {
    read_count: 0,
    punch_count: 0,
    tech_count: 0,
    certificate_count: 0
  }
};

export const NULL_LOCATION: LocalModel = {
  accuracy: 0,
  altitude: 0,
  latitude: 0,
  longitude: 0,
  speed: 0,
  timestamp: 0
};



export const NULL_PUNCHSTATEWEEK: PunchStateWeek = {
  power_up : 0,
  task_info : {
    data: [],
    total: 0,
  }
};

export const NULL_PUNCH: PunchStatusModel = {
  status: "new",
  is_remind: true,
  location: "",
  description: {}
};

export const NULL_LIGHTBOX: LightBoxState = {
  name: ""
};

export const NULL_PUNCHTYPELISTMODEL: PunchTypeListModel = {
  id: 0,
  start_time: "",
  end_time: "",
  title: ""
};
//用于保存每日打卡任务列表
export const NULL_PUNCHTYPELIST: array = [];

//默认目标职位
export const NULL_CURRENTJOBPLAN: currentJobPlanModel = {
  created_time:"",
  id:0,
  is_default:false,
  path:null,
  position: {
    title: "",
  }
};

export const NULL_USERJOBPLANLISTMODEL: UserJobPlanListModel = {
  id: 0,
  path_id: 0,
  salary: 0,
  power: 0.0,
  is_default: false,
  user: null
};
//职业规划列表
export const NULL_USERJOBPLANLIST: array = [];

export const NULL_PUNCHLISTMODEL: PunchListModel = {
  children: [],
  id: 0,
  is_system: true,
  status: "new",
  task: {
    description: "",
    title: ""
  },
  title: ""
};
//用于保存每日打卡完成列表
export const NULL_PUNCHLIST: object = {
  "common": NULL_PAGE_RESULTS,
  "goal": NULL_PAGE_RESULTS,
  "custom": NULL_PAGE_RESULTS,
}

//技能课程模型
export const NULL_COURSE: object = {
  id: 0,
  url: null,
  image: null,
  title: '',
  is_punch: false,
};

//用于保存证书列表
export const NULL_PAGE_RESULTS: object = {
  count: 0,
  current_page: 0,
  per_page: 10,
  total_page: 0,
  total_num: 0,
  major_level2: '',
  total_page: 0,
  results: []
};
//用于保存职业技能列表 (?type=common|goal|custom|other)
export const NULL_SKILLLIST: object = {
  "common": NULL_PAGE_RESULTS,
  "goal": NULL_PAGE_RESULTS,
  "custom": NULL_PAGE_RESULTS,
};
//用于保存职业技能课程列表
export const NULL_COURSELIST: object = {};

//用于保存证书列表 (?type=common|goal|custom|other)
export const NULL_CERTLIST: object = {
  "common": NULL_PAGE_RESULTS,
  "goal": NULL_PAGE_RESULTS,
};

//职业规划类型
export const JOB_PLAN_TYPES: array = ["留学", "求职", "公务员", "考研"];

export const NULL_JOBPLANINDUSTRY: object = {
  id: 0,
  title: "",
  description: "",
  order: 0,
  is_valid: false
};

export const NULL_JOBPLANPOSITION: object = {
  id: 0,
  title: "",
  description: "",
  order: 0,
  is_valid: false,
  industry: 0
};

export const NULL_OTHER_USER_STATE: object = {
  id: 0,
  rank: 0,
  fullName: "",
  score: 0,
  college: "",
  major: "",
  avatarUrl: "",
  is_verified: false,
  sex: 0,
  follow: false,
  beFollowed: false
};

export const NULL_WECHAT_TOKEN: WeChatTokenModel = {
  access_token: "",
  expires_in: 0,
  refresh_token: "",
  openid: "",
  scope: "",
  unionid: ""
};
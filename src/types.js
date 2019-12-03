// export type * from "./actionTypes";
// export type * from "./api/apiTypes";
import { RefElement } from "./refs";

export type ResponseExtractionFunc = any;

export type Orientation = "LANDSCAPE" | "PORTRAIT";

export type ThemeType = "default" | "night";

export type Element = any;

export type Context = {
  navigator: any,
  refs: RefElement,
  navigatorEvent: any
};

export type SettingsState = {
  locale: string,
  theme: ThemeType,
  color: ThemeColor
};

export type TimingItemType = {
  text: string,
  start: number,
  end: number
};

export type UserItem = {
  key: number | string,
  id: number,
  rank: number,
  fullName: string,
  avatarUrl: string,
  score: number,
  college: string,
  major: string,
  follow: boolean,
  beFollowed: boolean
};

export const genderTypes = "male" | "female";

export type PunchStateWeek = {
  power_up: number,
  task_info: {
    data: array,
    total: number
  }
};

//打卡数据模型
export type PunchStatusModel = {
  //status: new doing done
  status: string,
  is_remind: boolean,
  location: string,
  //打卡方式: morning reading cert skill
  description: object
};

//APP用户信息结构
export type UserState = {
  token: string,
  newToken: string,
  avatar: object,
  city: cityModel,
  contact: string,
  // province: object,
  content: string,
  courses: array,
  bind_wechat: boolean,
  email: string,
  gender: genderTypes,
  id: number,
  is_verified: boolean,
  nickname: string,
  real_name: string,
  phone: string,
  power: number,
  rank: number,
  sig: string,
  salary: number,
  up_power: number,
  up_salary: number,
  settings: object,
  total: {
    certificate_count: number,
    fans: number,
    major_name: string,
    degree_name: string,
    punch_count: number,
    read_count: number,
    school_name: string,
    tech_count: number,
    watches: number,
    college_name: string
  },
  wechat_info: {
    head_image_url: string,
    id: string,
    nickname: string
  }
};

//用于保存当前打开的lightbox screen name
export type LightBoxState = {
  name: string
};

//用于打卡任务数据
export type PunchTask = {
  description: string,
  title: string
};

//用于保存每日打卡任务列表
export type PunchTypeListModel = {
  id: number,
  start_time: string,
  end_time: string,
  title: string
};

export type PunchUserCertModel = {
  status: string,
  is_remind: boolean,
  title: string,
  description: string,
  certificate_id: number,
  profession_id: number
};

export type PunchTypeListState = PunchTypeListModel[];

export type PunchListModel = {
  children: PunchTypeListState[],
  id: number,
  is_system: boolean,
  status: string,
  task: PunchTask,
  title: string
};

//用于保存每日打卡完成列表
export type PunchListState = PunchListModel[];

export type CourseModel = {
  id: number,
  url: string | object,
  image: string | object,
  title: string,
  is_punch: boolean
};
export type SkillListModel = {
  id: number,
  order: number | object,
  source: string,
  is_top: boolean,
  //courses: CourseModel[],
  type: string,
  title: string,
  description: string
};
//用于保存职业技能列表
export type SkillListState = {
  count: number,
  current_page: number,
  per_page: number,
  total_page: number,
  results: SkillListModel[]
};

export type SkillCourseListState = {
  count: number,
  current_page: number,
  per_page: number,
  total_page: number,
  results: CourseModel[]
};

export type UserCertListModel = {
  id: number,
  certificate_id: number,
  score: number,
  acquire_date: string,
  attachment_ids: string[]
};

export type CertListModel = {
  id: number,
  name: string,
  code: string,
  type: string | object
};
//用于保存证书列表
export type CertListState = {
  count: number,
  current_page: number,
  per_page: number,
  total_page: number,
  results: CertListModel[]
};

export type currentJobPlanModel = {
  created_time: string,
  id: number,
  is_default: boolean,
  path: null,
  position: object
};

//用于保存职业规划列表
export type UserJobPlanListModel = {
  id: number,
  path_id: number,
  salary: number,
  power: number,
  is_default: boolean,
  user: object
};
export type UserJobPlanListState = UserJobPlanListModel[];

//APP全局state结构，暂无使用
export type GlobalState = {
  token: string,
  user: UserState
};

// export type genderEnum = "female" | "male";

export type cityModel = {
  id: number,
  title: string,
  province: {
    id: number,
    title: string,
    alias: string
  }
};

export type calcSalaryModel = {
  gender: string, // "female" | "male",
  city: string,
  profession: string, //行业
  position: string,
  degree: string, // 学历
  constellation: string, //星座
  question: string //问题
};

export type trendsModel = {
  content: string, // 动态内容
  location: string, // 位置
  images: stirng[], // 图片
  created_time: string // 创建时间
};

export type certificateModel = {
  id: number,
  // name: string, // 证书名称
  score: number, // 证书成绩
  certificate: certificateItem,
  created_time: string,
  acquire_date: string, // 获取时间
  certificate: {
    id: number,
    name: string,
    code: string,
    type: string
  },
  attachments: imagesModel[],
  audit_status: string
};

export type certificateItem = {
  id: number,
  name: string,
  code: string,
  type: any
};

export type userBaseInfoModel = {
  id: number,
  token: string,
  name: stirng,
  gender: genderTypes,
  isVerified: boolean,
  city: cityModel,
  phone: string,
  avatar: object,
  certificate_count: number,
  fans: number,
  major_name: string,
  punch_count: number,
  read_count: number,
  school_name: string,
  tech_count: number,
  watches: number
};

export type otherUserInfoModel = {
  id: number,
  power: number,
  rank: number,
  gender: string,
  nickname: string,
  edu_info: {
    school_name: string,
    major_name: string,
    degree_name: string
  },
  is_verified: boolean,
  watch_info: {
    fans: number,
    watches: number,
    related: string
  },
  avatar_url: string,
  task_info: {
    read_count: number,
    punch_count: number,
    tech_count: number,
    certificate_count: number
  }
};

export type userTotalModel = {
  certificate_count: number,
  fans: number,
  major_name: string,
  degree_name: string,
  punch_count: number,
  read_count: number,
  school_name: string,
  tech_count: number,
  watches: number
};

export type educationModel = {
  id: number,
  school: {
    id: number,
    city: object,
    name: string,
    alias: object,
    introduction: object
  },
  major: {
    id: number,
    name: string
  },
  degree: {
    id: number,
    name: string
  },
  college: {
    id: number,
    name: string
  },
  start_date: string,
  end_date: string,
  posts: array,
  edu_status: string,
  course_status: string,
  is_default: boolean,
  is_full_time: boolean,
  is_verify: boolean,
  gpa: number
};

export type courseModel = {
  id: number,
  course_name: string,
  education_id: number,
  course_credit: number,
  course_credit_hour: number,
  course_category: number,
  number: number
};

export type schoolJobModel = {
  id: number,
  name: string,
  start_date: string,
  end_date: string,
  description: string,
  education_id: number
};

export type practiceExpModel = {
  id: number,
  title: string,
  company_name: string,
  job_title: string,
  job_desc: string,
  is_internship: boolean,
  start_date: string,
  end_date: string,
  created_time: string
};

export type awardExpModel = {
  id: number,
  title: string,
  acquire_date: string,
  images: imagesModel[],
  audit_status: string
};

export type certificateModel = {
  id: number,
  name: string,
  score: number,
  acquire_date: string,
  audit_status: string
};

export type LocalModel = {
  // accuracy: number,
  // altitude: number,
  // latitude: number,
  // longitude: number,
  // speed: number,
  // timestamp: number,
  // accuracy: 65,
  adCode: string, // "510107",
  address: string, //"四川省成都市武侯区天华二路靠近腾讯成都大厦B楼",
  altitude: string, // 478.2543029785156,
  city: string, //"成都市",
  cityCode: string, //"028",
  country: string, // "中国",
  direction: number, // -1,
  district: string, //"武侯区",
  latitude: number, //30.54595893012153,
  longitude: number, // 104.06176378038194,
  poiName: string, // "腾讯成都大厦B楼",
  province: string, // "四川省",
  speed: string, // -1,
  street: string, //"天华二路",
  streetNumber: string, //"83号",
  timestamp: number // 1532232053294.917
};

export type imagesModel = {
  id: string,
  desc: string,
  file_name: string,
  type: string,
  url: string
} | null;

export type NewsSimpleModel = {
  id: number,
  title: string,
  type: string,
  content: string,
  read_num: string,
  like_num: number,
  image: imagesModel,
  category: number,
  is_liked: boolean,
  tags: array,
  created_time: string,
  use_num: number,
  category_title: string
};

export type PageResultModel = {
  count: number,
  current_page: number,
  per_page: number,
  total_page: number,
  total_num: number,
  major_level2: string,
  results: object[]
};

export type JobPlanIndustry = {
  id: number,
  title: string,
  description: string,
  order: number,
  is_valid: boolean
};

export type JobPlanPosition = {
  id: number,
  title: string,
  description: string,
  order: number,
  is_valid: boolean,
  industry: number
};

// 其他用户状态信息
export type OtherUserState = {
  id: number,
  rank: number,
  fullName: string,
  score: number,
  college: string,
  major: string,
  avatarUrl: string,
  is_verified: boolean,
  sex: number,
  follow: boolean,
  beFollowed: boolean
};

export type WeChatTokenModel = {
  access_token: string,
  expires_in: number,
  refresh_token: string,
  openid: string,
  scope: string,
  unionid: string
};

export type WeChatUserInfoModel = {
  openid: string,
  nickname: string,
  sex: number, // 1为男性，2为女性
  province: string,
  city: string,
  country: string, // 国家，如中国为CN
  headimgurl: string,
  privilege: string[],
  unionid: string
};

export type LoginEnum = "phoneCode" | "password" | "wechat" | "";
export type LoginType = LoginEnum;

export type NotifyModel = {
  id: number,
  content: string,
  type: MessageTitle,
  is_read: boolean,
  created_time: string,
  title: string,
  status: boolean
};

export type MessageTitle = {
  title: string
};

export type SchoolAccountModel = {
  id: number,
  code: string,
  name: string,
  education_id: number,
  created_time: string
};

export type Dimensions = {
  bottom: number,
  left: number,
  right: number,
  top: number
};

export type SessionState = {
  safeAreaInsets: Dimensions,
  statusBarBackgroundColor: string
};

//数据查询学校默认
export type SearchSchoolDataModel = {
  id: number,
  city: cityModel,
  name: string,
  alias: null,
  introduction: null
};
export type SearchSchoolDataState = {
  count: number,
  current_page: number,
  per_page: number,
  total_page: number,
  results: SearchSchoolDataModel[]
};

//数据查询一级专业默认
export type SearchLevelOneMajorDataModel = {
  level1: string
};

//数据查询专业默认
export type SearchMajorDataModel = {
  id: number,
  major: string,
  level1: string,
  level2: string,
  level: string
};

//数据查询行业默认
export type SearchIndustryDataModel = {
  id: number,
  title: string,
  description: string,
  order: number,
  is_valid: boolean,
  created_time: string,
  parent: null
};

//数据查询职位默认
export type SearchPositionDataModel = {
  id: number,
  industry_title: string,
  title: string,
  description: string,
  order: number,
  is_valid: boolean,
  created_time: string,
  industry: number
};

export type NewsOfWatches = {
  key: string,
  id: number | string,
  userId: number,
  fullName: string,
  avatarUrl: string,
  date: string,
  sex: number,
  contentText: string,
  images: array,
  location: string
};

export type UserAccoutnModel = {
  id: number,
  name: string,
  type: string, // education | chsi
  education_id: number,
  created_time: string,
  account: string
};

// export type ImageMod

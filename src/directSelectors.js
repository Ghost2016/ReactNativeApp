// /* @flow */
// import type {
//     GlobalState,
//     SessionState,
//     DraftState,
//     FetchingState,
//     FlagsState,
//     LoadingState,
//     MessageState,
//     MuteState,
//     NavigationState,
//     TopicsState,
//     PresenceState,
//     RealmBot,
//     RealmEmojiState,
//     RealmState,
//     SettingsState,
//     StreamUnreadItem,
//     TypingState,
//     UnreadHuddlesState,
//     UnreadMentionsState,
//     UnreadPmsState,
//     Account,
//     Debug,
//     Subscription,
//     Stream,
//     Outbox,
//     User,
//     UserGroup,
//   } from './types';

// 学校主页归属地
export const getSchoolName = (state, props) =>
  props.schoolName ? props.schoolName : state.user.total.school_name;
export const getSchoolLevel = (state, props) => props.degreeName ? props.degreeName : (state.user.total.degree_name || "");
export const getMajor = (state, props) =>
  props.major ? props.major : state.user.total.major_name;

export const getJob = state => state.ascription.job;
export const getIndustry = state => state.ascription.industry;

// 数据解析页面
export const getSalaryCaseCount = (state, props) =>
  state.dataParse.salaryCaseCount || props.salaryCaseCount || 0;
export const getDomianCaseCount = (state, props) =>
  state.dataParse.domainCaseCount || props.domainCaseCount || 0;
export const getCompanyCaseCount = (state, props) =>
  state.dataParse.companyCaseCount || props.companyCaseCount || 0;
export const getFurtherStudyCaseCount = (state, props) =>
  state.dataParse.furtherStudyCaseCount || props.furtherStudyCaseCount || 0;
export const getCompanyTableData = state => state.companyTable;
export const getSalaryTableData = state => state.salaryTable;

// 设置
export const getSettings = state => state.settings;

// 用户
export const getUserToken = state => state.user.token;
export const getUserName = state => state.user.nickname;
export const getUserIsVerified = state => state.user.is_verified;
export const getUserGender = state => state.user.gender;
export const getUserCity = state => state.user.city;
export const getUserId = state => state.user.id;
export const getUserPhone = state => state.user.phone;
export const getUserIsBindWechat = state => state.user.bind_wechat;
export const getUserWechatInfo = state => state.user.wechat_info;
export const getUserRegisterTime = state => state.user.created_time;
export const getUserImSig = state => state.user.sig;
export const getUserTotal = state =>
  Object.assign(
    {
      certificate_count: 0,
      fans: 0,
      major_name: "",
      punch_count: 0,
      read_count: 0,
      school_name: "",
      tech_count: 0,
      watches: 0
    },
    state.user.total
  );
export const getUserAvatar = state => state.user.avatar;
export const getUserSalary = state => state.user.salary;
export const getUserPower = (state, props) =>
  (props && props.scoreNum) ? props.scoreNum : state.user.power;
export const getUserUpPower = state => state.user.up_power;
export const getUserUpSalary = state => state.user.up_salary;

// bi数据搜索历史
export const getSearchRecord = state => state.parseSearchRecord;

// export const getAccounts = state => state.accounts;
// export const getSession = state => state.session;

// export const getIsActive = state => state.session.isActive;
// export const getIsOnline = state => state.session.isOnline;
// export const getDebug = state => state.session.debug;
// export const getIsHydrated = state => state.session.isHydrated;

// export const getCanCreateStreams = state => state.realm.canCreateStreams;

// export const getDrafts = state => state.drafts;

// export const getLoading = state => state.loading;

// export const getMute = state => state.mute;

// export const getTyping = state => state.typing;

// export const getTopics = state => state.topics;

// export const getUserGroups = state => state.userGroups;

// export const getUsers = state => state.users;

// export const getFetching = state => state.fetching;

// export const getFlags = state => state.flags;

// export const getReadFlags = state => state.flags.read;

// export const getAllMessages = state => state.messages;

// export const getNav = state => state.nav;

// export const getSubscriptions = state => state.subscriptions;

// export const getStreams = state => state.streams;

// export const getPresence = state => state.presence;

// export const getOutbox = state => state.outbox;

// export const getUnreadStreams = state => state.unread.streams;

// export const getUnreadPms = state => state.unread.pms;

// export const getUnreadHuddles = state => state.unread.huddles;

// export const getUnreadMentions = state => state.unread.mentions;

// export const getRealm = state => state.realm;

// export const getCrossRealmBots = state => state.realm.crossRealmBots;

// export const getRealmEmoji = state => state.realm.emoji;

// export const getNonActiveUsers = state => state.realm.nonActiveUsers;

// export const getNavigationRoutes = state => state.nav.routes;

// export const getNavigationIndex = state => state.nav.index;

// export const getIsAdmin = state => state.realm.isAdmin;

export const getFans = state => state.fans;
export const getWatches = state => state.watches;

export const getWatchesAll = state => state.watches_all;


export const getTopUserArray = state => state.topUserArray;
export const getPeerUserArray = state => state.peerUserArray;
export const getRecommendUserArray = state => state.recommendUserArray;

export const getRankDynamic = state => state.dynamic;
export const getRankWatchUserArray = state => state.rankWatchUserArray;

export const getPowerTrendChartData = state => state.powerTrendChartData;
export const getSalaryIncreaseRecordChartData = state => state.salaryIncreaseRecordChartData;
export const getTaskTotalTrendChartData = state => state.taskTotalTrendChartData;

export const getSession = (state) => state.session;
// 第一次进入
export const getIsFirstEnterIndex = (state) => state.isFirstEnterIndex;
export const getIsFirstEnterRank = (state) => state.isFirstEnterRank;


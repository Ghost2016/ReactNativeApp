/* @flow */
import { combineReducers } from "redux";
import { enableBatching } from "redux-batched-actions";

import config from "../config";
import { logSlowReducers } from "../utils/redux";

// import accounts from '../account/accountReducers';
// import alertWords from '../alertWords/alertWordsReducer';
// import caughtUp from '../caughtup/caughtUpReducers';
// import drafts from '../drafts/draftsReducers';
// import fetching from '../chat/fetchingReducers';
// import flags from '../chat/flagsReducers';
// import loading from '../loading/loadingReducers';
// import messages from '../chat/chatReducers';
// import mute from '../mute/muteReducers';
// import nav from '../nav/navReducers';
// import outbox from '../outbox/outboxReducers';
// import presence from '../presence/presenceReducers';
// import realm from '../realm/realmReducers';
import session from '../sd_session/sessionReducers';
import settings from "../settings/settingsReducers";
// import streams from '../streams/streamsReducers';
// import subscriptions from '../subscriptions/subscriptionsReducers';
// import topics from '../topics/topicsReducers';
// import typing from '../typing/typingReducers';
// import unreadHuddles from '../unread/unreadHuddlesReducers';
// import unreadMentions from '../unread/unreadMentionsReducers';
// import unreadPms from '../unread/unreadPmsReducers';
// import unreadStreams from '../unread/unreadStreamsReducers';
// import userGroups from '../user-groups/userGroupsReducers';
import { user, location, uploadToken, loginType, notifyInfo, isFirstStart, schoolAccount, isFirstEnterIndex, isFirstEnterRank, homeLiveCourseList, homeNewsList } from "../users/usersReducers";
import ascription from "../sd_ascription/ascriptionReducer";
import {launchScreen, backHomeScreenIds} from "../screens/launchScreenReducer";
import dataParse from "../sd_employdataparse/employDataParseTextReducer";
import companyTable from "../sd_companytable/companyTableReducer";
import salaryTable from "../sd_salarytable/salayrTableReducer";
import calcSalaryResult from "../screens/pushScreen/calcSalary/calcSalaryReducer";
import parseSearchRecord from "../sd_querydatatabs/queryDataTabsReducer";
import prepareToupdate from "../users/prepareToupdateReducers";
import {
  trendsList,
  otherUserTrendsList
} from "../sd_trendsList/trendsListReducer";
import {
  certificateList,
  otherUserCertificateList
} from "../sd_certificateList/certificateReducer";
import {
  userEducationList,
  userCourseList,
  userSchoolJobList,
  userPracticeExpList,
  userAwardExpList
} from "../sd_trackRecord/trackRecordReducers";
import otherUserInfo from "../users/otherUserReducers";
import lightBox from "../screens/lightBoxScreen/lightBoxReducers";
import {
  punchMorningTypeList,
  punchMorningList,
  punchSkillList,
  punchCertList,
  userJobPlanList,
  skillList,
  skillCourseList,
  certList,
  jobPlanPositionList,
  skillState,
  certState,
  punchStateWeek,
} from "../screens/tabScreen/Grow/GrowScreenReducers";

import {
  searchCityData,
  searchSchoolData,
  searchLevelOneMajorDataB,
  searchLevelOneMajorDataC,
  searchLevelOneMajorDataM,
  searchLevelOneMajorDataD,
  searchMajorDataB,
  searchMajorDataC,
  searchMajorDataM,
  searchMajorDataD,
  searchIndustryData,
  searchPositionData,
  searchSubPositionData,
} from "../screens/tabScreen/Home/HomeReducers";

import fans from "../screens/pushScreen/fansScreen/fansReducer";
import { watches, recommendUserArray, watches_all } from "../screens/pushScreen/fansScreen/watchReducer";
import {
  topUserArray,
  peerUserArray,
  progressUserArray,
  dynamic,
  rankWatchUserArray
} from "../screens/tabScreen/Rank/rankScreenReducers";
import {
  taskTotalTrendChartData,
  powerTrendChartData,
  salaryIncreaseRecordChartData
} from "../screens/pushScreen/expDetail/expDetailScreenReducers";

// const reducers = {
//   accounts,
//   alertWords,
//   caughtUp,
//   drafts,
//   fetching,
//   flags,
//   loading,
//   messages,
//   mute,
//   nav,
//   outbox,
//   presence,
//   realm,
//   session,
//   settings,
//   streams,
//   subscriptions,
//   topics,
//   typing,
//   unread: combineReducers({
//     streams: unreadStreams,
//     pms: unreadPms,
//     huddles: unreadHuddles,
//     mentions: unreadMentions,
//   }),
//   userGroups,
//   ...user,
// };

const reducers = {
  settings,
  launchScreen,
  backHomeScreenIds,
  user,
  location,
  uploadToken,
  ascription,
  dataParse,
  companyTable,
  salaryTable,
  calcSalaryResult,
  parseSearchRecord,
  prepareToupdate,
  trendsList,
  otherUserTrendsList,
  certificateList,
  otherUserCertificateList,
  otherUserInfo,
  userEducationList,
  userCourseList,
  userSchoolJobList,
  userPracticeExpList,
  userAwardExpList,
  lightBox,
  punchMorningTypeList,
  punchMorningList,
  punchSkillList,
  punchCertList,
  punchStateWeek,
  userJobPlanList,
  skillList,
  skillCourseList,
  certList,
  skillState,
  certState,
  jobPlanPositionList,
  fans,
  watches,
  loginType,
  topUserArray,
  peerUserArray,
  progressUserArray,
  notifyInfo,
  isFirstStart,
  isFirstEnterIndex,
  isFirstEnterRank,
  recommendUserArray,
  schoolAccount,
  dynamic,
  watches_all,
  rankWatchUserArray,
  taskTotalTrendChartData,
  powerTrendChartData,
  salaryIncreaseRecordChartData,
  session,
  // wechatToken,
  searchCityData,
  searchSchoolData,
  searchLevelOneMajorDataB,
  searchLevelOneMajorDataC,
  searchLevelOneMajorDataM,
  searchLevelOneMajorDataD,
  searchMajorDataB,
  searchMajorDataC,
  searchMajorDataM,
  searchMajorDataD,
  searchIndustryData,
  searchPositionData,
  searchSubPositionData,
  homeLiveCourseList,
  homeNewsList,
};

export default enableBatching(
  combineReducers(
    config.enableReduxSlowReducerWarnings ? logSlowReducers(reducers) : reducers
  )
);
// export default reducers;

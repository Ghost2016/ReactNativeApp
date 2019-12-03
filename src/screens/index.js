import React from "react";
import {BackHandler, NativeModules, AppState} from 'react-native';
import {Toast} from 'antd-mobile';
import { Navigation, ScreenVisibilityListener } from "react-native-navigation";
import connectWithActions from "../connectWithActions";
import StoreProvider from "../boot/StoreProvider";
import TranslationProvider from "../boot/TranslationProvider";
import StylesProvider from "../boot/StylesProvider";
import CompatibilityChecker from "../boot/CompatibilityChecker";
import AppEventHandlers from "../boot/AppEventHandlers";
import AppDataFetcher from "../boot/AppDataFetcher";
import NavProvider from "../nav/NavProvider";
import config from "../config";

// single page
import LoginScreen from "./Login/LoginScreen";
import LoginRealScreen from "./Login/LoginRealScreen";
import StartScreen from "./Login/StartScreen";
import RegisterScreen from "./registerScreen/RegisterScreen";
import TosScreen from "./registerScreen/TosScreen";
import AboutVersionScreen from "./registerScreen/AboutVersionScreen";
import OtherInfoRegisterScreen from "./registerScreen/OtherInfoRegisterScreen";
// 登陆界面
import LoginMainScreen from "./LoginMainScreen";
// 忘记密码页面
import ForgetPasswordScreen from "./ForgetPasswordScreen";
// 排名相关的页面

// 图片查看Modal
import ImageViewerScreen from "./modalScreen/imageViewerScreen/ImageViewerScreen";

// 个人主页页面----对接图表
import PersonalPageScreen from "./personalPageScreen/PersonalPageScreen";
// 排名搜索页面
import RankSearchScreen from "./modalScreen/rankSearchScreen/RankSearchScreen";
// 关注动态
import RankNewsWithinFollower from "./pushScreen/rankNewsWithinFollower/RankNewsWithinFollower";
// PK一下
import PlayerKillScreen from "./pushScreen/playerKillScreen/PlayerKillScreen";
// 粉丝列表 or 关注列表
import FansScreeen from "./pushScreen/fansScreen/FansScreeen";
// 排名首页popup
import RankPopupScreen from "./lightBoxScreen/RankPopupScreen";

// tab page
import HomeScreen from "./tabScreen/Home/HomeScreen";
import RankScreen from "./tabScreen/Rank/RankScreen";
import GrowScreen from "./tabScreen/Grow/GrowScreen";
import PersonScreen from "./tabScreen/Person/PersonScreen";

// pushScreen
// import {
//   SalaryParseScreen,
//   DomainParseScreen,
//   CompanyParseScreen,
//   FurtherStudyParseScreen
// } from "./pushScreen/DataParseScreen";
import DataQueryScreen from "./pushScreen/DataQueryScreen";
// import {SchoolDetailInfoScreen} from './pushScreen/searchData/SearchDetailInfo';

import {
  SearchSchoolDataScreen,
  SearchMajorDataScreen,
  SearchJobDataScreen,
  SearchIndustryDataScreen
} from "./pushScreen/searchData/SearchDataScreen";
import DirectInfoTabsScreen from "./pushScreen/directInfoTab/DirectInfoTabScreen";
import DirectInfoDetailScreen from "./pushScreen/directInfoDetail/DirectInfoDetailScreen";
import UpdateProfileScreen from "./pushScreen/updateProfile/UpdateProfileScreen";
import UpdateNameLightBoxScreen from "./pushScreen/updateProfile/UpdateNameLightBoxScreen";
import UpdateAddressLightBoxScreen from "./pushScreen/updateProfile/UpdateAddressLightBoxScreen";
import UpdateIdentifyLightBoxScreen from "./pushScreen/updateProfile/UpdateIdentifyLightBoxScreen";
import UserProfileScreen from "./pushScreen/userProfile/UserProfileScreen";
import ShowCurrCourseScreen from "./pushScreen/showCurrCourse/ShowCurrCourseScreen";
import EditCourseScreen from "./pushScreen/editCourse/EditCourseScreen";
import AddCourseScreen from "./pushScreen/addCourse/AddCourseScreen";
import ShowPracticeExperieneceScreen from "./pushScreen/showPracticeExperience/ShowPracticeExperieneceScreen";
import EditPracticeScreen from "./pushScreen/editPractice/EditPracticeScreen";
import AddPracticeScreen from "./pushScreen/addPractice/AddPracticeScreen";

//成长 - 我的目标
import GrowGoalScreen from "./pushScreen/growGoal/GrowGoalScreen";
//职么力
import GrowPowerScreen from "./pushScreen/growPower/GrowPowerScreen";
//成长 - 制定目标行业
import GrowMakeGoalScreen from "./pushScreen/growMakeGoal/GrowMakeGoalScreen";
//成长 - 制定目标职位
import GrowMakeGoal2Screen from "./pushScreen/growMakeGoal2/GrowMakeGoal2Screen";

//成长 - 制定目标tabs
import GrowLightenRoadScreen from "./pushScreen/growLightenRoad/GrowLightenRoadScreen";

//成长 - 证书考取
import GrowCheckinCertScreen from "./pushScreen/growCheckinCert/GrowCheckinCertScreen";
//成长 - 职场技能
import GrowCheckinSkillScreen from "./pushScreen/growCheckinSkill/GrowCheckinSkillScreen";

//成长 - 完成阅读打卡
import GrowFinishReadScreen from "./pushScreen/growFinishRead/GrowFinishReadScreen";

//成长 - 添加书单
import GrowAddReadScreen from "./pushScreen/growAddRead/GrowAddReadScreen";

//成长 - 每日打卡详情
import GrowCheckinCalendarScreen from "./pushScreen/growCheckinCalendar/GrowCheckinCalendarScreen";

//modal screen
//成长 - 每日打卡
import GrowCheckinScreen from "./modalScreen/growCheckin/GrowCheckinScreen";

//成长 - 阅读打卡完成
import GrowReadOkScreen from "./modalScreen/growReadOk/GrowReadOkScreen";

//消息通知
import Notification from "@sd_components/Notification";

//制定目标弹窗
import GrowBoxMsg from "@sd_components/BoxMsg";

//成长相关页面
function registerGrowScreens(store, Provider) {
  //职么力
  Navigation.registerComponent(
    `${config.projName}.GrowPowerScreen`,
    () => ProviderCreator(GrowPowerScreen),
    store,
    Provider
  );

  //我的目标
  Navigation.registerComponent(
    `${config.projName}.GrowGoalScreen`,
    () => ProviderCreator(GrowGoalScreen),
    store,
    Provider
  );

  //证书考取
  Navigation.registerComponent(
    `${config.projName}.GrowCheckinCertScreen`,
    () => ProviderCreator(GrowCheckinCertScreen),
    store,
    Provider
  );

  //职场技能
  Navigation.registerComponent(
    `${config.projName}.GrowCheckinSkillScreen`,
    () => ProviderCreator(GrowCheckinSkillScreen),
    store,
    Provider
  );

  //完成阅读打卡
  Navigation.registerComponent(
    `${config.projName}.GrowFinishReadScreen`,
    () => ProviderCreator(GrowFinishReadScreen),
    store,
    Provider
  );

  //添加书单
  Navigation.registerComponent(
    `${config.projName}.GrowAddReadScreen`,
    () => ProviderCreator(GrowAddReadScreen),
    store,
    Provider
  );

  //制定目标行业
  Navigation.registerComponent(
    `${config.projName}.GrowMakeGoalScreen`,
    () => ProviderCreator(GrowMakeGoalScreen),
    store,
    Provider
  );

  //制定目标职位
  Navigation.registerComponent(
    `${config.projName}.GrowMakeGoal2Screen`,
    () => ProviderCreator(GrowMakeGoal2Screen),
    store,
    Provider
  );

  //点亮路径
  Navigation.registerComponent(
    `${config.projName}.GrowLightenRoadScreen`,
    () => ProviderCreator(GrowLightenRoadScreen),
    store,
    Provider
  );

  //每日打卡
  Navigation.registerComponent(
    `${config.projName}.GrowCheckinScreen`,
    () => ProviderCreator(GrowCheckinScreen),
    store,
    Provider
  );

  //阅读打卡完成
  Navigation.registerComponent(
    `${config.projName}.GrowReadOkScreen`,
    () => ProviderCreator(GrowReadOkScreen),
    store,
    Provider
  );

  //定制目标 - 消息弹窗
  Navigation.registerComponent(
    `${config.projName}.GrowBoxMsg`,
    () => ProviderCreator(GrowBoxMsg),
    store,
    Provider
  );

  //打卡日历
  Navigation.registerComponent(
    `${config.projName}.GrowCheckinCalendarScreen`,
    () => ProviderCreator(GrowCheckinCalendarScreen),
    store,
    Provider
  );
}
function registerModalScreens(store, Provider) {
  Navigation.registerComponent(
    `${config.projName}.ImageViewerScreen`,
    () => ProviderCreator(ImageViewerScreen),
    store,
    Provider
  );
}

/**
 *  排名相关页面
 */
function registerRankScreens(store, Provider) {
  Navigation.registerComponent(
    `${config.projName}.RankScreen`,
    () => ProviderCreator(RankScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.RankSearchScreen`,
    () => ProviderCreator(RankSearchScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.RankNewsWithinFollower`,
    () => ProviderCreator(RankNewsWithinFollower),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.PlayerKillScreen`,
    () => ProviderCreator(PlayerKillScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.FansScreeen`,
    () => ProviderCreator(FansScreeen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.RankPopupScreen`,
    () => ProviderCreator(RankPopupScreen),
    store,
    Provider
  );
}
//我的 - 添加证书
import AddCertificateScreen from "./pushScreen/addCertificate/AddCertificateScreen";
//我的 - 编辑证书
import EditCertificateScreen from "./pushScreen/editCertificate/EditCertificateScreen";
//我的 - 获奖证书
import ShowCertificateScreen from "../sd_showCertificate/ShowCertificateScreen";
//我的 - 自我评价
import SelfEvaluationScreen from "./pushScreen/selfEvaluation/SelfEvaluationScreen";
//我的 - 我的收藏
import MyCollectionScreen from "./pushScreen/myCollection/MyCollectionScreen";
//我的 - 意见反馈
import FeedBackScreen from "./pushScreen/feedback/FeedBackScreen";
//我的 - 设置
import UserSettingScreen from "./pushScreen/userSetting/UserSettingScreen";
//我的 - 账号管理
import AccountManageScreen from "./pushScreen/accountManage/AccountManageScreen";
//我的 - 设置密码
import SetPasswordScreen from "./pushScreen/setPassword/SetPasswordScreen";
//我的 - 修改手机号
import ChangePhoneScreen from "./pushScreen/changePhone/ChangePhoneScreen";
//我的 - 隐私设置
// import SecretSettingScreen from "./pushScreen/secretSetting/SecretSettingScreen";
//我的 - App关于
import AppAboutScreen from "./pushScreen/appAbout/AppAboutScreen";
//我的 - 消息通知
import MessageNotifyScreen from "./pushScreen/messageNotify/MessageNotifyScreen";
//我的 - 身份管理
import IdentifyManageScreen from "./pushScreen/identifyManage/IdentifyManageScreen";
//我的 - 添加身份
import AddIdentifyScreen from "./pushScreen/identifyManage/AddIdentifyScreen";
//我的 -实名认证
import IdConfirmScreen from "./pushScreen/identifyManage/IdConfirmScreen";
//我的 - 添加手机号
import AddTelPhoneScreen from "./pushScreen/addTelPhone/AddTelPhoneScreen";
//我的 - 添加手机号成功
import AddTelPhoneCompleteScreen from "./pushScreen/addTelPhone/AddTelPhoneCompleteScreen";
//我的 - 手机号码
import PhoneManageScreen from "./pushScreen/accountManage/PhoneManageScreen";
//我的 - 我的主页
import MyHomeScreen from "./pushScreen/myHome/MyHomeScreen";
//我的 - 我的履历
import TrackRecordScreen from "./pushScreen/trackRecord/TrackRecordScreen";
//我的 - 编辑基本信息
import EditUserbaseInfoScreen from "./pushScreen/editUserBaseInfo/EditUserBaseInfoScreen";

//lightbox
//退出系统
import ExitAppLightBoxScreen from "./lightBoxScreen/ExitAppLightBoxScreen";
import EditUserNameScreen from "./pushScreen/editUserBaseInfo/EditUserNameScreen";
import EditUserSexScreen from "./pushScreen/editUserBaseInfo/EditUserSexScreen";
import EditUserAddressScreen from "./pushScreen/editUserBaseInfo/EditUserAddressScreen";
import EditUserProvinceScreen from "./pushScreen/editUserBaseInfo/EditUserProvinceScreen";
import EditUserCityScreen from "./pushScreen/editUserBaseInfo/EditUserCityScreen";
import EditUserPhoneScreen from "./pushScreen/editUserBaseInfo/EditUserPhoneScreen";
import EditUserEmailScreen from "./pushScreen/editUserBaseInfo/EditUserEmailScreen";
import ShowUserEducationScreen from "./pushScreen/editUserBaseInfo/ShowUserEducationScreen";
import EditIdentifyScreen from "./pushScreen/identifyManage/EditIdentifyScreen";
import AddLearnedCourseScreen from "./pushScreen/editUserBaseInfo/AddLearnedCourseScreen";
import EditLearnedCourseScreen from "./pushScreen/editUserBaseInfo/EditLearnedCourseScreen";
import EditLearnedCourseItemScreen from "./pushScreen/editUserBaseInfo/EditLearnedCourseItemScreen";
import AddInSchoolJobsScreen from "./pushScreen/editUserBaseInfo/AddInSchoolJobsScreen";
import ShowInSchoolJobsScreen from "./pushScreen/editUserBaseInfo/ShowInSchoolJobsScreen";
import EditInSchoolJobsScreen from "./pushScreen/editUserBaseInfo/EditInSchoolJobsScreen";
import AddAwardExpScreen from "./pushScreen/editUserBaseInfo/AddAwardExpScreen";
import ShowAwardExpScreen from "./pushScreen/editUserBaseInfo/ShowAwardExpScreen";
import EditAwardExpScreen from "./pushScreen/editUserBaseInfo/EditAwardExpScreen";
import ShowPracticeExpScreen from "./pushScreen/editUserBaseInfo/ShowPracticeExpScreen";
import PostTrendsScreen from "./pushScreen/postTrends/PostTrends";
import ExpDetailScreen from "./pushScreen/expDetail/ExpDetailScreen";
import SalaryScreen from "./pushScreen/dataParse/SalaryScreen";
import CompanyScreen from "./pushScreen/dataParse/CompanyScreen";
import DomainScreen from "./pushScreen/dataParse/DomainScreen";
import FurtherStudyScreen from "./pushScreen/dataParse/FurtherStudyScreen";
// import CalcSalaryHomeScreen from "./pushScreen/calcSalary/CalcSalaryHomeScreen";
import CalcSalaryScreen from "./pushScreen/calcSalary/CalcSalaryScreen";
import CalcSalaryResultScreen from "./pushScreen/calcSalary/CalcSalaryResultScreen";
import AddEducationScreen from "./pushScreen/identifyManage/AddEducationScreen";
import EditEducationScreen from "./pushScreen/identifyManage/EditEducationScreen";
import SocketProvider from "../boot/SocketProvider";
import { ConfirmLightBoxScreen } from "./lightBoxScreen/ConfirmLightBoxScreen";
import PushScreen from "./pushScreen/PushScreen";
import LightBoxScreen from "./lightBoxScreen/LightBoxScreen";
import store from "../boot/store";
import AnimateLoginScreen from "./Login/AnimateLoginScreen";
import ChatScreen from "./pushScreen/ChatScreen";

export function registerLoginScreens(store, Provider) {
  Navigation.registerComponent(
    `${config.projName}.RegisterScreen`,
    () => ProviderCreator(RegisterScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.TosScreen`,
    () => ProviderCreator(TosScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.AboutVersionScreen`,
    () => ProviderCreator(AboutVersionScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.OtherInfoRegisterScreen`,
    () => ProviderCreator(OtherInfoRegisterScreen),
    store,
    Provider
  );

  // Navigation.registerComponent(
  //   `${config.projName}.SalaryParseScreen`,
  //   () => ProviderCreator(SalaryParseScreen),
  //   store,
  //   Provider
  // );
  // Navigation.registerComponent(
  //   `${config.projName}.DomainParseScreen`,
  //   () => ProviderCreator(DomainParseScreen),
  //   store,
  //   Provider
  // );
  // Navigation.registerComponent(
  //   `${config.projName}.CompanyParseScreen`,
  //   () => ProviderCreator(CompanyParseScreen),
  //   store,
  //   Provider
  // );
  // Navigation.registerComponent(
  //   `${config.projName}.FurtherStudyParseScreen`,
  //   () => ProviderCreator(FurtherStudyParseScreen),
  //   store,
  //   Provider
  // );

  Navigation.registerComponent(
    `${config.projName}.DataQueryScreen`,
    () => ProviderCreator(DataQueryScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.LoginMainScreen`,
    () => ProviderCreator(LoginMainScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.ForgetPasswordScreen`,
    () => ProviderCreator(ForgetPasswordScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.LoginRealScreen`,
    () => ProviderCreator(LoginRealScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.StartScreen`,
    () => ProviderCreator(StartScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.AnimateLoginScreen`,
    () => ProviderCreator(AnimateLoginScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.LoginScreen`,
    () => ProviderCreator(LoginScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.HomeScreen`,
    () => ProviderCreator(HomeScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.GrowScreen`,
    () => ProviderCreator(GrowScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.PersonScreen`,
    () => ProviderCreator(PersonScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.SearchSchoolDataScreen`,
    () => ProviderCreator(SearchSchoolDataScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.SearchMajorDataScreen`,
    () => ProviderCreator(SearchMajorDataScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.SearchJobDataScreen`,
    () => ProviderCreator(SearchJobDataScreen),
    store,
    Provider
  );
  Navigation.registerComponent(
    `${config.projName}.SearchIndustryDataScreen`,
    () => ProviderCreator(SearchIndustryDataScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.DirectInfoTabsScreen`,
    () => ProviderCreator(DirectInfoTabsScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.DirectInfoDetailScreen`,
    () => ProviderCreator(DirectInfoDetailScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.UpdateProfileScreen`,
    () => ProviderCreator(UpdateProfileScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.UpdateNameLightBoxScreen`,
    () => ProviderCreator(UpdateNameLightBoxScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.UpdateAddressLightBoxScreen`,
    () => ProviderCreator(UpdateAddressLightBoxScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.UpdateIdentifyLightBoxScreen`,
    () => ProviderCreator(UpdateIdentifyLightBoxScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.UserProfileScreen`,
    () => ProviderCreator(UserProfileScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.ShowCurrCourseScreen`,
    () => ProviderCreator(ShowCurrCourseScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.EditCourseScreen`,
    () => ProviderCreator(EditCourseScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.AddCourseScreen`,
    () => ProviderCreator(AddCourseScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.ShowPracticeExperieneceScreen`,
    () => ProviderCreator(ShowPracticeExperieneceScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.EditPracticeScreen`,
    () => ProviderCreator(EditPracticeScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.AddPracticeScreen`,
    () => ProviderCreator(AddPracticeScreen),
    store,
    Provider
  );

  //
  Navigation.registerComponent(
    `${config.projName}.PersonalPageScreen`,
    () => ProviderCreator(PersonalPageScreen),
    store,
    Provider
  );

  // 我的 - 添加证书
  Navigation.registerComponent(
    `${config.projName}.AddCertificateScreen`,
    () => ProviderCreator(AddCertificateScreen),
    store,
    Provider
  );

  // 我的 - 自我评价
  Navigation.registerComponent(
    `${config.projName}.SelfEvaluationScreen`,
    () => ProviderCreator(SelfEvaluationScreen),
    store,
    Provider
  );

  // 我的 - 我的收藏
  Navigation.registerComponent(
    `${config.projName}.MyCollectionScreen`,
    () => ProviderCreator(MyCollectionScreen),
    store,
    Provider
  );

  // 我的 - 意见反馈
  Navigation.registerComponent(
    `${config.projName}.FeedBackScreen`,
    () => ProviderCreator(FeedBackScreen),
    store,
    Provider
  );

  // 我的 - 设置
  Navigation.registerComponent(
    `${config.projName}.UserSettingScreen`,
    () => ProviderCreator(UserSettingScreen),
    store,
    Provider
  );

  // 我的 - 账号管理
  Navigation.registerComponent(
    `${config.projName}.AccountManageScreen`,
    () => ProviderCreator(AccountManageScreen),
    store,
    Provider
  );

  // 我的 - 设置密码
  Navigation.registerComponent(
    `${config.projName}.SetPasswordScreen`,
    () => ProviderCreator(SetPasswordScreen),
    store,
    Provider
  );

  // 我的 - 修改手机号
  Navigation.registerComponent(
    `${config.projName}.ChangePhoneScreen`,
    () => ProviderCreator(ChangePhoneScreen),
    store,
    Provider
  );

  // // 我的 - 隐私设置
  // Navigation.registerComponent(
  //   `${config.projName}.SecretSettingScreen`,
  //   () => ProviderCreator(SecretSettingScreen),
  //   store,
  //   Provider
  // );

  // 我的 - App关于
  Navigation.registerComponent(
    `${config.projName}.AppAboutScreen`,
    () => ProviderCreator(AppAboutScreen),
    store,
    Provider
  );

  // 我的 - 消息通知
  Navigation.registerComponent(
    `${config.projName}.MessageNotifyScreen`,
    () => ProviderCreator(MessageNotifyScreen),
    store,
    Provider
  );

  // 我的 - 身份管理
  Navigation.registerComponent(
    `${config.projName}.IdentifyManageScreen`,
    () => ProviderCreator(IdentifyManageScreen),
    store,
    Provider
  );

  // 我的 - 添加身份
  Navigation.registerComponent(
    `${config.projName}.AddIdentifyScreen`,
    () => ProviderCreator(AddIdentifyScreen),
    store,
    Provider
  );

  // 我的 - 实名认证
  Navigation.registerComponent(
    `${config.projName}.IdConfirmScreen`,
    () => ProviderCreator(IdConfirmScreen),
    store,
    Provider
  );

  // 我的 - 添加手机号
  Navigation.registerComponent(
    `${config.projName}.AddTelPhoneScreen`,
    () => ProviderCreator(AddTelPhoneScreen),
    store,
    Provider
  );

  // 我的 - 添加手机号成功
  Navigation.registerComponent(
    `${config.projName}.AddTelPhoneCompleteScreen`,
    () => ProviderCreator(AddTelPhoneCompleteScreen),
    store,
    Provider
  );

  // 我的 - 手机号码
  Navigation.registerComponent(
    `${config.projName}.PhoneManageScreen`,
    () => ProviderCreator(PhoneManageScreen),
    store,
    Provider
  );

  // 我的 - 我的主页
  Navigation.registerComponent(
    `${config.projName}.MyHomeScreen`,
    () => ProviderCreator(MyHomeScreen),
    store,
    Provider
  );

  // 我的 - 我的履历
  Navigation.registerComponent(
    `${config.projName}.TrackRecordScreen`,
    () => ProviderCreator(TrackRecordScreen),
    store,
    Provider
  );

  // 我的 - 编辑用户基本信息
  Navigation.registerComponent(
    `${config.projName}.EditUserbaseInfoScreen`,
    () => ProviderCreator(EditUserbaseInfoScreen),
    store,
    Provider
  );

  // 我的 - 编辑用户名称
  Navigation.registerComponent(
    `${config.projName}.EditUserNameScreen`,
    () => ProviderCreator(EditUserNameScreen),
    store,
    Provider
  );

  // 我的 - 编辑用户性别
  Navigation.registerComponent(
    `${config.projName}.EditUserSexScreen`,
    () => ProviderCreator(EditUserSexScreen),
    store,
    Provider
  );

  // 我的 - 编辑用户地址
  Navigation.registerComponent(
    `${config.projName}.EditUserAddressScreen`,
    () => ProviderCreator(EditUserAddressScreen),
    store,
    Provider
  );

  // 我的 - 编辑用户省份
  Navigation.registerComponent(
    `${config.projName}.EditUserProvinceScreen`,
    () => ProviderCreator(EditUserProvinceScreen),
    store,
    Provider
  );

  // 我的 - 编辑用户城市
  Navigation.registerComponent(
    `${config.projName}.EditUserCityScreen`,
    () => ProviderCreator(EditUserCityScreen),
    store,
    Provider
  );

  // 我的 - 编辑手机号码
  Navigation.registerComponent(
    `${config.projName}.EditUserPhoneScreen`,
    () => ProviderCreator(EditUserPhoneScreen),
    store,
    Provider
  );

  // 我的 - 编辑电子邮箱
  Navigation.registerComponent(
    `${config.projName}.EditUserEmailScreen`,
    () => ProviderCreator(EditUserEmailScreen),
    store,
    Provider
  );

  // 我的 - 显示教育经历页面
  Navigation.registerComponent(
    `${config.projName}.ShowUserEducationScreen`,
    () => ProviderCreator(ShowUserEducationScreen),
    store,
    Provider
  );

  // 我的 - 编辑教育（身份）经历
  Navigation.registerComponent(
    `${config.projName}.EditIdentifyScreen`,
    () => ProviderCreator(EditIdentifyScreen),
    store,
    Provider
  );

  // 我的 - 添加所学课程
  Navigation.registerComponent(
    `${config.projName}.AddLearnedCourseScreen`,
    () => ProviderCreator(AddLearnedCourseScreen),
    store,
    Provider
  );

  // 我的 - 编辑所学课程
  Navigation.registerComponent(
    `${config.projName}.EditLearnedCourseScreen`,
    () => ProviderCreator(EditLearnedCourseScreen),
    store,
    Provider
  );

  // 我的 - 编辑所学课程Item
  Navigation.registerComponent(
    `${config.projName}.EditLearnedCourseItemScreen`,
    () => ProviderCreator(EditLearnedCourseItemScreen),
    store,
    Provider
  );

  // 我的 - 添加在校职务
  Navigation.registerComponent(
    `${config.projName}.AddInSchoolJobsScreen`,
    () => ProviderCreator(AddInSchoolJobsScreen),
    store,
    Provider
  );

  // 我的 - 显示在校职务
  Navigation.registerComponent(
    `${config.projName}.ShowInSchoolJobsScreen`,
    () => ProviderCreator(ShowInSchoolJobsScreen),
    store,
    Provider
  );

  // 我的 - 编辑在校职务
  Navigation.registerComponent(
    `${config.projName}.EditInSchoolJobsScreen`,
    () => ProviderCreator(EditInSchoolJobsScreen),
    store,
    Provider
  );

  // 我的 - 添加获奖经历
  Navigation.registerComponent(
    `${config.projName}.AddAwardExpScreen`,
    () => ProviderCreator(AddAwardExpScreen),
    store,
    Provider
  );

  // 我的 - 显示获奖经历
  Navigation.registerComponent(
    `${config.projName}.ShowAwardExpScreen`,
    () => ProviderCreator(ShowAwardExpScreen),
    store,
    Provider
  );

  // 我的 - 编辑获奖经历
  Navigation.registerComponent(
    `${config.projName}.EditAwardExpScreen`,
    () => ProviderCreator(EditAwardExpScreen),
    store,
    Provider
  );

  // 我的 - 显示实习经历
  Navigation.registerComponent(
    `${config.projName}.ShowPracticeExpScreen`,
    () => ProviderCreator(ShowPracticeExpScreen),
    store,
    Provider
  );

  // 我的 - 发布动态
  Navigation.registerComponent(
    `${config.projName}.PostTrendsScreen`,
    () => ProviderCreator(PostTrendsScreen),
    store,
    Provider
  );

  //lightbox
  Navigation.registerComponent(
    `${config.projName}.ExitAppLightBoxScreen`,
    () => ProviderCreator(ExitAppLightBoxScreen),
    store,
    Provider
  );

  //成长 - 我的目标
  Navigation.registerComponent(
    `${config.projName}.GrowGoalScreen`,
    () => ProviderCreator(GrowGoalScreen),
    store,
    Provider
  );

  //首页 - 职么力
  Navigation.registerComponent(
    `${config.projName}.ExpDetailScreen`,
    () => ProviderCreator(ExpDetailScreen),
    store,
    Provider
  );

  //首页 - 薪资增长趋势
  Navigation.registerComponent(
    `${config.projName}.SalaryScreen`,
    () => ProviderCreator(SalaryScreen),
    store,
    Provider
  );

  // 首页 - 就业公司分布
  Navigation.registerComponent(
    `${config.projName}.CompanyScreen`,
    () => ProviderCreator(CompanyScreen),
    store,
    Provider
  );

  // 首页 - 就业领域分布
  Navigation.registerComponent(
    `${config.projName}.DomainScreen`,
    () => ProviderCreator(DomainScreen),
    store,
    Provider
  );

  // 首页 - 深造学习分布
  Navigation.registerComponent(
    `${config.projName}.FurtherStudyScreen`,
    () => ProviderCreator(FurtherStudyScreen),
    store,
    Provider
  );

  // 首页 - 计算薪资首页
  // Navigation.registerComponent(
  //   `${config.projName}.CalcSalaryHomeScreen`,
  //   () => ProviderCreator(CalcSalaryHomeScreen),
  //   store,
  //   Provider
  // );

  Navigation.registerComponent(
    `${config.projName}.CalcSalaryScreen`,
    () => ProviderCreator(CalcSalaryScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.CalcSalaryResultScreen`,
    () => ProviderCreator(CalcSalaryResultScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.EditCertificateScreen`,
    () => ProviderCreator(EditCertificateScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.ShowCertificateScreen`,
    () => ProviderCreator(ShowCertificateScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.AddEducationScreen`,
    () => ProviderCreator(AddEducationScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.EditEducationScreen`,
    () => ProviderCreator(EditEducationScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.ConfirmLightBoxScreen`,
    () => ProviderCreator(ConfirmLightBoxScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.PushScreen`,
    () => ProviderCreator(PushScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.ChatScreen`,
    () => ProviderCreator(ChatScreen),
    store,
    Provider
  );

  Navigation.registerComponent(
    `${config.projName}.LightBoxScreen`,
    () => ProviderCreator(LightBoxScreen),
    store,
    Provider
  );

  //成长相关页面
  registerGrowScreens(store, Provider);
  registerRankScreens(store, Provider);
  registerModalScreens(store, Provider);

  Navigation.registerComponent(
    "example.Types.Notification",
    () => Notification
  );
}

let lastTime = Date.now();
function goHome (){
  // //   // 退回后台
  // NativeModules.BackHome &&
  // NativeModules.BackHome.home &&
  // NativeModules.BackHome.home();


  // 退出程序
  // 请提示
  let currTime = Date.now();
  if ((currTime - lastTime) >= 1000) {
    lastTime = currTime;
    Toast.info("再次点击退出程序", 1);
    return true;
  }
}

export const ScreenType = {
  name: ""
}
export function registerScreenVisibilityListener() {
  new ScreenVisibilityListener({
    willAppear: ({ screen }) => {
       // android注册主页返回键
      if (
        [
          "example.HomeScreen",
          "example.PersonScreen",
          "example.RankScreen",
          "example.GrowScreen"
        ].findIndex(c => c == screen) >= 0
      ) {
        BackHandler.addEventListener("hardwareBackPress", goHome);
      } else {
        BackHandler.removeEventListener("hardwareBackPress", goHome)
      }

      console.log(`Displaying screen ${screen}`);
      // store.dispatch({
      //   type: "UPDATECURRSCREEN",
      //   id: screen
      // });
    },
    didAppear: ({ screen, startTime, endTime, commandType }) => {
      ScreenType.name = screen;
      console.log(
        "screenVisibility",
        `Screen ${screen} displayed in ${endTime -
          startTime} millis [${commandType}]`
      );
    },
    willDisappear: ({ screen }) =>
      console.log(`Screen will disappear ${screen}`),
    didDisappear: ({ screen }) => console.log(`Screen disappeared ${screen}`)
  }).register();
}
let Refs = {};

export const ProviderCreator = Component => {
  return class extends React.Component {
    render() {
      return (
        <CompatibilityChecker navigator={this.props.navigator}>
          <StoreProvider>
            <AppEventHandlers>
              <AppDataFetcher>
                <TranslationProvider>
                  <StylesProvider>
                    {/*<SocketProvider>*/}
                    <NavProvider refs={Refs} navigator={this.props.navigator}>
                      <Component {...this.props.passSpecialProps} />
                    </NavProvider>
                    {/*</SocketProvider>*/}
                  </StylesProvider>
                </TranslationProvider>
              </AppDataFetcher>
            </AppEventHandlers>
          </StoreProvider>
        </CompatibilityChecker>
      );
    }
  };
};

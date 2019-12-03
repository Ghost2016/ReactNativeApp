// import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, AlertIOS, Image, Linking } from "react-native";

//生成随机手机号
function getMobile() {

  var prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "185", "189");
  var i = parseInt(10 * Math.random());
  var prefix = prefixArray[i];

  for (var j = 0; j < 8; j++) {
    prefix = prefix + Math.floor(Math.random() * 10);

  }
  return prefix;
}

describe('我的', () => {
  beforeEach(async () => {

    await device.reloadReactNative();
    await waitFor(element(by.id('myTab_PersonScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('myTab_PersonScreen')).tap();
  });


  it('消息通知', async () => {

    await waitFor(element(by.id('message_PageHeader'))).toBeVisible().withTimeout(10000);
    await element(by.id('message_PageHeader')).tap();
    await expect(element(by.id('messageDetail_MessageNotifyScreen'))).toBeVisible();
    // ？验证逻辑

  });

  it('设置', async () => {

    await waitFor(element(by.id('setting_PageHeader'))).toBeVisible().withTimeout(10000);
    await element(by.id('setting_PageHeader')).tap();
    await expect(element(by.text('编辑个人资料'))).toBeVisible();

    // //编辑个人资料
    await waitFor(element(by.text('编辑个人资料'))).toBeVisible().withTimeout(10000);
    await element(by.text('编辑个人资料')).tap();

    // ？更换头像，定位相册元素
    await waitFor(element(by.id('changeImage_EditUserBaseInfoScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('changeImage_EditUserBaseInfoScreen')).tap();
    await waitFor(element(by.id('openImageSelection_EditUserbaseInfoScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('openImageSelection_EditUserbaseInfoScreen')).tap();

    // 编辑资料中的其他item已在我的履历编辑-基本信息实现

    // ？保存按钮定位


    // //身份管理
    await waitFor(element(by.text('身份管理'))).toBeVisible().withTimeout(10000);
    await element(by.text('身份管理')).tap();
    await expect(element(by.text('温馨提示'))).toBeVisible();
    await element(by.id('selectNor_IdentifyManageList')).tap();
    // ？验证逻辑
    // 返回按钮

    // //账号与安全
    await waitFor(element(by.text('账号与安全'))).toBeVisible().withTimeout(10000);
    await element(by.text('账号与安全')).tap();
    // 手机号码
    await waitFor(element(by.text('手机号码'))).toBeVisible().withTimeout(10000);
    await element(by.text('手机号码')).tap();
    await waitFor(element(by.id('setPwd_PhoneManageScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('setPwd_PhoneManageScreen')).tap();
    await waitFor(element(by.id('inputCode_SetPasswordScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('inputCode_SetPasswordScreen')).replaceText(Math.random().toString().slice(-4));
    await element(by.id('inputPassword_SetPasswordScreen')).replaceText('123456');
    await element(by.id('confirm_SetPasswordScreen')).tap();

    // 更换手机号

    await waitFor(element(by.id('changePhone_PhoneManageScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('changePhone_PhoneManageScreen')).tap();
    await waitFor(element(by.id('inputNewPhone_ChangePhoneScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('inputNewPhone_ChangePhoneScreen')).replaceText('13812345678');
    await element(by.id('inputMsgCode_ChangePhoneScreen')).replaceText(Math.random().toString().slice(-4));
    await element(by.id('confirm_ChangePhoneScreen')).tap();

    // ？微信测试

    // //隐私设置
    await element(by.traits(['button']).and(by.label('Back'))).tap();
    await element(by.traits(['button']).and(by.label('Back'))).tap();
    await waitFor(element(by.text('隐私设置'))).toBeVisible().withTimeout(10000);
    await element(by.text('隐私设置')).tap();
    // ？switch按钮定位，验证逻辑

    // //关于
    await element(by.traits(['button']).and(by.label('Back'))).tap();
    await waitFor(element(by.text('关于'))).toBeVisible().withTimeout(10000);
    await element(by.text('关于')).tap();
    await waitFor(element(by.text('版本说明'))).toBeVisible().withTimeout(10000);
    await element(by.text('版本说明')).tap();
    await expect(element(by.text('updateText_AboutVersionScreen'))).toBeVisible();
    await element(by.traits(['button']).and(by.label('Back'))).tap();
    await waitFor(element(by.text('去评分'))).toBeVisible().withTimeout(10000);
    await element(by.text('去评分')).tap();
    await expect(Linking.openURL("http://shandudata.com/"));
    await waitFor(element(by.text('服务协议'))).toBeVisible().withTimeout(10000);
    await element(by.text('服务协议')).tap();
    await waitFor(element(by.id('service_TosScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('service_TosScreen')).scrollTo('bottom');
    await expect(element(by.text('解释本条款'))).toBeVisible();
    await element(by.traits(['button']).and(by.label('Back'))).tap();
    await element(by.traits(['button']).and(by.label('Back'))).tap();

    // //退出当前账号
    await waitFor(element(by.id('exitAccount_UserSettingForm'))).toBeVisible().withTimeout(10000);
    await element(by.id('exitAccount_UserSettingForm')).tap();
    await waitFor(element(by.text('确定'))).toBeVisible().withTimeout(10000);
    await element(by.text('确定')).tap();
    await expect(element(by.id('loginPhone_LoginMainScreen'))).toBeVisible();

  });

  it('我的主页', async () => {

    await waitFor(element(by.id('gotoMyPage_PersonMainTOp'))).toBeVisible().withTimeout(10000);
    await element(by.id('gotoMyPage_PersonMainTOp')).tap();

    // 发布动态，？右上角发布按钮
    // 
    // 
    await waitFor(element(by.id('content_PostTrends'))).toBeVisible().withTimeout(10000);
    await element(by.id('content_PostTrends')).replaceText(Math.random().toString().slice(-6));
    await element(by.id('takePhoto_SDTakePhoto')).tap();
    // 定位相册元素



    // 关注
    await waitFor(element(by.text('关注'))).toBeVisible().withTimeout(10000);
    await element(by.text('关注')).tap();
    await expect(element(by.text('我的关注'))).toBeVisible();
    await element(by.traits(['button']).and(by.label('Back'))).tap();

    // 粉丝
    await waitFor(element(by.text('粉丝'))).toBeVisible().withTimeout(10000);
    await element(by.text('粉丝')).tap();
    await expect(element(by.text('我的粉丝'))).toBeVisible();
    await element(by.traits(['button']).and(by.label('Back'))).tap();

    // 动态
    await waitFor(element(by.text('动态'))).toBeVisible().withTimeout(10000);
    await element(by.text('动态')).tap();
    await element(by.text('完成')).scrollTo('bottom');
  // 所获证书
  });

  it('我的关注', async () => {

    await waitFor(element(by.id('myFallow_PersonMainTop'))).toBeVisible().withTimeout(10000);
    await element(by.id('myFallow_PersonMainTop')).tap();
    await expect(element(by.text('我的关注'))).toBeVisible();
    // ？关注用户的定位

  });
  it('我的粉丝', async () => {

    await waitFor(element(by.id('myFans_PersonMainTop'))).toBeVisible().withTimeout(10000);
    await element(by.id('myFans_PersonMainTop')).tap();
    await expect(element(by.text('我的粉丝'))).toBeVisible();
    // ？粉丝用户的定位

  });

  it('我的履历', async () => {

    await waitFor(element(by.id('myResume_MainPageButton'))).toBeVisible().withTimeout(10000);
    await element(by.id('myResume_MainPageButton')).tap();
    await expect(element(by.id('viewShot_TrackRecordScreen'))).toBeVisible();

  });


  it('我的收藏', async () => {

    await waitFor(element(by.id('myCollection_MainPageButton'))).toBeVisible().withTimeout(10000);
    await element(by.id('myCollection_MainPageButton')).tap();

    // ？内容/数据报告 收藏数量验证逻辑
    await expect(element(by.id('viewShot_TrackRecordScreen'))).toBeVisible();
    await waitFor(element(by.text('管理'))).toBeVisible().withTimeout(10000);
    await element(by.text('管理')).tap();
    // 点选item
    await element(by.text('删除')).tap();
    await waitFor(element(by.text('确定'))).toBeVisible().withTimeout(10000);
    await element(by.text('确定')).tap();
    await expect(element(by.id('viewShot_TrackRecordScreen'))).toBeVisible();
  });


  it('我的职通力', async () => {

    await waitFor(element(by.text('我的职通力'))).toBeVisible().withTimeout(10000);
    await element(by.text('我的职通力')).tap();
    await expect(element(by.text('职通力成长趋势'))).toBeVisible();

  });



  it('帮助中心', async () => {

    await waitFor(element(by.text('帮助中心'))).toBeVisible().withTimeout(10000);
    await element(by.text('帮助中心')).tap();
    await waitFor(element(by.text('什么是职通力'))).toBeVisible().withTimeout(10000);
    await element(by.text('什么是职通力')).tap();
    await waitFor(element(by.text('关闭'))).toBeVisible().withTimeout(10000);
    await element(by.text('关闭')).tap();
    await expect(element(by.text('什么是职通力'))).toBeVisible();

  });


  it('分享给好友', async () => {

    // 微信缺失

  });


  it('意见反馈', async () => {

    await waitFor(element(by.text('意见反馈'))).toBeVisible().withTimeout(10000);
    await element(by.text('意见反馈')).tap();
    await waitFor(element(by.id('suggestContent_FeedBackForm'))).toBeVisible().withTimeout(10000);
    await element(by.text('故障错误')).tap();
    await element(by.id('suggestContent_FeedBackForm')).replaceText(Math.random().toString().slice(-6));
    await element(by.id('contactInfo_FeedBackForm')).replaceText(getMobile());
    // 验证复制逻辑
    await element(by.id('copyGroup_FeedBackScreen')).tap();

    await element(by.id('submit_FeedBackForm')).tap();
    await expect(element(by.text('意见反馈'))).toBeVisible();
  });



});
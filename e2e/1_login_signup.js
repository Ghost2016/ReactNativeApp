// console.log(getName())
// console.log(getMobile())
// 生成随机姓名
function getName() {
  var familyNames = new Array(
    "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
    "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
    "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏",
    "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
    "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦",
    "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
    "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺",
    "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
    "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余",
    "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
  );
  var givenNames = new Array(
    "子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛",
    "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊",
    "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政",
    "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建",
    "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋",
    "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅",
    "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡",
    "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕",
    "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵",
    "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌"
  );

  var i = parseInt(10 * Math.random()) * 10 + parseInt(10 * Math.random());
  var familyName = familyNames[i];

  var j = parseInt(10 * Math.random()) * 10 + parseInt(10 * Math.random());
  var givenName = givenNames[i];

  var name = familyName + givenName;

  return name;
}

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




describe('登录注册', () => {
  // afterEach(async () => {
  //   await device.uninstallApp();
  //   await device.installApp();
  //   await device.launchApp({
  //     permissions: {
  //       notifications: "YES",
  //       health: "YES",
  //       location: 'always'
  //     },
  //   });
  //   await device.reloadReactNative();
  // });

// // // 起始页面
it('startScreen', async () => {
  await device.disableSynchronization();
  await waitFor(element(by.text('名企课堂'))).toBeVisible().withTimeout(10000);
  await element(by.text('名企课堂')).swipe('left');
  await waitFor(element(by.text('职业规划'))).toBeVisible().withTimeout(10000);
  await element(by.text('职业规划')).swipe('left');
  await waitFor(element(by.text('能力榜单'))).toBeVisible().withTimeout(10000);
  await expect(element(by.text('能力榜单'))).toBeVisible();
  await element (by.text('注册')).tap();
  await waitFor(element(by.id('submitRegister_RegisterScreen'))).toBeVisible().withTimeout(10000);
  await element(by.id('backButton_RegisterScreen')).multiTap(3);
  await waitFor(element(by.text('登录'))).toBeVisible().withTimeout(10000);
  await element(by.text('登录')).multiTap(10)
  ;
  await waitFor(element(by.id('loginPhone_LoginMainScreen'))).toBeVisible().withTimeout(10000);
});

  // // // 手机号密码登录
  it('phone_number login', async () => {
    await device.disableSynchronization();
    await expect(element(by.id('loginPhone_LoginMainScreen'))).toBeVisible();
    // 输入正确的手机号密码
    await element(by.id('loginPhone_LoginMainScreen')).replaceText('13212345677');
    await element(by.id('password_LoginMainScreen')).replaceText('q1w2e3r4');
    await element(by.id('loginButton_LoginMainScreen')).tap();
    await waitFor(element(by.id('locate_CardSchool'))).toBeVisible().withTimeout(10000);
    //  // 选择地区
    // await element(by.id('locate_CardSchool')).tap();
    // await waitFor(element(by.text('河北省'))).toBeVisible().withTimeout(10000);
    // await element(by.text('河北省')).tap();
    // await waitFor(element(by.text('石家庄市'))).toBeVisible().withTimeout(10000);
    // await element(by.text('石家庄市')).tap();
    // await expect(element(by.id('locate_CardSchool'))).toBeVisible();
    // 选择学校
    // await expect(element(by.label('SDTouchOpacity'))).toBeVisible();
    await waitFor(element(by.id('inputSchool_CardSchool'))).toBeVisible().withTimeout(10000);
    await expect(element(by.id('inputSchool_CardSchool'))).toBeVisible();
    await element(by.id('inputSchool_CardSchool')).tap();
  // await waitFor(element(by.id('searchSchool_SDSearchBar'))).toBeVisible().withTimeout(10000);
  // await element(by.id('searchSchool_SDSearchBar')).replaceText('电子科技大学');
  // await expect(element(by.id('locate_CardSchool'))).toBeVisible();
  // // 登录到主页面
  // await waitFor(element(by.id('homeScreen'))).toBeVisible().withTimeout(10000);
  // await expect(element(by.id('homeScreen'))).toBeVisible();
  });



  // // // 手机号验证码登录
  it('code_Text login', async () => {
    await expect(element(by.text('手机号快速登录'))).toBeVisible();
    // 输入正确的手机号验证码
    await element(by.text('手机号快速登录')).tap();
    await element(by.id('userPhone_LoginMainScreen')).replaceText('13812345678');
    await element(by.id('userCodeInput_LoginMainScreen')).replaceText(Math.random().toString().slice(-4));
    await element(by.id('loginButton_LoginMainScreen')).tap();
    // 登录到主页面
    await waitFor(element(by.id('homeScreen'))).toBeVisible().withTimeout(10000);
    await expect(element(by.id('homeScreen'))).toBeVisible();
  });

  // // // 微信登录



  // ////忘记密码
  it('forget password', async () => {
    await expect(element(by.id('ForgetPassword_LoginMainScreen'))).toBeVisible();
    await element(by.id('ForgetPassword_LoginMainScreen')).tap();
    // 输入信息
    await expect(element(by.id('userAccount_ForgetPasswordScreen'))).toBeVisible();

    // 手机号码
    await element(by.id('userAccount_ForgetPasswordScreen')).replaceText('13812345678');

    // 验证码
    await element(by.id('userCode_ForgetPasswordScreen')).replaceText(Math.random().toString().slice(-4));

    // 密码
    await element(by.id('userPassword_ForgetPasswordScreen')).replaceText('123456');

    // 确认密码
    await element(by.id('userPassword2_ForgetPasswordScreen')).replaceText('123456');
    await element(by.id('confirm_ForgetPasswordScreen')).tap();

    // 跳转到基本信息填写页面
    await waitFor(element(by.id('loginPhone_LoginMainScreen'))).toBeVisible().withTimeout(10000);
    await expect(element(by.id('loginPhone_LoginMainScreen'))).toBeVisible();

  });


  // // // 注册
  it('注册', async () => {
    await expect(element(by.id('loginPhone_LoginMainScreen'))).toBeVisible();
    await element(by.id('SignupText_LoginMainScreen')).tap();
    // 输入注册信息
    await expect(element(by.id('SetPhoneNumber_RegisterScreen'))).toBeVisible();

    // 手机号码
    await element(by.id('SetPhoneNumber_RegisterScreen')).replaceText(getMobile());

    // 验证码
    await element(by.id('codeText_RegisterScreen')).replaceText(Math.random().toString().slice(-4));

    // 密码
    await element(by.id('SetPassword_RegisterScreen')).replaceText('123456');

    // 昵称
    await element(by.id('SetNickname_RegisterScreen')).replaceText(getName());
    await element(by.id('submitRegister_RegisterScreen')).tap();

    // 跳转到基本信息填写页面
    await waitFor(element(by.id('locate_CardSchool'))).toBeVisible().withTimeout(10000);
    await expect(element(by.id('locate_CardSchool'))).toBeVisible();

    // 基本信息填写
    await element(by.id('locate_CardSchool')).tap();
    await expect(element(by.text('北京市'))).toBeVisible();

    // 大学
    await element(by.id('inputSchool_CardSchool-bak')).tap();
    await element(by.id('search_SDSearchBar')).replaceText('电子科技大学');
    await waitFor(element(by.text('电子科技大学'))).toBeVisible().withTimeout(10000);
    await element(by.text('电子科技大学')).tap();
    await waitFor(element(by.text('下一步'))).toBeVisible().withTimeout(10000);
    await element(by.text('下一步')).tap();

    await waitFor(element(by.id('inputCollege_CardCollege'))).toBeVisible().withTimeout(10000);
    await element(by.id('inputCollege_CardCollege')).tap();
    await element(by.id('search_SDSearchBar')).replaceText('计算机学院');
    await element(by.text('计算机学院')).tap();
    await waitFor(element(by.text('下一步'))).toBeVisible().withTimeout(10000);
    await element(by.text('下一步')).tap();

  });


});
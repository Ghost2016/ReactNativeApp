describe('首页', () => {
  beforeEach(async () => {

    await device.reloadReactNative();
  });

  it('职通力', async () => {

    await expect(element(by.id('loginPhone_LoginMainScreen'))).toBeVisible();
    // 输入正确的手机号密码
    await element(by.id('loginPhone_LoginMainScreen')).replaceText('13812345678');
    await element(by.id('password_LoginMainScreen')).replaceText('123456');
    // await waitFor(element(by.id('loginButton_LoginMainScreen'))).toBeVisible().withTimeout(3000);
    await element(by.id('loginButton_LoginMainScreen')).tap();

    await waitFor(element(by.id('GrowTargetSwitch_HomeScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('GrowTargetSwitch_HomeScreen')).tap();
    // 时间选择器
    await waitFor(element(by.id('LightBoxScreen_ExpDetailScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('LightBoxScreen_ExpDetailScreen')).tap();
    await waitFor(element(by.text('确定'))).toBeVisible().withTimeout(10000);
    await element(by.id('确定')).tap();


    // await element(by.text('职通力成长趋势')).scrollTo('bottom');



    // await waitFor(element(by.text('职通力'))).toBeVisible().withTimeout(10000);
    // await element(by.text('职通力')).tap();


  });


  it('目标职位', async () => {

    // await expect(element(by.id('loginPhone_LoginMainScreen'))).toBeVisible();
    // // 输入正确的手机号密码
    // await element(by.id('loginPhone_LoginMainScreen')).replaceText('13812345678');
    // await element(by.id('password_LoginMainScreen')).replaceText('123456');
    // // await waitFor(element(by.id('loginButton_LoginMainScreen'))).toBeVisible().withTimeout(3000);
    // await element(by.id('loginButton_LoginMainScreen')).tap();

    await waitFor(element(by.id('targetJob_TextTwoLink'))).toBeVisible().withTimeout(10000);
    await element(by.id('targetJob_TextTwoLink')).tap();

    // 制定新的目标
    await waitFor(element(by.text('制定新的目标'))).toBeVisible().withTimeout(10000);
    await element(by.text('制定新的目标')).tap();
    await waitFor(element(by.text('专业对口'))).toBeVisible().withTimeout(10000);
    await element(by.text('专业对口')).tap();
    await element(by.id('majorBack_GrowingFutureChoose')).tap();

    await waitFor(element(by.id('DRefreshFutureList_GrowingFutureChoose'))).toBeVisible().withTimeout(10000);
    await element(by.id('draftGoal_GrowingFuture')).tap();

    await waitFor(element(by.text('IT'))).toBeVisible().withTimeout(10000);
    await element(by.text('IT')).tap();
    await waitFor(element(by.text('确定'))).toBeVisible().withTimeout(10000);
    await element(by.text('确定')).tap();
    await waitFor(element(by.text('下一步'))).toBeVisible().withTimeout(10000);
    await element(by.text('下一步')).tap();

    await waitFor(element(by.text('产品经理'))).toBeVisible().withTimeout(10000);
    await element(by.text('产品经理')).tap();

    await waitFor(element(by.text('加入我的规划'))).toBeVisible().withTimeout(10000);
    await element(by.text('加入我的规划')).tap();

    await expect(element(by.text('我的目标'))).toBeVisible();
    // 切换目标
    await waitFor(element(by.id('GrowTargetSwitch_HomeScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('GrowTargetSwitch_HomeScreen')).tap();



    await waitFor(element(by.id('homeScreen'))).toBeVisible().withTimeout(10000);
    await expect(element(by.id('homeScreen'))).toBeVisible();

  });


  it('开门指路', async () => {

    await waitFor(element(by.id('article_HomeScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('article_HomeScreen')).tap();
    await waitFor(element(by.id('articleDetail_StudentShare'))).toBeVisible().withTimeout(10000);
    await element(by.id('articleDetail_StudentShare')).tap();
    await element(by.text('有用')).tap();
    await element(by.text('收藏')).tap();

  // ？验证右上角排序
  });

  it('我的履历', async () => {



    await waitFor(element(by.id('myResume_HomeScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('myResume_HomeScreen')).tap();
    // //编辑基本信息
    await waitFor(element(by.id('nameInput_EditUserBaseInfoScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('nameInput_EditUserBaseInfoScreen')).replaceText(Math.random().toString().slice(-4));
    await element(by.text('保存')).tap();
    await expect(element(by.id('nameInput_EditUserBaseInfoScreen'))).toBeVisible();

    // //编辑教育经历

    await waitFor(element(by.id('editEducationnfo_TrackRecordScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('editEducationnfo_TrackRecordScreen')).tap();
    // 认证

    await waitFor(element(by.text('认证'))).toBeVisible().withTimeout(10000);
    await element(by.text('认证')).tap();
    await expect(element(by.id('nameInput_EditUserBaseInfoScreen'))).toBeVisible();
    await element(by.id('account_AddChisAccount')).replaceText('123');
    await element(by.id('password_AddChisAccount')).replaceText('123456');
    await element(by.text('绑定账号')).tap();
    await element(by.text('完成')).tap();

    // 编辑

    await waitFor(element(by.text('编辑'))).toBeVisible().withTimeout(10000);
    await element(by.text('编辑')).tap();
    await waitFor(element(by.text('删除该教育经历'))).toBeVisible().withTimeout(10000);
    await element(by.text('删除该教育经历')).tap();
    await expect(element(by.text('该教育经历已被设置为默认身份，不可删除！'))).toBeVisible();
    await element(by.text('确定')).tap();
    await waitFor(element(by.text('保存'))).toBeVisible().withTimeout(10000);
    await element(by.text('保存')).tap();
    await element(by.traits(['button']).and(by.label('Back'))).tap();

    // 添加

    // //添加在校成绩

    await waitFor(element(by.id('editLearnedCourse_TrackRecordScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('editLearnedCourse_TrackRecordScreen')).tap();
    await expect(element(by.text('正在验证中'))).toBeVisible();
    await element(by.traits(['button']).and(by.label('Back'))).tap();


    // //添加在校职务

    await waitFor(element(by.id('inSchoolJobs_TrackRecordScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('inSchoolJobs_TrackRecordScreen')).tap();

    // 职务
    await waitFor(element(by.id('jobInput_EditInSchoolJobsScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('jobInput_EditInSchoolJobsScreen')).replaceText('12345');
    // 开始时间
    await element(by.id('startInput_EditInSchoolJobsScreen')).tap();
    await waitFor(element(by.text('确定'))).toBeVisible().withTimeout(10000);
    await element(by.text('确定')).tap();
    // 结束时间
    await waitFor(element(by.id('endInput_EditInSchoolJobsScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('endInput_EditInSchoolJobsScreen')).tap();
    await element(by.label('SelectorDate')).scroll(100, 'down');
    await element(by.text('确定')).tap();
    // 职务描述
    await waitFor(element(by.id('inputDetail_EditInSchoolJobsScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('inputDetail_EditInSchoolJobsScreen')).replaceText('12345');
    await element(by.text('保存')).tap();

    await expect(element(by.text('在校职位'))).toBeVisible();

    // //添加获奖经历 无法定位相册图片问题



    // //添加实习经历
    await waitFor(element(by.id('addPractice_TrackRecordScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('addPractice_TrackRecordScreen')).tap();
    // 公司
    await waitFor(element(by.id('companyInput_AddPracticeScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('companyInput_AddPracticeScreen')).replaceText('12345');
    // 职务
    await waitFor(element(by.id('jobInput_AddPracticeScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('jobInput_AddPracticeScreen')).replaceText('12345');
    // 开始时间
    await element(by.text('开始时间')).tap();
    await waitFor(element(by.text('确定'))).toBeVisible().withTimeout(10000);
    await element(by.text('确定')).tap();
    // 结束时间
    await waitFor(element(by.id('结束时间'))).toBeVisible().withTimeout(10000);
    await element(by.id('结束时间')).tap();
    await element(by.label('SelectorDate')).scroll(100, 'down');
    await element(by.text('确定')).tap();
    // 工作内容描述
    await waitFor(element(by.id('workDetail_AddPracticeScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('workDetail_AddPracticeScreen')).replaceText('12345');
    await element(by.text('保存')).tap();
    await expect(element(by.text('实习经历'))).toBeVisible();

    // //添加证书 无法定位相册图片问题

    ////添加自我评价
    await waitFor(element(by.id('remarkInput_SelfEvaluationScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('remarkInput_SelfEvaluationScreen')).replaceText('12345');
    await element(by.text('保存')).tap();
    await expect(element(by.text('自我评价'))).toBeVisible();
  });

  it('我要成长', async () => {

    // 我的目标
    await waitFor(element(by.id('myGrow_HomeScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('myGrow_HomeScreen')).tap();
    await waitFor(element(by.id('targetJob_TextTwoLink'))).toBeVisible().withTimeout(10000);
    await element(by.id('targetJob_TextTwoLink')).tap();
    await expect(element(by.text('我的目标'))).toBeVisible();
    await element(by.text('收藏')).tap();
    await expect(element(by.text('实习经历'))).toBeVisible();
    await element(by.traits(['button']).and(by.label('Back'))).tap();

    // 开门指路
    await waitFor(element(by.id('imageStudentShare_GrowScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('imageStudentShare_GrowScreen')).tap();
    await expect(element(by.text('觉得有用'))).toBeVisible();
    await element(by.traits(['button']).and(by.label('Back'))).tap();
    // 职场技能
    await waitFor(element(by.id('jobSkill_GrowScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('jobSkill_GrowScreen')).tap();
    await waitFor(element(by.text('office-excel'))).toBeVisible().withTimeout(10000);
    await element(by.id('office-excel')).tap();
    await waitFor(element(by.text('完成'))).toBeVisible().withTimeout(10000);
    await element(by.id('完成')).tap();
    await waitFor(element(by.id('inputfeel_PunchSkill'))).toBeVisible().withTimeout(10000);
    await element(by.id('inputfeel_PunchSkill')).tap();
    await element(by.id('achiveCard_PunchSkill')).tap();
    // ？关闭弹出的完成任务提示

  // 证书考取，定位相册图片问题
  });

  it('每日打卡', async () => {
    await waitFor(element(by.id('growCheckin_HomeScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('growCheckin_HomeScreen')).tap();
    await waitFor(element(by.text('今日背单词了')).and(by.text('未打卡'))).toBeVisible().withTimeout(10000);
    await element(by.text('今日背单词了')).and(by.text('未打卡')).tap();
    await element(by.id('查看月汇总')).tap();
    await element(by.traits(['button']).and(by.label('Back'))).tap();
  // ？关闭弹出的完成任务提示
  });


  //// 算薪资

  it('算薪资', async () => {


    // 开始算薪资
    await waitFor(element(by.id('calSalary_HomeScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('calSalary_HomeScreen')).tap();
    await waitFor(element(by.text('开始算薪资'))).toBeVisible().withTimeout(10000);
    await element(by.text('开始算薪资')).tap();
    await waitFor(element(by.id('chengdu_Salary00'))).toBeVisible().withTimeout(10000);
    await element(by.id('chengdu_Salary00')).tap();
    await waitFor(element(by.id('gongChengShi_Salary01'))).toBeVisible().withTimeout(10000);
    await element(by.id('gongChengShi_Salary01')).tap();
    await waitFor(element(by.text('Android'))).toBeVisible().withTimeout(10000);
    await element(by.text('Android')).tap();
    await waitFor(element(by.id('benKe_Salary03'))).toBeVisible().withTimeout(10000);
    await element(by.id('benKe_Salary03')).tap();
    await waitFor(element(by.id('baiYang_Salary06'))).toBeVisible().withTimeout(10000);
    await element(by.id('baiYang_Salary06')).tap();
    await waitFor(element(by.id('nv_Salary07'))).toBeVisible().withTimeout(10000);
    await element(by.id('nv_Salary07')).tap();
    await waitFor(element(by.id('OT_Salary08'))).toBeVisible().withTimeout(10000);
    await element(by.id('OT_Salary08')).tap();
    await waitFor(element(by.id('praise_Salary09'))).toBeVisible().withTimeout(10000);
    await element(by.id('praise_Salary09')).tap();
    await waitFor(element(by.text('生成我的薪资'))).toBeVisible().withTimeout(10000);
    await element(by.text('生成我的薪资')).tap();

    // 再玩一次
    await waitFor(element(by.text('再玩一次'))).toBeVisible().withTimeout(10000);
    await element(by.text('再玩一次')).tap();
    await waitFor(element(by.id('calSalary_HomeScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('calSalary_HomeScreen')).tap();
    await waitFor(element(by.text('开始算薪资'))).toBeVisible().withTimeout(10000);
    await element(by.text('开始算薪资')).tap();
    await waitFor(element(by.id('chengdu_Salary00'))).toBeVisible().withTimeout(10000);
    await element(by.id('chengdu_Salary00')).tap();
    await waitFor(element(by.id('gongChengShi_Salary01'))).toBeVisible().withTimeout(10000);
    await element(by.id('gongChengShi_Salary01')).tap();
    await waitFor(element(by.text('Android'))).toBeVisible().withTimeout(10000);
    await element(by.text('Android')).tap();
    await waitFor(element(by.id('benKe_Salary03'))).toBeVisible().withTimeout(10000);
    await element(by.id('benKe_Salary03')).tap();
    await waitFor(element(by.id('baiYang_Salary06'))).toBeVisible().withTimeout(10000);
    await element(by.id('baiYang_Salary06')).tap();
    await waitFor(element(by.id('nv_Salary07'))).toBeVisible().withTimeout(10000);
    await element(by.id('nv_Salary07')).tap();
    await waitFor(element(by.id('OT_Salary08'))).toBeVisible().withTimeout(10000);
    await element(by.id('OT_Salary08')).tap();
    await waitFor(element(by.id('praise_Salary09'))).toBeVisible().withTimeout(10000);
    await element(by.id('praise_Salary09')).tap();
    await waitFor(element(by.text('生成我的薪资'))).toBeVisible().withTimeout(10000);
    await element(by.text('生成我的薪资')).tap();


    // 返回首页
    await waitFor(element(by.text('返回首页'))).toBeVisible().withTimeout(10000);
    await element(by.text('返回首页')).tap();
    await expect(element(by.id('calSalary_HomeScreen'))).toBeVisible();

  });
  // //薪资增长趋势
  it('薪资增长趋势', async () => {
    await waitFor(element(by.text('薪资增长趋势'))).toBeVisible().withTimeout(10000);
    await element(by.text('薪资增长趋势')).tap();
    await waitFor(element(by.text('本校就业情况'))).toBeVisible().withTimeout(10000);
    await element(by.text('本校就业情况')).tap();

  });

  // //薪资增长趋势
  it('就业领域分布', async () => {
    await waitFor(element(by.text('就业领域分布'))).toBeVisible().withTimeout(10000);
    await element(by.text('就业领域分布')).tap();
    await waitFor(element(by.text('就业行业分布'))).toBeVisible().withTimeout(10000);
    await element(by.text('就业行业分布')).scrollTo('bottom');

  });
  // //就业公司分布
  it('就业公司分布', async () => {
    await waitFor(element(by.text('就业领域分布'))).toBeVisible().withTimeout(10000);
    await element(by.text('就业领域分布')).scrollTo('bottom');
    await waitFor(element(by.text('就业公司分布'))).toBeVisible().withTimeout(10000);
    await element(by.text('就业公司分布')).tap();

  });

  // //查询更多
  it('查询更多', async () => {
    await waitFor(element(by.text('就业领域分布'))).toBeVisible().withTimeout(10000);
    await element(by.text('就业领域分布')).scrollTo('bottom');
    await waitFor(element(by.text('查询更多'))).toBeVisible().withTimeout(10000);
    await element(by.text('查询更多')).tap();
    // 学校
    await waitFor(element(by.text('成都理工大学'))).toBeVisible().withTimeout(10000);
    await element(by.text('成都理工大学')).scrollTo('bottom');
    await expect(element(by.text('四川财经职业学院'))).toBeVisible();

    // 专业
    await waitFor(element(by.text('专业'))).toBeVisible().withTimeout(10000);
    await element(by.text('专业')).tap();
    await waitFor(element(by.text('本科专业'))).toBeVisible().withTimeout(10000);
    await element(by.text('本科专业')).tap();
    await waitFor(element(by.text('哲学'))).toBeVisible().withTimeout(10000);
    await element(by.text('哲学')).tap();
    await waitFor(element(by.text('哲学类'))).toBeVisible().withTimeout(10000);
    await element(by.text('哲学类')).tap();
    await waitFor(element(by.text('哲学'))).toBeVisible().withTimeout(10000);
    await element(by.text('哲学')).tap();
    await element(by.text('专业概况')).scrollTo('bottom');
    // ？收藏按钮
    await element(by.traits(['button']).and(by.label('Back'))).tap();


    // 学校
    await waitFor(element(by.text('IT'))).toBeVisible().withTimeout(10000);
    await element(by.text('IT')).tap();
    await expect(element(by.text('数据解读'))).toBeVisible();


    // 职位

    await waitFor(element(by.text('IT'))).toBeVisible().withTimeout(10000);
    await element(by.text('IT')).tap();
    await waitFor(element(by.text('技术-人工智能'))).toBeVisible().withTimeout(10000);
    await element(by.text('技术-人工智能')).tap();
    await waitFor(element(by.text('机器学习工程师'))).toBeVisible().withTimeout(10000);
    await element(by.text('机器学习工程师')).tap();
    await waitFor(element(by.text('加入我的规划'))).toBeVisible().withTimeout(10000);
    await element(by.text('加入我的规划')).tap();
    await expect(element(by.text('我的目标'))).toBeVisible();
  });


  // //查询更多-搜索
  it('查询更多-搜索', async () => {
    /////

  });
});

describe('排名', () => {
  beforeEach(async () => {

    await device.reloadReactNative();
    await waitFor(element(by.id('rankTab_RankScreen'))).toBeVisible().withTimeout(10000);
    await element(by.id('rankTab_RankScreen')).tap();
  });
  //// 关注榜
  it('登峰榜—关注榜', async () => {


    // 切换城市
    await waitFor(element(by.id('getCity_RankTabOne'))).toBeVisible().withTimeout(10000);
    await element(by.id('getCity_RankTabOne')).tap();
    await waitFor(element(by.text('北京市'))).toBeVisible().withTimeout(10000);
    await element(by.text('北京市')).tap();
    await expect(element(by.id('content_ScoreText'))).toHaveText('北京');
    // 同类院校排名
    await waitFor(element(by.text('关注榜'))).toBeVisible().withTimeout(10000);
    await element(by.text('关注榜')).tap();
    await waitFor(element(by.text('同类院校排名'))).toBeVisible().withTimeout(10000);
    await element(by.text('同类院校排名')).tap();
    await expect(element(by.id('content_ScoreText'))).toHaveText('211');
    // 本校排名
    await waitFor(element(by.text('同类院校排名'))).toBeVisible().withTimeout(10000);
    await element(by.text('同类院校排名')).tap();
    await waitFor(element(by.text('本校排名'))).toBeVisible().withTimeout(10000);
    await element(by.text('本校排名')).tap();
    await expect(element(by.id('content_ScoreText'))).toHaveText('北京航空');
    // 同类专业排名
    await waitFor(element(by.text('本校排名'))).toBeVisible().withTimeout(10000);
    await element(by.text('本校排名')).tap();
    await waitFor(element(by.text('同类专业排名'))).toBeVisible().withTimeout(10000);
    await element(by.text('同类专业排名')).tap();
    await expect(element(by.id('content_ScoreText'))).toHaveText('计算机类');
    // 本专业排名
    await waitFor(element(by.text('同类专业排名'))).toBeVisible().withTimeout(10000);
    await element(by.text('同类专业排名')).tap();
    await waitFor(element(by.text('本专业排名'))).toBeVisible().withTimeout(10000);
    await element(by.text('本专业排名')).tap();
    await expect(element(by.id('content_ScoreText'))).toHaveText('计算机科学');


  });

  it('登峰榜—TOP榜', async () => {

    await waitFor(element(by.text('关注榜'))).toBeVisible().withTimeout(10000);
    await element(by.text('关注榜')).scrollTo('bottom');
    await waitFor(element(by.text('努力'))).toBeVisible().withTimeout(10000);
    await element(by.text('努力')).scrollTo('bottom');
    //   ？ 个人主页
    //    ？userlistItem定位


  });
  it('登峰榜—我的位次', async () => {

    await waitFor(element(by.text('关注榜'))).toBeVisible().withTimeout(10000);
    await element(by.text('关注榜')).scrollTo('bottom');
    await waitFor(element(by.text('登顶'))).toBeVisible().withTimeout(10000);
    await element(by.text('登顶')).scrollTo('bottom');
    //   ？ 个人主页
    //    ？userlistItem定位


  });


  it('关注榜—发现动态', async () => {

    await waitFor(element(by.text('关注榜'))).toBeVisible().withTimeout(10000);
    await element(by.text('关注榜')).tap();
    await waitFor(element(by.id('findEvent_RankTabTwo'))).toBeVisible().withTimeout(10000);
    await element(by.id('findEvent_RankTabTwo')).tap();
    await expect(element(by.text('关注动态'))).toBeVisible();


  });

  it('关注榜—排名', async () => {

    await waitFor(element(by.text('关注榜'))).toBeVisible().withTimeout(10000);
    await element(by.text('关注榜')).tap();
    await waitFor(element(by.id('findEvent_RankTabTwo'))).toBeVisible().withTimeout(10000);
    await element(by.id('findEvent_RankTabTwo')).scrollTo('bottom');
    //    ?我已领先

  });

  it('进步榜—排名', async () => {

    await waitFor(element(by.text('进步榜'))).toBeVisible().withTimeout(10000);
    await element(by.text('进步榜')).tap();
    await waitFor(element(by.text('我'))).toBeVisible().withTimeout(10000);
    await element(by.text('我')).scrollTo('bottom');
    // ？验证逻辑

  });
});
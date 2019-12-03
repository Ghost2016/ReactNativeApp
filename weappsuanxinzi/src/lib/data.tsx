
export const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const positionTags = {
  '产品狗' : ['产品经理', '产品总监', '产品助理'],
  '攻城狮' : ['C/C++', 'C#', 'Java', 'Python', 'PHP', 'JavaScript', 'Android', 'iOS', '前端', '后端', '测试', '运维', '项目经理', '架构师', '总监'],
  '射鸡湿' : ['视觉设计','交互设计','平面设计','游戏美术','动画','原画','用研','UI','UE','WEB','APP','总监'],
  '运营人猿' : ['运营专员', '运营总监', '编辑', '主编'],
  '市场商务' : ['销售', '市场推广', '总监'],
  '暖心行政' : ['行政', '人事', '财务', '客服', '总监/经理', '助理']
};

export const cityQuestions = {
  //  ['土豪扎堆-羡慕死了，你在深', '圳。除了吸金狂shopping，', '你想在哪个领域深耕？']
  北京: ['烤鸭文青-羡慕死了，你在帝', '都。除了吃烤鸭赏话剧，', '你想在哪个领域深耕？'],
  成都: ['天腐之国-羡慕死了，你在成', '都。除了吃串串逗基友，', '你想在哪个领域深耕？'],
  广州: ['养生胜地-羡慕死了，你在羊', '城。除了游珠江喝早茶，', '你想在哪个领域深耕？'],
  杭州: ['人间天堂—羡慕死了，你在杭', '州。除了游西湖品龙井，', '你想在哪个领域深耕？'],
  上海: ['红酒小资-羡慕死了，你在魔', '都。除了品红酒听JAZZ，', '你想在哪个领域深耕？'],
  深圳: ['土豪扎堆-羡慕死了，你在深', '圳。除了吸金狂shopping，', '你想在哪个领域深耕？'],
  武汉: ['学霸云集-羡慕死了，你在武', '汉。除了啃鸭脖赏樱花，', '你想在哪个领域深耕？'],
  西安: ['千年古都-羡慕死了，你在西', '安，除了逛皇陵忆历史，', '你想在哪个领域深耕？'],
  重庆: ['火锅辣妹-羡慕死了，你在山', '城。除了吃火锅看美女，', '你想在哪个领域深耕？']
};

export const constellations = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座']

export const formKeys = ['school','college','major']
export let initPostData = {
  data: {
    degree: "本科",
    gender: "男",
    jobType: "攻城狮",
    secondClass: ["Java", "项目经理"],
    city: "上海",
    workLength: "1-2",
    scale: "0-50",
    constellation: "金牛座",
    src: "img/rw/woman/gcs/5/gcs_5_jn.png",
    school: "",
    major: "",
    college: "",
  },
  ext: {
    q1: {
      "1": "妈蛋，肯定又让我加班！"
    },
    q2: {
      "4": "善意地称赞"
    }
  }
};
export let initData = [
  {
    t: 'singleSelect2city',
    q: ['日照香炉升紫烟', '姐们儿你在哪混圈？'],
    a: [['北京', '上海'], ['广州', '深圳'], ['杭州', '成都'], ['重庆', '武汉'], ['西安']],
    s: [[false, false], [false, false], [false, false], [false, false], [false]],
    c: '',
  },
  {
    t: 'singleSelect2position',
    q: ['土豪扎堆-羡慕死了，你在深', '圳。除了吸金狂shopping，', '你想在哪个领域深耕？'],
    a: [['产品狗', '攻城狮'], ['射鸡湿', '运营人猿'], ['市场商务', '暖心行政']],
    s: [[false, false], [false, false], [false, false]],
    c: '',
  },
  {
    t: 'singleSelect',
    q: ['选择职位标签'],
    a: ['C/C++','C#','Java','Python','PHP','Javascript','Android','iOS','前端','后端','测试','运维','项目经理','架构师','总监'],
    s: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    c: '',
  },
  {
    t: 'singleSelect1degree',
    q: ['英雄莫问出处，', '学历这些都是浮云！'],
    a: [['博士真学霸'], ['硕士学问家'], ['本科大法好'], ['专科逆袭王']],
    s: [[false], [false], [false], [false]],
    c: '',
  },
  {
    t: 'singleSelectIcon',
    q: ['这年头，新朋友认识不问问星','座都不好意思聊天，那你是？'],
    a: ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'],
    i: ['home_ico_Aries','home_ico_Taurus','home_ico_Gemini','home_ico_Cancer','home_ico_Leo','home_ico_Virgo','home_ico_Libra','home_ico_Scorpio','home_ico_Sagittarius','home_ico_Capricorn','home_ico_Aquarius','home_ico_Pisces'],
    s: [false,false,false,false,false,false,false,false,false,false,false,false],
    c: '',
  },
  {
    t: 'singleSelect1gender',
    q: ['正确的自我认识'],
    a: [['安静的美男子'], ['豪迈的萌妹子']],
    s: [[false], [false]],
    c: '',
  },
  {
    t: 'singleSelect1q1',
    q: ['如果BOSS周末给你打电话，', '你的第一反应是'],
    a: [['妈蛋，肯定又让我加班'], ['难道工作出什么突发状况了？'], ['新发现一家不错的餐厅，相约一同前往']],
    s: [[false], [false], [false]],
    c: '',
  },
  {
    t: 'singleSelect1q2',
    q: ['同事今天上班提了一个山寨LV', '的包包，你会'],
    a: [['默默的称赞'], ['默不作声，继续做自己的事情'], ['认真的说：“仿得不赖，哪买的”']],
    s: [[false], [false], [false]],
    c: '',
  },
  {
    t: 'form',
    q: ['教育经历信息'],
    a: ['学校：', '学院：', '专业：'],
    s: ['', '', ''],
    c: '',
  },
  {
    t: 'result',
    q: ['我能拿到的月薪'],
    a: ['独/立/女', '产品经理', '6年', ['赶上一年黄金周', '祖国河山随便游']],
    s: ['', '-毕业后从事的职业-', '-不吃不喝在成都买房-', ''],
    c: '',
  },
];

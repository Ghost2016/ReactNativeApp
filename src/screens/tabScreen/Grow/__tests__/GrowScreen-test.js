/* @flow */
import deepFreeze from 'deep-freeze';

import { refreshJobPlanListAction, refreshPowerAction, prepareShareData } from "@utils/funcs";
//import { NULL_ACCOUNT } from '../../nullObjects';
import * as HOSTS from "@src/host";

//./node_modules/jest/bin/jest.js ./src/screens/tabScreen/Grow/__tests__/GrowScreen-test.js

test('技能证书微信分享prepareShareData', async () => {
  //const accounts = deepFreeze([]);

  const userInfo = {
    newToken: '',
  avatar_url: '',
  city:
   { id: 32824,
     title: '成都市',
     province: { id: 32823, title: '四川省', alias: '' } },
    bind_wechat: false,
    content: '',
    courses: [],
    email: '',
    gender: 'male',
    id: 0,
    is_verified: false,
    nickname: 'Adam',
    phone: '',
    power: 33.41112,
    rank: 0,
    salary: 6499,
    up_power: 12.32424,
    up_salary: 3400,
    settings: null,
    total:
    { certificate_count: 0,
        fans: 0,
        major_name: '软件工程',
        degree_name: '本科',
        punch_count: 0,
        read_count: 0,
        school_name: '四川大学',
        tech_count: 0,
        watches: 0,
        college_name: '计算机' },
    wechat_info: null,
    created_time: '2018-08-01T00:00:00.215798'
  };
  //console.log("this.props.userInfo===", userInfo)
  const data = prepareShareData({
    content: "测试分享"
  }, userInfo, "测试目标")
  console.log("data", data)
  expect(data.webpageUrl).toBe(`${HOSTS.SHARE}/#/?skill=测试目标&name=Adam&gender=male&school=四川大学&degree=本科&major=软件工程&power=33.4&salary=6499&up=12.32424&task=0`);
});


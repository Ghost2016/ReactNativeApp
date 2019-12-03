import { fixStrTime, getDateObj, getTodayIndexOfWeek, getCurrentWeek,
  countHour, countHour2
} from '../funcs';
import sinon from "sinon";
//import { findPasswordAction } from "@src/screens/login/LoginActions"
//./node_modules/jest/bin/jest.js ./src/utils/__tests__/time-test.js

//import { isTesting, testAccount, testPassword } from 'react-native-dotenv'
//console.log("isTesting[][]=", isTesting)

describe('测试new date返回时间戳', () => {
  test('2018-08-02T11:11:11返回正确', () => {
    expect(fixStrTime('2018-08-02T11:11:11')).toEqual('2018/08/02 11:11:11');
  });

  test('2018-08-02T11:11:11.34234返回正确', () => {
    expect(fixStrTime('2018-08-02T11:11:11.34234')).toEqual('2018/08/02 11:11:11');
  });

  test('Tue Aug 07 2018 13:19:39 GMT+0800 (中国标准时间)返回正确', () => {
    expect(fixStrTime('Tue Aug 07 2018 13:19:39 GMT+0800 (中国标准时间)')).toEqual('Tue Aug 07 2018 13:19:39 GMT+0800 (中国标准时间)');
  });

});

describe('测试获取2018-08-19是星期几', () => {
  //const d = getDateObj();
  const [start, end] = getCurrentWeek(2018, 8, 19);
  let todayIndexOfWeek = getTodayIndexOfWeek(2018, 8, 19);
  test('2018-08-19所在的周一是13号', () => {
    expect(start).toEqual("2018-08-13");
    expect(end).toEqual("2018-08-19");
  });
  test('2018-08-19是星期天', () => {
    expect(todayIndexOfWeek).toEqual(0);
  });
  test('2018-08-19星期天不是未来日期', () => {
    const isFuture = todayIndexOfWeek == 0 ? false : (6 > todayIndexOfWeek - 1) ? false : true
    expect(isFuture).toEqual(false);
  });
});

describe('测试获取2018-08-13是星期几', () => {
  const [start, end] = getCurrentWeek(2018, 8, 13);
  let todayIndexOfWeek = getTodayIndexOfWeek(2018, 8, 13);
  let todayIndexOfWeek2 = getTodayIndexOfWeek(2018, 8, 15);
  test('2018-08-13所在的周日是19号', () => {
    expect(start).toEqual("2018-08-13");
    expect(end).toEqual("2018-08-19");
  });
  test('2018-08-13是星期一', () => {
    expect(todayIndexOfWeek).toEqual(1);
  });
  test('2018-08-13是星期一不是未来日期', () => {
    let i = 0 //0-6
    let isFuture = todayIndexOfWeek == 0 ? false : (i + 1 <= todayIndexOfWeek) ? false : true
    expect(isFuture).toEqual(false);
  });

  test('2018-08-15是星期三', () => {
    expect(todayIndexOfWeek2).toEqual(3);
  });
  test('2018-08-15是星期三不是未来日期', () => {
    let i = 3 - 1 //0-6
    let isFuture = todayIndexOfWeek2 == 0 ? false : (i + 1 <= todayIndexOfWeek2) ? false : true
    expect(isFuture).toEqual(false);
  });

  test('2018-08-16是星期四是未来日期', () => {
    let i = 4 - 1 //0-6
    let isFuture = todayIndexOfWeek2 == 0 ? false : (i + 1 <= todayIndexOfWeek2) ? false : true
    expect(isFuture).toEqual(true);
  });

  test('2018-08-17是星期五是未来日期', () => {
    let i = 5 - 1 //0-6
    let isFuture = todayIndexOfWeek2 == 0 ? false : (i + 1 <= todayIndexOfWeek2) ? false : true
    expect(isFuture).toEqual(true);
  });

});

describe('测试count2', () => {
  //const d = getDateObj();
  test('测试完成时间大于开始时间', () => {
    const data = {
      created_time: "2018-09-02T09:51:39.620184",
      end_time:"2018-09-02T11:27:00",
      finish_time:"2018-09-02T09:52:15.207998",
      start_time:"2018-09-02T09:27:00",
    };
    const createTime = (new Date(fixStrTime(data.create_time))).getTime()
    const endTime = (new Date(fixStrTime(data.end_time))).getTime()
    const finishTime = (new Date(fixStrTime(data.finish_time))).getTime()
    const startTime = (new Date(fixStrTime(data.start_time))).getTime()
    expect(finishTime > startTime).toEqual(true);
    console.log("result", finishTime, startTime)
    console.log("result2", finishTime - startTime)
    expect(finishTime - startTime).toEqual((25*60+15)*1000);
    expect(parseInt(100 * (finishTime - startTime) / 3600000, 10) / 100).toEqual(0.42)
    const result = countHour2(data)
    expect(result).toEqual(0.42);
  });

  test('测试完成时间小于开始时间', () => {
    const data2 = {
      created_time: "2018-09-02T08:51:39.620184",
      end_time:"2018-09-02T11:27:00",
      finish_time:"2018-09-02T09:12:15.207998",
      start_time:"2018-09-02T09:27:00",
    };
    const createTime = (new Date(fixStrTime(data2.created_time))).getTime()
    const endTime = (new Date(fixStrTime(data2.end_time))).getTime()
    const finishTime = (new Date(fixStrTime(data2.finish_time))).getTime()
    const startTime = (new Date(fixStrTime(data2.start_time))).getTime()
    expect(finishTime <= startTime).toEqual(true);
    expect(finishTime - createTime).toEqual((21*60-24)*1000);
    expect(parseInt(100 * (finishTime - createTime) / 3600000, 10) / 100).toEqual(0.34)
    const result = countHour2(data2)
    expect(result).toEqual(0.34);
  });


});

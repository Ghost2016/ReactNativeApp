const GET_CALCSALARY = "GET_CALCSALARY";

export default (
  state = {
    src:
      "?src=img/rw/man/sc/5/sc_5_tc.png&gender=man&summary=小康&increase=20&city=重庆&year=3",
    scale_index: 6.218600119691729,
    parameters: {
      lower_salary: 1000,
      city: "重庆",
      scale: 500,
      school_level: "中国一流大学",
      upper_salary: 2000,
      "2nd_class_2": "运营_运营",
      degree: "本科",
      max: 17628.633630935055,
      "3rd_class_2": "推广",
      "3rd_class_3": "市场推广",
      "3rd_class_1": "市场",
      alog_ver: 1.33,
      first_class: "市场与销售",
      add_time: {
        $date: 1530720044846
      },
      gender: "男",
      age: 27,
      min: 11672.22323253273,
      median: 14652.437688171809,
      first_class_2: "运营",
      first_class_1: "市场与销售",
      work_len: 10,
      "2nd_class_1": "市场/营销",
      request_id: {
        $oid: "5b3c7eac83bcf6472c341731"
      },
      _id: {
        $oid: "5b3c7eac83bcf6472c341732"
      }
    },
    para: {
      ext: {
        q1: {
          "2": "难道工作上出什么突发状况了？"
        },
        q2: {
          "2": "大概不是很想聊天吧"
        }
      },
      data: {
        city: "重庆",
        scale: "500-1000000",
        workLength: "8-30",
        degree: "本科",
        src: "img/rw/man/sc/5/sc_5_tc.png",
        gender: "男",
        secondClass: ["市场推广"],
        _id: {
          $oid: "5b3c7eac83bcf6472c341731"
        },
        constellation: "天秤座",
        jobType: "市场商务",
        add_time: {
          $date: 1530720044427
        }
      }
    },
    min: 11672.22323253273,
    max: 17628.633630935055,
    future: 18901,
    current: 15710,
    median: 14652.437688171809,
    summary: "小康",
    increase: 20,
    adjust: 1,
    request_id: "5b3c7eac83bcf6472c341731",
    id: "5b3c7eac83bcf6472c341731",
    buy_house_year: 3,
    alog_ver: 1.33,
    _id: {
      $oid: "5b3c7eac83bcf6472c341733"
    },
    city: "重庆",
    add_time: {
      $date: 1530720044935
    }
  },
  action = {}
) => {
  switch (action.type) {
    case GET_CALCSALARY:
    console.log(action.result)
      action.callBack &&
        action.callBack instanceof Function &&
        action.callBack(action.result);
      return action.result;
    // return state;
    default:
      return state;
  }
};

export default (
  state = [
    // {
    //   id: 1,
    //   companyName: "华为科技有限公司",
    //   averageSalary: "¥6272",
    //   percent: "3.4%"
    // },
    // {
    //   id: 2,
    //   companyName: "富士康科技有限公司",
    //   averageSalary: "¥7892",
    //   percent: "6.7%"
    // },
    // {
    //   id: 3,
    //   companyName: "中兴通讯",
    //   averageSalary: "¥6728",
    //   percent: "8.9%"
    // },
    // {
    //   id: 4,
    //   companyName: "中软国际",
    //   averageSalary: "¥5982",
    //   percent: "5.6%"
    // },
    // {
    //   id: 5,
    //   companyName: "华为科技有限公司",
    //   averageSalary: "¥6272",
    //   percent: "3.4%"
    // },
    // {
    //   id: 6,
    //   companyName: "富士康科技有限公司",
    //   averageSalary: "¥6272",
    //   percent: "3.4%"
    // }
  ],
  action = {}
) => {
  switch (action.type) {
    case "GET_MAJOR_COMPANY":
      return action.json;
    default:
      return state;
  }
};

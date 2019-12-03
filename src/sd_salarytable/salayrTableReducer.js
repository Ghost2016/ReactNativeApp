export default (
  state = [
    // {
    //   id: 1,
    //   rank: 1,
    //   salary: "¥6272",
    //   major: "建筑学"
    // },
    // {
    //   id: 2,
    //   rank: 2,
    //   salary: "¥6272",
    //   major: "建筑学"
    // },
    // {
    //   id: 3,
    //   rank: 3,
    //   salary: "¥6272",
    //   major: "建筑学"
    // },
    // {
    //   id: 4,
    //   rank: 4,
    //   salary: "¥6272",
    //   major: "建筑学"
    // },
    // {
    //   id: 5,
    //   rank: 5,
    //   salary: "¥6272",
    //   major: "建筑学"
    // },
    // {
    //   id: 6,
    //   rank: 6,
    //   salary: "¥6272",
    //   major: "建筑学"
    // }
  ],
  action = {}
) => {
  switch (action.type) {
    case "GET_MAJOR_SALARY_TABLE":
      return action.json;
    default:
      return state;
  }
};

const INIT_TOPICS = "INIT_TOPICS";

export default (
  state = {
    schoolName: "222",
    schoolLevel: "222",
    major: "222",
    job: "软件工程师",
    industry: "计算机"
  },
  action = {}
) => {
  switch (action.type) {
    case INIT_TOPICS:
      return Object.assign({}, state, {
        schoolName: "清华大学",
        schoolLevel: "本科",
        major: "软件工程"
      });
      // return state;
      break;
    default:
      return state;
  }
};

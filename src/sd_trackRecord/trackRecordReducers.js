import {
  educationModel,
  courseModel,
  schoolJobModel,
  practiceExpModel,
  awardExpModel,
  certificateModel,
  UserAccoutnModel
} from "../types";

export const userEducationList = (
  state: educationModel[] = [],
  action = {}
) => {
  switch (action.type) {
    case "GET_EDUCATION":
      return action.json.sort(c => c.is_default == false);
    case "ADD_EDUCATION":
      return [action.json].concat(state.map(c => {c.is_default = false;return c;}));
    case "UPDATE_EDUCATION":
      let reset = state.filter(c => c.id != action.json.id);
      reset.push(action.json);
      return reset;
    case "DELETE_EDUCATION":
      let resetD = state.filter(c => c.id != action.json.id);
      return resetD;
    default:
      return state;
  }
};

// export const userAccountList = (
//   state: UserAccoutnModel[] = [],
//   action = {}
// ) => {
//   switch (action.type) {
//     case "GET_ACCOUNT":
//       return action.json;
//     case "GET_ACCOUNT":
//       return [action.json].concat(state);
//     case "UPDATE_ACCOUNT":
//       let reset = state.filter(c => c.id != action.json.id);
//       reset.push(action.json);
//       return reset;
//     case "DELETE_ACCOUNT":
//       let resetD = state.filter(c => c.id != action.json.id);
//       return resetD;
//     default:
//       return state;
//   }
// };

export const userCourseList = (state: courseModel[] = [], action = {}) => {
  switch (action.type) {
    case "GET_USERCOURSELIST":
      return action.json;
    case "ADD_USERCOURSEITEM":
      return [action.json].concat(state);
    case "UPDATE_USERCOURSEITEM":
      let reset = state.filter(c => c.id != action.json.id);
      reset.push(action.json);
      return reset;
    case "DEL_USERCOURSEITEM":
      return state.filter(c => c.id != action.json.id);
    default:
      return state;
  }
};

export const userSchoolJobList = (
  state: schoolJobModel[] = [],
  action = {}
) => {
  switch (action.type) {
    case "GET_USERJOBLIST":
      return action.json;
    case "ADD_USERJOBITEM":
      return [action.json].concat(state);
    case "UPDATE_USERJOBITEM":
      let reset = state.filter(c => c.id != action.json.id);
      reset.push(action.json);
      return reset;
    case "DEL_USERJOBITEM":
      return state.filter(c => c.id != action.json.id);
    default:
      return state;
  }
};

export const userPracticeExpList = (
  state: practiceExpModel[] = [],
  action = {}
) => {
  switch (action.type) {
    case "GET_PRACTICEEXPLIST":
      return action.json;
    case "ADD_PRACTICEEXPITEM":
      return [action.json].concat(state);
    case "UPDATE_PRACTICEEXPITEM":
      let reset = state.filter(c => c.id != action.json.id);
      reset.push(action.json);
      return reset;
    case "DEL_PRACTICEEXPITEM":
      return state.filter(c => c.id != action.json.id);
    default:
      return state;
  }
};

export const userAwardExpList = (state: awardExpModel[] = [], action = {}) => {
  switch (action.type) {
    case "GET_AWARDEXPLIST":
      return action.json;
    case "ADD_AWARDEXPITEM":
      return [action.json].concat(state);
    case "UPDATE_AWARDEXPITEM":
      let reset = state.filter(c => c.id != action.json.id);
      reset.push(action.json);
      return reset;
    case "DEL_AWARDEXPITEM":
      return state.filter(c => c.id != action.json.id);
    default:
      return state;
  }
};

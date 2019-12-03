import { certificateModel } from "../types";
export const certificateList = (
  state: certificateModel[] = [],
  action = {}
) => {
  switch (action.type) {
    case "GET_CERTIFICATELIST":
      return action.json;
    case "ADD_CERTIFICATEITEM":
      if(state.findIndex(c => c.id == action.json.id) >= 0) {
        return state;
      }
      return [action.json].concat(state);
    case "UPDATE_CERTIFICATEITEM":
      let reset = state.filter(c => c.id != action.json.id);
      reset.push(action.json);
      return reset;
    case "DEL_CERTIFICATEITEM":
      return state.filter(c => c.id != action.json.id);
    default:
      return state;
  }
};

export const otherUserCertificateList = (
  state: certificateModel[] = [],
  action = {}
) => {
  switch (action.type) {
    case "GET_OTHERUUSERCERTIFICATELIST":
      return action.json;
    default:
      return state;
  }
};

// import {
//   LOGOUT,
//   LOGIN_SUCCESS,
//   ACCOUNT_SWITCH,
//   INIT_USERS,
//   REALM_INIT,
//   EVENT_USER_ADD,
//   EVENT_USER_REMOVE,
//   EVENT_USER_UPDATE
// } from "../actionConstants";
// import { NULL_ARRAY } from "../nullObjects";

// const initialState: UsersState = NULL_ARRAY;
import type { UserState } from "@src/types";
import { NULL_USERSTATE } from "@src/nullObjects";

const PREPAREUSERINFO = "PREPAREUSERINFO";

export default (state = {}, action = {}) => {
  //console.log("action===", action)
  switch (action.type) {
    case PREPAREUSERINFO:
      console.log("PREPAREUSERINFO", state, action.json);
      return Object.assign({}, state, action.json);
    default:
      return state;
  }
};

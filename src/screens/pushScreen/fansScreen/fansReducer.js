

import type { OtherUserState } from "@src/types";
import { NULL_OTHER_USER_STATE } from "@src/nullObjects";
import {
  ADD_FAN,
  DELETE_FAN,
  UPDATE_FANS,
  ADD_FANS
} from '../../../actionConstants';
import { parseUserList } from "@utils/user";

const initState = [];

const addFan = (state, action) => [...state, action.fan]
const deleteFan = (state, action) => {
  return [].concat(state.filter(() => {
    return state.id !== action.id
  }))
}
const updateFans = (state, action) => {
  // console.warn('updateFans', action.fans)
  return [].concat(parseUserList(action.fans, {
    withExtraInfo: false,
    withRankNumber: false,
    withFollow: true
  }))
}
const addFans = (state, action) => {
  // console.warn('updateFans', action.fans)
  return state.concat(parseUserList(action.fans, {
    withExtraInfo: false,
    withRankNumber: false,
    withFollow: true
  }))
}


// 需要socket推送过来
export default (state = initState, action={}) => {
  switch(action.type) {
    case ADD_FAN:
      return addFan(state, action);
    case DELETE_FAN:
      return deleteFan(state, action);
    case UPDATE_FANS:
      return updateFans(state, action);
    case ADD_FANS:
      return addFans(state, action);
    default:
      return state;
  }
}
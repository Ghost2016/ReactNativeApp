

import type { OtherUserState } from "@src/types";
import { NULL_OTHER_USER_STATE } from "@src/nullObjects";
import {
  ADD_WATCH,
  CANCEL_WATCH,
  UPDATE_WATCHES,
  ADD_WATCHES,
  UPDATE_RECOMMEND,
  UPDATE_WATCHES_ALL
} from '../../../actionConstants';
import { parseUserList } from "@utils/user";

const addWatch = (state, action) => [...state, {
  ...action.watch,
  withExtraInfo: false,
  withRankNumber: false,
  withCompare: false,
  follow:true,
  withFollow: true}]

const cancelWatch = (state, action) => {
  return [...state.filter((item) => {
    return item.id !== action.id
  })]
}

const updateWatches = (state, action) => {
  return [].concat(parseUserList(action.watches, {
    withExtraInfo: false,
    withRankNumber: false,
    withFollow: true
  }))
}
// 更新全部关注人
const _update_watches_all = (state, action) => {
  return [].concat(parseUserList(action.watches, {
    withExtraInfo: false,
    withRankNumber: false,
    withFollow: true
  }))
}

// 添加到关注列表
const _add_watches = (state, action) => {
  return state.concat(parseUserList(action.watches, {
    withExtraInfo: false,
    withRankNumber: false,
    withFollow: true
  }))
}


const updateRecommend = (state, action) => {
  return[].concat(parseUserList(action.recommend, {
    withExtraInfo: false,
    withRankNumber: false,
    withFollow: true,
    withCompare: false
  }))
}

const _handle_add_watch = (state, action) => {
  return [...state.map((item, index) => {
    if(item.id === action.id) {
      return {
        ...item,
        // 更新key以触发刷新
        key: 'watched' + item.key, 
        follow: true
      }
    }
    return item
  })]
}

const _handle_cancel_watch = (state, action) => {
  return [...state.map((item, index) => {
    if(item.id === action.id) {
      return {
        ...item,
        key: item.key.replace('watched', ''), 
        follow: false
      }
    }
    return item
  })]
}


export const watches = (state = [], action={}) => {
  switch(action.type) {
    case ADD_WATCH:
      return addWatch(state, action);
    case CANCEL_WATCH:
      return cancelWatch(state, action);
    case UPDATE_WATCHES:
      return updateWatches(state, action);
    case ADD_WATCHES:
      return _add_watches(state, action);
    default:
      return state;
  }
}

export const recommendUserArray = (state = [], action={}) => {
  switch(action.type) {
    case ADD_WATCH:
      return _handle_add_watch(state, action);
    case CANCEL_WATCH:
      return _handle_cancel_watch(state, action);
    case UPDATE_RECOMMEND:
      return updateRecommend(state, action);
    default:
      return state;
  }
}

// 所有关注人的列表
export const watches_all = (state = [], action={}) => {
  switch(action.type) {
    case ADD_WATCH:
      return addWatch(state, action);
    case CANCEL_WATCH:
      return cancelWatch(state, action);
    case UPDATE_WATCHES_ALL:
      return _update_watches_all(state, action);
    default:
      return state;
  }
}
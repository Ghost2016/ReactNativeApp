

import type { OtherUserState } from "@src/types";
import { NULL_OTHER_USER_STATE } from "@src/nullObjects";
import {
  ADD_WATCH,
  CANCEL_WATCH,
  // UPDATE_WATCHES,
  UPDATE_TOP,
  UPDATE_PEER,
  UPDATE_PROGRESS,
  UPDATE_DYNAMIC_COUNT,
  RESET_DYNAMIC_COUNT,
  UPDATE_RANK_WATCHES,
  ADD_RANK_WATCHES
} from '../../../actionConstants';
import { parseUserList } from "@utils/user";

const _update_tops = (state, action) => {
  // 为没有分数的选手添加一个空的分数
  let topUserArray = parseUserList(action.tops.map(item=> {
    return {...item, power:item.power || 0}
  }).sort((u1,u2) => u2.power - u1.power), {
    withExtraInfo: false,
    withRankNumber: true,
    withFollow: true
  })
  return topUserArray
}

const _update_peers = (state, action) => {
  // 不用进行排序
  // action.peers.sort((u1,u2) => {
  //   return u2.power - u1.power
  // })
  let peerUserArray = parseUserList(action.peers, {
    withExtraInfo: false,
    withRankNumber: true,
    withFollow: true
  });
  return peerUserArray
}

const _update_progress = (state, action) => {
  let progressUserArray = parseUserList(action.progress, {
    withExtraInfo: true,
    withRankNumber: true,
    withFollow: true
  });
  return progressUserArray
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

const _updata_dynamic_count = (state, action) => {
  return {count: action.dynamicCount}
}

const _reset_dynamic_count = (state, action) => {
  return {count: 0}
}
// 更新关注榜单
const _update_rank_watches = (state, action) => {
  return [].concat(parseUserList(action.watches, {
    withExtraInfo: false,
    withRankNumber: true,
    withFollow: false,
    withCompare: true
  }))
}
// 添加关注榜单
const _add_rank_watches = (state, action) => {
  return state.concat(parseUserList(action.watches, {
    withExtraInfo: false,
    withRankNumber: true,
    withFollow: false,
    withCompare: true
  })).map((item, index) => {
    item.rank = index + 1
    return item
  })
}
// top榜单用户列表
export const topUserArray = (
  state = [],
  action = {}
) => {
  switch (action.type) {
    case UPDATE_TOP:
      return _update_tops(state, action)
    case ADD_WATCH:
      return _handle_add_watch(state, action)
    case CANCEL_WATCH:
      return _handle_cancel_watch(state, action)
    default:
      return state;
  }
};

// 同侪榜单用户列表
export const peerUserArray = (
  state = [],
  action = {}
) => {
  switch (action.type) {
    case UPDATE_PEER:
      return _update_peers(state, action)
    case ADD_WATCH:
      return _handle_add_watch(state, action)
    case CANCEL_WATCH:
      return _handle_cancel_watch(state, action)
    default:
      return state;
  }
};

// 进步榜单用户列表
export const progressUserArray = (
  state = [],
  action = {}
) => {
  switch (action.type) {
    case UPDATE_PROGRESS:
      return _update_progress(state, action)
    case ADD_WATCH:
      return _handle_add_watch(state, action)
    case CANCEL_WATCH:
      return _handle_cancel_watch(state, action)
    default:
      return state;
  }
};

// 关注榜单用户列表
export const rankWatchUserArray = (
  state = [],
  action = {}
) => {
  switch (action.type) {
    case UPDATE_RANK_WATCHES:
      return _update_rank_watches(state, action)
    case ADD_RANK_WATCHES:
      return _add_rank_watches(state, action);
    // case ADD_WATCH:
    //   return _handle_add_watch(state, action)
    // case CANCEL_WATCH:
    //   return _handle_cancel_watch(state, action)
    default:
      return state;
  }
};

// 动态个数
export const dynamic = (
  state = {count: 0},
  action = {}
) => {
  switch (action.type) {
    case UPDATE_DYNAMIC_COUNT:
      return _updata_dynamic_count(state, action)
    case RESET_DYNAMIC_COUNT:
      return _reset_dynamic_count(state, action)
    default:
      return state;
  }
};
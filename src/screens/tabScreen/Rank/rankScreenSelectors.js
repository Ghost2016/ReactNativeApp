/* @flow */
import { createSelector } from "reselect";

import { getRankWatchUserArray, getUserId, getPeerUserArray  } from "../../../directSelectors";
import { getUserAllInfo } from "@src/users/usersSelector";
import { parseUserList, formatPower } from "@utils/user";

export const getWatchesAndMyOwnInfo = createSelector(
  getRankWatchUserArray,
  getUserAllInfo,
  (watches, user) => {
    // console.warn(user)
    let userArray = [].concat(watches.map((item) => {
      return {
        ...item,
        withExtraInfo: false,
        withRankNumber: true,
        withFollow: false,
        withCompare: true
      }
    }))
    userArray.push({
      key: user.id + '',
      id: user.id,
      rank: 0,
      fullName: user.name,
      score: formatPower(user.power),
      college: user.school_name || "",
      major: user.major_name || "",
      avatarUrl:
        user.avatar && user.avatar.url || '',
      is_verified: user.is_verified,
      sex: user.gender === "female" ? 0 : 1,
      withExtraInfo: false,
      withRankNumber: true,
      withFollow: false,
      withCompare: true
    });
    // 重新再排序
    userArray.sort((user1, user2) => {
      return user2.score - user1.score;
    });
    // 重新添加排名顺序
    userArray.map((item, index) => {
      item.rank = index + 1;
      return item;
    });
    // console.log('ly88', 'userArray',userArray )
    return userArray;
  }
);

export const getRankedPeerUserArray = createSelector(
  getPeerUserArray,
  getUserId,
  (array, id) => {
    if(array.length === 0) {
      return array
    }
    let results = []
    const me = array.filter(item => item.id == id)[0]
    const me_rank = me ? me.ranking : 0;
    const me_index = me ? me.index : 0; ;
    if(me_rank > 10) {
      return results = array.map((item, index) => {
        return {
          ...item,
          rank: me_rank - 10 + index
        }
      })
    } else {
      return array
    }
  }
)
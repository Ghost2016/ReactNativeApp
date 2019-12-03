/**
 * 映射后台用户数据到本地
 * @param {*} users 后台用户数据
 * @param {*} extra 额外信息 配置是否显示其他的小的部件
 */
export const parseUserList = (users, extra) => {
  let fotmattedList = users.map((item, index) => {
    // related 取值 (watched_fans|watched|fans)
    const related = item.watch_info.related;
    // "progress": {"number": 22, "percent": "20%"}
    return {
      index: index,
      // 把关注信息添加到Key，以确保在关注信息更改后会进行更新
      key: related + item.id + '',
      id: item.id,
      rank: item.rank === 0 ? index + 1 : item.rank,
      fullName: item.nickname,
      score: formatPower(item.power),
      // score: isNaN(item.power)? 0 : (parseInt(item.power*100,10)/100),
      college: item.edu_info.school_name || "",
      degree: item.edu_info.degree_name ? `${item.edu_info.degree_name}·` : "",
      major: item.edu_info.major_name || "",
      avatarUrl: item.avatar && item.avatar.url || '',
      // 是否已验证
      certified: item.is_verified || false,
      sex: item.gender === "female" ? 0 : 1,
      follow: related.indexOf("watched") > -1,
      beFollowed: related.indexOf("fans") > -1,
      // 进步分数
      progressScore: item.progress && item.progress.number || 0,
      // 进步比例
      progressPercent: item.progress && item.progress.percent || '0%',
      // 同侪榜用
      ranking: item.ranking || '',
      // withExtraInfo: false,
      // withRankNumber: false,
      // compare: -1,
      // searchWords: text,
      ...extra
    };
  });
  return fotmattedList;
};

export const formatPower = (power) => {
  if(isNaN(power)){
    return '0.00'
  } else{
    return (parseInt(power * 100, 10) / 100).toFixed(2)
    //或者用字符串截断
  }
};
// format成绩，pk一下使用
export const formatScore = (score) => {
  if(isNaN(score)){
    return '0.00'
  } else{
    return (parseInt(score * 100, 10) / 100).toFixed(2)
    //或者用字符串截断
  }
};
/**
 * 关注的人相关的动态
 * @param {*} users 后台用户数据
 * @param {*} extra 额外信息 配置是否显示其他的小的部件
 */
export const parseNewsOfWatches = (items) => {
  return items.map((item, index) => {
    let tempNew : NewsOfWatches = {
      key: item.id + '',
      // id
      id: item.id,
      userId: item.user_info.id || 0,
      // 全称
      fullName: item.user_info.nickname,
      // 头像url
      avatarUrl: item.user_info.avatar_url || "",
      date: item.created_time,
      // 0 女，1 男
      sex: item.user_info.gender === "female" ? 0 : 1,
      contentText: item.content || "",
      images: item.images,
      location: item.location || ""
    };
    return tempNew;
  });
}

import { createSelector } from "reselect";
import {
  getUserId,
  getUserToken,
  getUserName,
  getUserGender,
  getUserIsVerified,
  getUserCity,
  getUserPhone,
  getUserTotal,
  getUserAvatar,
  getUserPower,
  getUserSalary,
  getUserUpPower,
  getUserUpSalary,
  getUserIsBindWechat,
  getUserWechatInfo,
  getUserImSig
} from "../directSelectors";
import { formatPower } from "@utils/user"

// 获取主页所属学校归属信息
export const getUserBaseInfo = createSelector(
  [
    getUserId,
    getUserToken,
    getUserName,
    getUserGender,
    getUserIsVerified,
    getUserCity,
    getUserPhone,
    getUserTotal,
    getUserAvatar,
    getUserIsBindWechat,
    getUserWechatInfo,
    getUserImSig
  ],
  (
    userId,
    userToken,
    userName,
    userGender,
    isVerified,
    userCity,
    userPhone,
    userTotal,
    userAvatar,
    isBindWechat,
    wechatInfo,
    imgSig
  ) => {
    return {
      id: userId,
      token: userToken || "",
      name: userName || "",
      gender: userGender || "male",
      isBindWechat: isBindWechat,
      isVerified: typeof isVerified !== "undefined" ? isVerified : false,
      city: userCity || {
        id: 0,
        title: "",
        province: {
          id: 0,
          title: "",
          alias: ""
        }
      },
      sig: imgSig,
      phone: userPhone,
      avatar: userAvatar,
      total: userTotal,
      wechatInfo: wechatInfo,
      ...userTotal
    };
  }
);

export const getUserAllInfo = createSelector(
  [getUserBaseInfo,
    getUserPower,
    getUserSalary,
    getUserUpPower,
    getUserUpSalary, ],
  (userBaseInfo, power, salary, up_power, up_salary) => {
    return {
      ...userBaseInfo,
      power: formatPower(power),
      salary: parseInt(salary, 10),
      up_power: up_power,
      up_salary : up_salary,
    };
  }
);

export const getUserPowerSalary = createSelector(
  [
    getUserPower,
    getUserSalary,
    getUserUpPower,
    getUserUpSalary, ],
  (power, salary, up_power, up_salary) => {
    return {
      power: formatPower(power),
      salary: parseInt(salary, 10),
      up_power: up_power,
      up_salary : up_salary,
    };
  }
);

export const getUserTaskCount = createSelector(
  [ getUserTotal ],
  (userTotal) => {
    return {
      total: userTotal,
    };
  }
);
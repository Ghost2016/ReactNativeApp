import config from "../config";
import { apiFetchOther, apiFetch } from "./apiFetch";
import store from "../boot/store";

export const getWeChatToken = async (params: object, callBack: () => {}) => {
  const { code } = params;
  return apiFetchOther(
    `https://api.weixin.qq.com/sns/oauth2/access_token?grant_type=authorization_code&appid=${
      config.wxAppId
    }&secret=${config.wxSecret}&code=${code}`,
    callBack,
    {},
    "GET"
  );
};

export const getWeChatUserInfo = async (params: object, callBack: () => {}) => {
  const { access_token, openid } = store.getState().wechatToken;
  return apiFetchOther(
    `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`,
    callBack,
    {},
    "GET"
  );
};

export const postWeChatCode = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/social/auth/`, callBack, params, "POST");
};

export const bindWeChat = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/social/bind_wechat/`, callBack, params, "POST");
};

export const unbindWeChat = async (params: object, callBack: () => {}) => {
  return apiFetch(`/v1/social/unbind_wechat/`, callBack, params, "POST");
};


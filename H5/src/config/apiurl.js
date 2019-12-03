
import * as HOSTS from './host';

let Api = {};
console.error = string => {};

//发布 118.24.57.60

// Api地址配置
Api.ReleaseIP = HOSTS.BEAT;
Api.PrefixPath = "/api/sd/v1";
Api.ApiPrefix = Api.ReleaseIP + Api.PrefixPath;

// 新闻接口
Api.News = {};
Api.News.getNewsDetail = id => Api.ApiPrefix + `/news/${id}/get_new/`;
Api.News.register = () => Api.ApiPrefix + `/auth/signup/`;
Api.News.code = () => Api.ApiPrefix + `/verify/get_verify_code/`;
Api.News.salary = (params) => `${HOSTS.SXZ}/salary_predict_pro?p=${JSON.stringify(params)}`;
Api.News.wxAuth = (params) => `${Api.ReleaseIP}/api/sd/v1/social/web_create_token/`;
Api.News.wxJsSignature = (url) => `${Api.ReleaseIP}/api/sd/v1/social/web_get_sign/?url=${encodeURIComponent(url)}`;

// 发布地址
module.exports = Api;

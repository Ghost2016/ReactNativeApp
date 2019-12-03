import config from "./config";

// const PRODUCTION = process.env.NODE_ENV === "development";
const PRODUCTION = !config.isDev;

// 跳转到商店url
export const AndroidWebsite = 'http://android.myapp.com/myapp/detail.htm?apkName=com.shandudata.zhimekaimen'; //`${HOSTS.APPSHARE}/qEkh`,
export const IosWebsite = 'https://itunes.apple.com/cn/app/%E8%81%8C%E4%B9%88%E5%BC%80%E9%97%A8-%E5%A4%A7%E5%AD%A6%E7%94%9F%E7%9A%84%E8%81%8C%E4%B8%9A%E8%A7%84%E5%88%92%E5%B8%88/id1434294728?mt=8'; //`${HOSTS.APPSHARE}/b8y3`,

//web后端
const HOST_BEAT = 'https://server.zhimekaimen.com'
const HOST_BEAT_TEST = 'https://server-beat.zhimekaimen.com'
export const BEAT = PRODUCTION ? HOST_BEAT : HOST_BEAT_TEST;

//bi后端
const HOST_BI = 'https://bi-api.zhimekaimen.com'
const HOST_BI_TEST = 'https://bi-api-beat.zhimekaimen.com'
export const BI = PRODUCTION ? HOST_BI : HOST_BI_TEST;

//web端
const HOST_WWW = 'https://www.zhimekaimen.com'
const HOST_WWW_TEST = 'https://www-beat.zhimekaimen.com'
export const WWW = PRODUCTION ? HOST_WWW : HOST_WWW_TEST;

//导师端web
const HOST_MASTER = 'https://master.zhimekaimen.com'
const HOST_MASTER_TEST = 'https://master-beat.zhimekaimen.com'
export const MASTER = PRODUCTION ? HOST_MASTER : HOST_MASTER_TEST;

//APP分享/算薪资
const HOST_SHARE = 'https://share.zhimekaimen.com'
const HOST_SHARE_TEST = 'https://share-beat.zhimekaimen.com'
//const HOST_SHARE_TEST = 'http//192.168.0.30:1616';
export const SHARE = PRODUCTION ? HOST_SHARE : HOST_SHARE_TEST;

//CDN
const HOST_CDN = 'https://cdn.zhimekaimen.com'
const HOST_CDN_TEST = 'https://cdn.zhimekaimen.com'
export const CDN = PRODUCTION ? HOST_CDN : HOST_CDN_TEST;

//sentry
const HOST_SENTRY = 'https://sentry.zhimekaimen.com'
const HOST_SENTRY_TEST = 'https://sentry.zhimekaimen.com'
export const SENTRY = PRODUCTION ? HOST_SENTRY : HOST_SENTRY_TEST;

//sentry key
const HOST_SENTRYKEY = 'https://067b94c8e88246d3adf0bcbb60f2e0e0@sentry.zhimekaimen.com/4'
const HOST_SENTRYKEY_TEST = 'https://067b94c8e88246d3adf0bcbb60f2e0e0@sentry.zhimekaimen.com/4'
export const SENTRYKEY = PRODUCTION ? HOST_SENTRYKEY : HOST_SENTRYKEY_TEST;

//蒲公英分享平台
const HOST_APPSHARE = 'https://www.pgyer.com'
const HOST_APPSHARE_TEST = 'https://www.pgyer.com'
export const APPSHARE = PRODUCTION ? HOST_APPSHARE : HOST_APPSHARE_TEST;

//七牛上传
const HOST_UPLOAD = 'http://up-z1.qiniup.com'
const HOST_UPLOAD_TEST = 'http://up-z1.qiniup.com'
export const UPLOAD = PRODUCTION ? HOST_UPLOAD : HOST_UPLOAD_TEST;

//算薪资
const HOST_SXZ = 'https://sxz.zhimekaimen.com'
const HOST_SXZ_TEST = 'https://sxz-beat.zhimekaimen.com'
export const SXZ = PRODUCTION ? HOST_SXZ : HOST_SXZ_TEST;

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
export const SHARE = PRODUCTION ? HOST_SHARE : HOST_SHARE_TEST;

//CDN
const HOST_CDN = "http://pfumm741p.bkt.clouddn.com";// 'https://cdn.zhimekaimen.com'
const HOST_CDN_TEST = "http://pbbojsqii.bkt.clouddn.com";// 'https://cdn.zhimekaimen.com'
export const CDN = PRODUCTION ? HOST_CDN : HOST_CDN_TEST;

//sentry
const HOST_SENTRY = 'https://sentry.zhimekaimen.com'
const HOST_SENTRY_TEST = 'https://sentry.zhimekaimen.com'
export const SENTRY = PRODUCTION ? HOST_SENTRY : HOST_SENTRY_TEST;

//sentry key https://cdn.ravenjs.com/3.26.2/raven.min.js
const HOST_SENTRYKEY = 'https://aef3b95a1e8d4e6c96ca603bb8669c1b@sentry.zhimekaimen.com/6'
const HOST_SENTRYKEY_TEST = 'https://aef3b95a1e8d4e6c96ca603bb8669c1b@sentry.zhimekaimen.com/6'
export const SENTRYKEY = PRODUCTION ? HOST_SENTRYKEY : HOST_SENTRYKEY_TEST;

//蒲公英分享平台
const HOST_APPSHARE = 'https://www.pgyer.com'
const HOST_APPSHARE_TEST = 'https://www.pgyer.com'
export const APPSHARE = PRODUCTION ? HOST_APPSHARE : HOST_APPSHARE_TEST;

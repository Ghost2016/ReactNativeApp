import * as HOSTS from "@src/host";

const isDebug = false;
const localhost = "http://localhost";
//const localhost = 'http://192.168.103.71'
// const remoteHost = "http://222.211.90.70"
const isForSingleTest = false;
const remoteHost = isForSingleTest ? "http://127.0.0.1" : HOSTS.BEAT
const ApiConfig = {
  isDebug: isDebug,
  host: isDebug ? localhost : remoteHost,
  // port: isDebug ? 3000 : 80, //80, //9999,
  prefix: isDebug ? "api.sd" : "api/sd",

  biPort: isDebug ? 3000 : 443, //8845,
  // biPort: 8888,
  biPrefix: isDebug ? "api.sd" : "",
  biHost: HOSTS.BI,
  // biHost: "http://222.211.90.66",
  newAapiHost: isForSingleTest ? "http://127.0.0.1" : HOSTS.BEAT,
  port: isForSingleTest ? "8000" : '443',
  shareHost: isForSingleTest ? "http://127.0.0.1" : HOSTS.BEAT,
};
export default ApiConfig;
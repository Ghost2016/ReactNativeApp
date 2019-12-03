/* @flow */
import { NULL_USERSTATE } from "@src/nullObjects";

export function prepareUserInfo(result, opt = {}) {
  return Object.assign({}, { type: "PREPAREUSERINFO", json: result }, opt);
}

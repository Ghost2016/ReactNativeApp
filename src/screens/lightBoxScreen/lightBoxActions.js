/* @flow */
//import { NULL_USERSTATE } from "@src/nullObjects";

export function currentLightBoxName(name, opt = {}) {
  return Object.assign(
    {},
    { type: "CURRENTLIGHTBOXNAME", json: { name: name } },
    opt
  );
}

export function removeLightBoxName(name, opt = {}) {
  return Object.assign(
    {},
    { type: "REMOVELIGHTBOXNAME", json: { name: name } },
    opt
  );
}

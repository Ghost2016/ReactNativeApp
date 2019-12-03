import { NULL_LIGHTBOX } from "@src/nullObjects";
import type { LightBoxState } from "@src/types";

const CURRENTLIGHTBOXNAME = "CURRENTLIGHTBOXNAME";
const REMOVELIGHTBOXNAME = "REMOVELIGHTBOXNAME";

const lightBox = (state: LightBoxState = NULL_LIGHTBOX, action = {}) => {
  switch (action.type) {
    case CURRENTLIGHTBOXNAME:
      return Object.assign({}, state, action.json);
    case REMOVELIGHTBOXNAME:
      return Object.assign({}, state, action.json);
    default:
      return state;
  }
};
export default lightBox;

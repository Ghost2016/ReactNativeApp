/* @flow */
const packageConfig = require("../package.json");
import { Sentry } from "react-native-sentry";
import config from "./config";

// debugger;
if (config.enableSentry) {
  Sentry.config(config.sentryKey, {
    deactivateStacktraceMerging: false,
    ignoreErrors: ["Network request failed"]
  }).install();

  Sentry.setVersion(packageConfig.appVersion);
}

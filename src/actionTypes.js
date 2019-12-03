import { APP_ONLINE } from "./actionConstants";

export type AppOnlineAction = {
  type: APP_ONLINE,
  isOnline: boolean
};

export type AppOnlineActionCreator = (
  isOnline: boolean
) => AsyncActionCreator<AppOnlineAction>;

export type Actions = {
  appState: AppOnlineActionCreator
};

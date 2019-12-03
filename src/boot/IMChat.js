import { NativeModules, NativeEventEmitter, Platform } from "react-native";
import * as WeChat from "react-native-wechat";
const { IMChatModule, AliPayModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(IMChatModule);
import Sound from '../boot/Sound';
// Enable playback in silence mode
Sound.setCategory('Playback');

export default {
  init: (appId, accountType) => IMChatModule.initIm(appId, accountType),
  login: (id, sig) => IMChatModule.loginIm(id, sig), // Promise
  isLogin: () => IMChatModule.isLogin(),            // Promise
  aliPay: (orderInfo) => AliPayModule.pay(orderInfo),
  wxPay: (data) => WeChat.pay(data),
  on: (eventName, callback) => {
    // soundSeek soundCompleted
    if (eventName == "message") {
      IMChatModule.on("message");
    } else if (eventName == "groupEventMessage") {
      IMChatModule.on("groupEventMessage");
    }
    eventEmitter.addListener(eventName, callback);
  },
  // params {nickName, faceUrl, gender, self, customInfo}
  setUserProfile: params => {
    // if (Platform.OS == "android" && params.customInfo) {
    // params.customInfo = JSON.stringify(params.customInfo);
    // }
    return IMChatModule.setUserProfile(params);
  }, // Promise

  getGroupMessage: (groupId, count, topLast, isReset = true) => IMChatModule.getGroupMessage(groupId, count, topLast, isReset),

  // 发送消息
  sendCTCTextMessage: (text, to) => IMChatModule.sendCTCTextMessage(text, to), // Promise
  sendCTCImageMessage: (path, to) => IMChatModule.sendCTCImageMessage(path, to), // Promise
  sendCTCSoundMessage: (path, to) => IMChatModule.sendCTCSoundMessage(path, to), // Promise
  sendGroupTextMessage: (text, to) =>
    IMChatModule.sendGroupTextMessage(text, to), // Promise
  sendGroupImageMessage: (path, to) =>
    IMChatModule.sendGroupImageMessage(path, to), // Promise
  sendGroupSoundMessage: (path, to) =>
    IMChatModule.sendGroupSoundMessage(path, to), // Promise

  // 群组管理
  joinGroup: (groupId, reason) => IMChatModule.joinGroup(groupId, reason), // Promise
  exitGroup: groupId => IMChatModule.exitGroup(groupId), // Promise
  getOwnGroup: () => IMChatModule.getOwnGroup(), // Promise
  getGroupUsers: (groupId) => IMChatModule.getGroupUsers(groupId), // Promise
  getGroupStatus: (groupId) => IMChatModule.getGroupStatus(groupId),  // Promise
  getGroupSelfInfo: (groupId) => IMChatModule.getGroupSelfInfo(groupId), // Promise

  // params {groupId: 群id, groupName: 群名称, groupIntroduction: 群简介, groupNotification: 群公告, groupFaceUrl: 群头像}
  // customInfo: 自定义信息, addOption: 加群设置
  createChatRoom: params => {
    // if (Platform.OS == "android" && params.customInfo) {
      params.customInfo = JSON.stringify(params.customInfo);
    // }
    return IMChatModule.createChatRoom(params);
  }, // Promise
  // params {userList: ["", ...], groupId: ""}
  inviteGroupMember: params => IMChatModule.inviteGroupMember(params), // Promise

  // 声音
  play: (url, callback) => {
    this.whoosh = new Sound(url, undefined, (error) => {
      if (error) {
        // console.log('failed to load the sound', error);
        return;
      }
      if(this.whoosh && this.whoosh.play) { 
        this.whoosh.play((success) => {
          if (success) {
            // console.log('successfully finished playing');
            // this.whoosh.reset();
          } else {
            // console.log('playback failed due to audio decoding errors');
            // reset the player to its uninitialized state (android only)
            // this is the only option to recover after an error occured and use the player again
            this.whoosh.reset();
            this.whoosh.release();
            this.whoosh = null;
          }
        });
      }
      
      callback && callback();
      // loaded successfully
      // console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
    });
  },
  pause: () => {
    if(this.whoosh) {
      this.whoosh.pause();
    }
  },
  stop: () => {
    if(this.whoosh) {
      this.whoosh.stop(() => {
        // Note: If you want to play a sound after stopping and rewinding it,
        // it is important to call play() in a callback.
        // this.whoosh.play();
      });
    }
  },
  seekTo: (sec) => {
    if(this.whoosh) {
      this.whoosh.setCurrentTime(sec);
    }
  },
  release: () => {
    if(this.whoosh) { 
      this.whoosh.release();
    }
  },
  _whoosh: null,
};

/* @flow */
import React, { PureComponent } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
// import { Icon } from 'antd-mobile';
// import Icon from 'react-native-vector-icons/Ionicons';

// import type { Presence } from '../types';
// import connectWithActions from '../connectWithActions';
// import { nullFunction } from '../nullObjects';
// import { getCurrentRealm } from '../selectors';
import ImageAvatar from "./ImageAvatar";
import TextAvatar from "./TextAvatar";
// import { getFullUrl } from '../utils/url';
// import { getGravatarFromEmail } from '../utils/avatar';
// import UserStatusIndicator from '../common/UserStatusIndicator';
import * as sdStyles from "@src/styles";

const componentStyles = StyleSheet.create({
  status: {
    bottom: 0,
    right: 0,
    position: "absolute"
  }
});

type Props = {
  avatarUrl: string,
  name: string,
  size: number,
  shape: "square" | "rounded" | "circle",
  certified: boolean,
  onPress?: () => void
};

class Avatar extends PureComponent<Props> {
  props: Props;

  static defaultProps = {
    styles: {},
    avatarUrl: "",
    name: "",
    size: 80,
    shape: "circle",
    certified: false,
    // 1为男 0为女
    sex: 1
    // onPress: () => {}
  };

  render() {
    const {
      sex,
      avatarUrl,
      email,
      name,
      size,
      onPress,
      realm,
      shape,
      certified,
      styles
    } = this.props;
    // const fullAvatarUrl = avatarUrl ? getFullUrl(avatarUrl, realm) : getGravatarFromEmail(email);
    // const fullAvatarUrl = require('@img/person-icon-01.jpg');
    const fullAvatarUrl = avatarUrl;
    // const AvatarComponent = fullAvatarUrl ? ImageAvatar : TextAvatar;
    const AvatarComponent = ImageAvatar;

    return (
      <View>
        <AvatarComponent
          sex={sex}
          name={name}
          avatarUrl={fullAvatarUrl}
          size={size}
          onPress={onPress}
          shape={shape}
          styles={styles}
        >
        </AvatarComponent>
        {certified && (
            <View style={{ position: "absolute", right: '2%', bottom: '2%' }}>
              <Image
                source={require("@img/rank/rank_ico_Authentication.png")}
                // name="checkbox-on"
              />
            </View>
          )}
      </View>
    );
  }
}
export default Avatar;
// export default connectWithActions(state => ({
//   realm: getCurrentRealm(state),
// }))(Avatar);

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../connectWithActions";
import { CSS } from "../../common/SDCSS";
import TitleWrap from "../../sd_employmentinfo/titlelistwarp/TitleWrap";
import LineTitle from "../LineTitle";
import CertificateList from "../../sd_certificateList/CertificateList";
import { getUserBaseInfo } from "../../users/usersSelector";
import { navScreen } from "../../styles";
import RowSplitLine from "../../common/RowSplitLine";
import {
  userBaseInfoModel,
  certificateModel,
  otherUserInfoModel
} from "../../types";
import SDCertificateItem from "../../common/SDCertificateItem";
import MyOwnCerfiticate from "./MyOwnCerfiticate";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    marginBottom: CSS.pixel(30, true),
    marginTop: CSS.pixel(30),
    borderRadius: CSS.pixel(10)
  }
});

type Props = {
  userBaseInfo: userBaseInfoModel,
  otherUserInfo: otherUserInfoModel,
  certificateData: certificateModel[],
  otherUserCertificateData: certificateModel[]
};

// 我的主页 所获证书
class OwnCerfiticate extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    otherId: PropTypes.number.isRequired
  };
  componentDidMount() {
    if (this.context.otherId === 0) {
      this.props.actions.getUserCertificateAction({
        id: this.props.userBaseInfo.id
      });
    } else {
      this.props.actions.getOtherUserCertificateAction({
        id: this.context.otherId
      });
    }
  }
  render() {
    let data =
      this.context.otherId === 0
        ? this.props.certificateData
        : this.props.otherUserCertificateData;
    data = data.filter(c => c.audit_status == 'audit_pass');
    return (
      <View
        style={{
          paddingHorizontal: CSS.pixel(30)
        }}
      >
        <View style={[styles.container]}>
          <TitleWrap
            leftIcon={() => (
              <Image source={require("@img/my/rank_ico_certificate.png")} />
            )}
            title="所获证书"
            direction=">"
            otherInfo={`查看全部(${data.length})`}
            onPress={() => {
              if (data.length > 0) {
                this.context.navigator.push(navScreen("PushScreen", "所获证书", {
                  passProps: {
                    screen: () => <MyOwnCerfiticate data={data} userId={this.context.otherId === 0 ? this.props.userBaseInfo.id: this.context.otherId}/>,
                    backgroundColor: '#f3f3f3',
                    fullScreen: true,
                    noScrollView: true,
                    header: {
                      title: "所获证书"
                    }
                  }
                }));
              }
              
            }}
          />

          <View
            // style={{ paddingLeft: CSS.pixel(30), paddingRight: CSS.pixel(30) }}
          >
            {data.length > 0 ? (
              data.slice(0, 2).map(item => {
                return (
                  // <CertificateList
                  <SDCertificateItem
                    key={item.id + ""}
                    score={item.score}
                    title={item.certificate.name}
                    time={item.acquire_date.replace(/-/g, ".")}
                  />
                );
              })
            ) : (
              <RowSplitLine content="暂无证书" />
            )}
          </View>
        </View>
      </View>
    );
  }
}
export default ConnectWithActions((state, props) => ({
  userBaseInfo: getUserBaseInfo(state),
  otherUserInfo: state.otherUserInfo,
  certificateData: state.certificateList,
  otherUserCertificateData: state.otherUserCertificateList
}))(OwnCerfiticate);

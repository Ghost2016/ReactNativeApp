import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
  View,
  Alert,
  ImageBackground,
  Image,
  StatusBar
} from "react-native";
import * as sdStyles from "@src/styles";
import PropTypes from "prop-types";
import { Avatar, Touchable } from "../../../sd_components";
import SDHeader from "../../../common/SDHeader";
import { CSS } from "../../../common/SDCSS";
import ConnectWithActions from "../../../connectWithActions";
import { formatPower, formatScore } from "@src/utils/user";
import { getPKData } from "../../../api";
import SDLoading from "@sd_components/SDLoading";
import { getUserAllInfo } from "../../../users/usersSelector";
import { isIphoneX } from "../../../utils/iphonex";

const styles = {
  container: {
    backgroundColor: sdStyles.SDBGColorMain,
    flex:1
  },
  header:{
    backgroundColor: "transparent",
    zIndex: 9999,
    height: CSS.pixel(132, true)
  },
  headerText: {
    color: '#fff',
    fontWeight: sdStyles.SDFontMedium
  },
  topUserInfoContainer: {
    flexDirection: "row",
    margin: CSS.pixel(30),
    marginTop: CSS.pixel(40, true),
    marginBottom: CSS.pixel(30, true),
    justifyContent: "space-between"
  },
  avatar: {
    borderColor: '#fff',
    borderWidth: CSS.pixel(7),
    borderRadius: CSS.pixel(80),
    position: "relative",
    width: CSS.pixel(140),
    height: CSS.pixel(140),
    backgroundColor: '#fff'
  },
  topTextContainer: {
    paddingLeft: CSS.pixel(18),
    justifyContent: "center",
    alignItems: "flex-start"
  },
  topText: {
    color: "#fff",
    fontSize: CSS.textSize(30),
    fontWeight: sdStyles.SDFontBold
  },
  topNumber: {
    color: "#fff",
    fontSize: CSS.textSize(50),
    fontFamily: 'DINCondensedC'
  },
  topNumberUnit: {
    color: "#fff",
    fontSize: CSS.textSize(24),
    fontWeight: sdStyles.SDFontMedium
  },
  middleTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    opacity: 0.9,
    borderRadius: sdStyles.SD_DOUBLE_SPACING,
    margin: CSS.pixel(100),
    marginTop: 0,
    marginBottom: CSS.pixel(130, true)
  },
  middleText:{
    paddingVertical:CSS.pixel(16, true),
    fontSize: CSS.textSize(24),
    fontWeight: sdStyles.SDFontMedium
  },
  bottomContainer: {
    maxHeight: CSS.pixel(680),
    overflow:'scroll',
    position:'relative',
    margin: CSS.pixel(30),
    marginTop: -CSS.pixel(80),
    padding: CSS.pixel(40),
    paddingTop: CSS.pixel(46),
    paddingBottom: CSS.pixel(0),
  },
  bottomBackGroundImage:{
    position:'absolute',
    width: CSS.pixel(690),
    height: CSS.pixel(680),
  },
  bottomFirstLine:{
    flexDirection: "row",
    paddingBottom: CSS.pixel(40)
  },
  educationContainer: {
    alignItems: 'center',
    justifyContent:'flex-start',
    paddingHorizontal:14
  },
  collegeText: {
    fontSize: CSS.textSize(24),
    fontWeight: sdStyles.SDFontBold,
    paddingBottom: CSS.pixel(4, true)
  },
  degreeText: {
    fontSize: CSS.textSize(20),
    color: sdStyles.SDFontColorMinor
  },
  flex1: {
    flex: 1,
    borderWidth: 0,
    borderColor: '#f00',
    maxWidth: CSS.pixel(116),
  },
  flex2: {
    flex: 2
  },
  flex3: {
    flex: 3
  },
  tableItem: {
    paddingTop: CSS.pixel(70),
    paddingBottom: 0,
    flexDirection: "row",
    padding: CSS.pixel(22)
  },
  tableItemHeader: {
    fontSize: CSS.textSize(20),
    color: sdStyles.SDFontColorSubtitle,
    textAlign: "center"
  },
  tableItemContentTextNormal: {
    color: sdStyles.SDFontColorMinor,
    fontSize: CSS.textSize(24)
  },
  tableItemContentTextSpecial: {
    color: sdStyles.SDMainColor,
    fontSize: CSS.textSize(24)
  },
  tableItemContentTextSpecial2: {
    color: sdStyles.SDFontColorMain,
    fontSize: CSS.textSize(24)
  }
};


// 证书项目
class CertificateItem extends React.Component {
  static defaultProps = {
    headerName: "CET6",
    otherPassed: false,
    IPassed: false,
    showText: false,
    // 是否是阅读书单
    isRead: false,
    otherNum: 0,
    myNum: 0,
    isFetching: false
  };

  render() {
    const {
      headerName,
      otherPassed,
      IPassed,
      showText,
      isRead,
      otherNum,
      myNum,
      style,
      isTech
    } = this.props;
    const rank_ico_done = require("../../../../img/rank/rankPK/rank_ico_done.png");
    const rank_ico_undone = require("../../../../img/rank/rankPK/rank_ico_undone.png");
    return (
      <View style={[sdStyles.default.center, styles.tableItem, style]}>
        <View style={[sdStyles.default.center, styles.flex1]}>
          <Text style={styles.tableItemHeader}>{headerName}</Text>
        </View>
        <View style={[sdStyles.default.center, styles.flex2]}>
          {!showText && (<Image source={otherPassed ? rank_ico_done : rank_ico_undone} />)}
          {showText &&
            isTech && (
              <Text style={styles.tableItemContentTextNormal}>
              已获
              <Text style={styles.tableItemContentTextSpecial}>{otherNum}</Text>
              项
              </Text>
            )}
        </View>
        <View style={[sdStyles.default.center, styles.flex2]}>
          {!showText && (
            <Image source={IPassed ? rank_ico_done : rank_ico_undone} />
          )}
          {showText &&
            isTech && (
              <Text style={styles.tableItemContentTextNormal}>
                已获
                <Text style={styles.tableItemContentTextSpecial}>{myNum}</Text>
                项
              </Text>
            )}
        </View>
      </View>
    );
  }
}
/**
 *  PK一下界面
 */

class PlayerKillScreen extends React.Component {
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      me: {
        // id
        id: 1,
        // 全称
        fullName: "-",
        // 头像url
        avatarUrl: '',
        score: 0,
        major: "",
        college: "",
        degree: "",
        computerGrade2: false,
        CET6: false,
        accountingCertificate: false,
        // 阅读书籍
        bookNum: 0,
        // 打卡天数
        checkNum: 0,
        certifications: [],
        sex: 0,
        score_count: 0,
        score_avg: 0
      },
      other: {
        // id
        id: 2,
        // 全称
        fullName: "-",
        // 头像url
        avatarUrl: '',

        score: 0,
        major: "",
        college: "",
        degree: "",
        computerGrade2: false,
        CET6: false,
        accountingCertificate: false,
        // 阅读书籍
        bookNum: 0,
        // 打卡天数
        checkNum: 0,
        certifications: [],
        sex: 0,
        score_count: 0,
        score_avg: 0
      }
    };
  }
  // 全部证书
  allCertifications = new Map();
  static defaultProps = {
    // 对手id
    otherId: 2
  };
  fetchCourseScore = () => {
    const { otherId, user } = this.props;
    // return Promise.all([
    //   getPKData({id: user.id}),
    //   getPKData({id: otherId})
    // ]).then(
    //   ([ownInfo,otherInfo]) => {
    //     this.setState({
    //       me: {
    //         ...this.state.me,
    //         score_count: ownInfo.results.edu_info.score_count,
    //         score_avg: ownInfo.results.edu_info.score_avg,
    //       },
    //       other: {
    //         ...this.state.other,
    //         score_count: otherInfo.results.edu_info.score_count,
    //         score_avg: otherInfo.results.edu_info.score_avg,
    //       }
    //     })
    //   }
    return Promise.all([
      // getPKData({id: user.id}),
      getPKData({id: otherId})
    ]).then(
      ([ownInfo]) => {

        this.setState({
          me: {
            ...this.state.me,
            score_count: ownInfo.results.grade
          }
          // other: {
          //   ...this.state.other,
          //   score_count: otherInfo.results.grade
          // }
        })
      }
    ).catch(
      (e) => {
        // this.setState({
        //   isFetching: false
        // })
      }
    )
  }
  // 获取证书
  fetchCertification = () => {
    const { user, otherId } = this.props;
    // 获取本人证书
    this.props.actions.getUserCertificateAction({ id: user.id }, res => {
      console.log('ly88', 'getUserCertificateAction', res)
      let myCertifications = res.map(({certificate}) => {
        // 按证书Code
        this.allCertifications.set(certificate.code, certificate.name)
        return certificate.code
        // 按证书Name
        // this.allCertifications.set(certificate.name, certificate.name)
        // return certificate.name
      })
      this.setState({
        me: {
          ...this.state.me,
          certifications: myCertifications
        }
      });
    });
    // 获取对手证书
    this.props.actions.getOtherUserCertificateAction({ id: otherId }, res => {
      console.log('ly88', 'getOtherUserCertificateAction', res)
      let otherCertifications = res.map(({certificate}) => {
        // 按证书Code
        this.allCertifications.set(certificate.code, certificate.name)
        return certificate.code
        // 按证书Name
        // this.allCertifications.set(certificate.name, certificate.name)
        // return certificate.name
      })
      this.setState({
        other: {
          ...this.state.other,
          certifications: otherCertifications
        }
      });
    });
  };
  componentWillUnmount() {
    StatusBar.setBarStyle('dark-content')
  }

  componentWillMount() {
    StatusBar.setBarStyle('light-content')
    const { user, otherId, otherUserInfo } = this.props;
    this.fetchCertification();
    this.fetchCourseScore()
    this.setState({
      me: {
        ...this.state.me,
        // 全称
        fullName: user.name,
        // 头像url
        avatarUrl:
          user.avatar && user.avatar.url || '',
        date: new Date(),
        // 0 女，1 男
        sex: user.gender === 'female' ? 0 : 1,
        score: formatPower(user.power),
        // isNaN(user.power)? 0 : parseFloat(user.power).toFixed(0)-0,
        major: user.total.major_name,
        college: user.total.school_name,
        degree: user.total.degree_name,
        // 阅读书籍
        bookNum: user.total.read_count,
        // 打卡天数
        checkNum: user.total.punch_count,
        techNum: user.total.tech_count
      }
    });

    // 改为从reducer获取
    const res = otherUserInfo;
    this.setState({
      other: {
        ...this.state.other,
        // 全称
        fullName: res.nickname,
        // 头像url
        avatarUrl:
          res.avatar && res.avatar.url || '',
        score: formatPower(res.power),
        // isNaN(res.power) ? 0 : parseFloat(res.power).toFixed(0)-0,
        major: res.edu_info.major_name,
        college: res.edu_info.school_name,
        degree: res.edu_info.degree_name,
        // 阅读书籍
        bookNum: res.task_info.read_count,
        // 打卡天数
        checkNum: res.task_info.punch_count,
        techNum: res.task_info.tech_count,
        // 0 女，1 男
        sex: res.gender === 'female' ? 0 : 1,
      }
    });
  }
  render() {
    const { isFetching } = this.state;
    const myInfo = this.state.me;
    const othersInfo = this.state.other;
    const allCertifications = this.allCertifications
    console.log('ly88', 'allCertifications', allCertifications)
    console.log('ly88', 'othersInfo', othersInfo)
    console.log('ly88', 'myInfo', myInfo)
    if (isFetching) {
      return <View style={{flex:1}}><SDLoading /></View>
    }
    // 证书项
    const CertificateItems = (function() {
      let certificateItems = [];
      for(let key of allCertifications.keys()) {
        // for (let i of new Array(5))
        certificateItems.push(
          <CertificateItem
            key={key}
            headerName={allCertifications.get(key)}
            otherPassed={othersInfo.certifications.indexOf(key)>-1}
            IPassed={myInfo.certifications.indexOf(key)>-1}
          />
        )
      }
      return certificateItems
    })()

    return (

      <View style={styles.container}>
        <SDHeader
          left={
            <Touchable onPress={() => this.context.navigator.pop()}>
              <Image source={require('@img/rank/rank_ico_back_white.png')}/>
            </Touchable>
          }
          title={<Text style={styles.headerText}>PK一下</Text>}
          style={styles.header}
          normalStyle={{backgroundColor: "transparent"}}
        />
        <ScrollView style={{marginTop: -CSS.pixel(132 + (isIphoneX() ? 15 : 0), true)}}>
          {/* 上侧 */}
          <ImageBackground
            source={require("@img/rank/rankPK/rank_PK_bg.png")}
            style={{ marginTop: 0, paddingTop: CSS.pixel(132 + (isIphoneX() ? 15 : 0) , true) }}
          >
            {/* 用户头像相关信息 */}
            <View
              style={styles.topUserInfoContainer}
            >
              {/* 左边 */}
              <View style={{ flexDirection: "row" }}>
                <Avatar
                  certified={false}
                  name={othersInfo.fullName}
                  avatarUrl={othersInfo.avatarUrl}
                  size={CSS.pixel(126)}
                  sex={othersInfo.sex}
                  shape="circle"
                  styles={styles.avatar}
                />
                <View style={styles.topTextContainer}>
                  <Text style={styles.topText}>对手</Text>
                  <Text>
                    <Text style={styles.topNumber}>{`${othersInfo.score}`}</Text>
                    <Text style={styles.topNumberUnit}>{'分'}</Text>
                  </Text>
                </View>
              </View>
              {/* 右边 */}
              <View style={{ flexDirection: "row" }}>
                <Avatar
                  certified={false}
                  name={myInfo.fullName}
                  avatarUrl={myInfo.avatarUrl}
                  size={CSS.pixel(126)}
                  sex={myInfo.sex}
                  type="circle"
                  styles={styles.avatar}
                />
                <View style={styles.topTextContainer}>
                  <Text style={styles.topText}>我</Text>
                  <Text>
                    <Text style={[styles.topNumber]}>{`${myInfo.score}`}</Text>
                    <Text style={styles.topNumberUnit}>{'分'}</Text>
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.middleTextContainer}>
              <Text style={styles.middleText}>
                {(myInfo.score - 0) == (othersInfo.score-0)
                  ? "分数不相上下，不如关注一下！" : (myInfo.score - 0) < (othersInfo.score-0)
                  ? "对手职么力高于我，得加把劲了！"
                  : "对手职么力低于我，干得漂亮！"}
              </Text>
            </View>
          </ImageBackground>
          {/* 下侧 */}
          <View style={styles.bottomContainer}>
            <ImageBackground
              source={require("@img/rank/rankPK/rank_PK_list_bg.png")}
              style={styles.bottomBackGroundImage}
              resizeMode="contain">
            </ImageBackground>
              {/* 第一行 */}
              <View style={styles.bottomFirstLine}>
                <View style={[styles.flex2,styles.educationContainer]}>
                  <Text numberOfLines={1} style={styles.collegeText}>{othersInfo.college}</Text>
                  <Text style={styles.degreeText}>{othersInfo.degree}</Text>
                  <Text style={styles.degreeText}>{othersInfo.major}</Text>
                </View>
                <View style={[sdStyles.default.center, styles.flex2, styles.educationContainer]}>
                  <Text numberOfLines={1} style={styles.collegeText}>{myInfo.college}</Text>
                  <Text style={styles.degreeText}>{myInfo.degree}</Text>
                  <Text style={styles.degreeText}>{myInfo.major}</Text>
                </View>
              </View>
              <ScrollView>
                <View style={{paddingBottom: CSS.pixel(46)}}>
                  {/* 其他比较项目 */}
                  {CertificateItems}
                  <CertificateItem
                    isTech
                    headerName="职场技能"
                    showText={true}
                    myNum={myInfo.techNum}
                    otherNum={othersInfo.techNum}
                  />
                  <View style={[sdStyles.default.center,styles.tableItem]}>
                    <View style={[sdStyles.default.center, styles.flex1]}>
                      <Text style={styles.tableItemHeader}>
                        {'在校成绩'}
                      </Text>
                    </View>
                    <View style={[sdStyles.default.center, styles.flex3]}>
                      <View style={[sdStyles.default.center]}>
                        <Text style={styles.tableItemContentTextSpecial2}>
                        {(myInfo.score_count - 0) == (othersInfo.score_count-0)
                        ? "势均力敌" : (myInfo.score_count - 0) < (othersInfo.score_count-0)
                        ? "对手高于我"
                        : "我高于对手"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default (exportModule = ConnectWithActions((state, props) => ({
  otherUserInfo: state.otherUserInfo,
  user: getUserAllInfo(state, props)
}))(PlayerKillScreen));

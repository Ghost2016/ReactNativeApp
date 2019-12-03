import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  FlatList,
  AlertIOS
} from "react-native";
import PropTypes from "prop-types";
import { SDTouchList } from "../../../common";
import { navLightBox } from "../../../styles";
import HelpScreenLightBox from "./HelpScreenLigthBox";
import { CSS } from "../../../common/SDCSS";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

// 帮助中心
export default class HelpScreen extends React.PureComponent {
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
        data: [
            {
                id: 1,
                title: '什么是职么力?',
                content: '    职么力是你的当前综合能力量化值，系统将根据你注册时填写基本信息形成初始分值，并随着完善履历信息，形成你的职么力轨迹曲线。同时，职么力分值影响你在平台中排名。'
            },
            {
                id: 2,
                title: '什么是预估薪资?',
                content: '    预估薪资即当前预估工作薪资参考。系统将根据你注册时填写基本信息形成预估薪资初始值，并随着完善履历信息，形成薪酬变化曲线。若你制定了目标职位，系统将提供你毕业后从事该职位的预估薪资，及你当前预估薪资与毕业后目标职位薪资的差距。'
            },
            {
                id: 3,
                title: '职么力分值和预估薪资是怎么评估出来的?',
                content: `    职么开门采集海量毕业生就业数据，各类权威院校数据，抽象出就业市场最优人才能力模型，基于能力模型将你的教育背景、个人履历等转化为职么力分值及预估薪资。
    特别说明，我们将最大程度地量化你的职么力及预估薪资，但因不可抗因素，如招聘中的面试表现、企业需求等，我们不能保证毕业后你实际能拿到的薪资与预估薪资一致。`
            },
            {
                id: 4,
                title: '职么力和预估薪资如何提升?',
                content: `    你可以通过不断提升自己，丰富你的履历如提升自己的学历、考取相关的证书、参加更多的实习、录入每个教育经历的课业成绩等提升职么力和预估薪资。`
            },
            {
                id: 5,
                title: '排名是什么?',
                content: `  基于平台所有用户的职么力分值，形成排行榜，排行榜分为登峰榜、关注榜、进步榜三个榜单。
    登峰榜：分为本专业、同类专业、本校、同类院校、同城五个维度，可查看自己在各个大学生群体之间的排名；在各个维度下设有“top榜”及“我的位次”，“top榜”按排名顺序展示各个维度下的用户，“我的位次”展示与你职么力分数相近的前后十名用户。
    关注榜：展示你关注的用户职么力分值排名，并且可在关注榜及时查看已关注人的动态。
    进步榜：以周为单位计算战斗力分值的增长率，按增长率高低进行排名，不断提升自我，丰富履历，将有大概率上榜哦。`
            },
            {
                id: 6,
                title: '我如何做职业规划?',
                content: `    当你有清晰的职业规划时，可以在首页/成长页面中，点击“制定目标”，选择期望的行业、职位，确定后即制定成功。职业目标制定成功后，职么开门将为你推荐职业相关的助攻。`
            },
            {
                id: 7,
                title: '我没有明确的规划，该怎么确立目标呢?',
                content: `    平台将提供毕业生的数据分析为你参考，如同专业学长就业去向、近年高薪职位分析、行业发展情况等便于你制定目标。制定目标后，平台会为你推荐目标对应的任务，你可以通过完成任务定向进阶。
      你可以在成长—职业规划页面中选择考研、工作（公务员、求职）、留学其中一条路径点亮，制定具体的目标，如选择求职路径，则需选择具体的行业、职位，确定后即制定成功。`
            },
            {
                id: 8,
                title: '什么是身份管理?',
                content: `    平台中的身份即你的学校、专业教育经历；你可在平台中拥有多个身份，但仅能有一个默认身份，系统将根据你的默认身份为你提供相应的未来规划指引，且职么力分值以默认身份计算。可在首页顶部进行默认身份地切换。`
            },
            {
                id: 9,
                title: '为什么要完善个人履历?',
                content: `    个人履历与职么力分值及预估薪资挂钩，也是个人综合能力的体现。当你的履历越丰富，职么力分值越高，被企业发现的几率越高。`
            },
            {
                id: 10,
                title: '为什么要填写课程成绩?',
                content: `    课程成绩是职么力计算维度之一，为职么力分值更加精准需填写准确的课程成绩。通过对接教务系统来导入课程成绩。成绩更新时需在APP中手动刷新成绩。`
            },
            {
                id: 11,
                title: '已结束的职么课程可以购买吗?',
                content: `    可以，支付相应金额后即可进入课程群聊（如课程为免费课程，点击参与即可进入课程群聊）查看导师及参与用户的所有消息。已结束的课程不支持发送消息。`
            }
        ]
    }
  }
  _renderItem({item}) {
    return <SDTouchList title={item.title} onPress={this.showDetailHelp.bind(this, item.title, item.content)}/>
  }
  showDetailHelp(title, content) {
    navLightBox("LightBoxScreen", {
        passProps: {
            screen: () => <HelpScreenLightBox title={title} content={content}/>
        }
    });
  }
  render() {
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#f3f3f3',
        }}>
            <View style={{height: CSS.pixel(20), backgroundColor: '#f3f3f3', width: '100%'}}></View>
            <FlatList
            keyExtractor={item => item.id + ""}
            data={this.state.data}
            renderItem={this._renderItem.bind(this)}
            >
            </FlatList>
        </View>
    );
  }
}

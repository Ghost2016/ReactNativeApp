import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "../../../connectWithActions";
import LabelInput from "../../../common/SDLabelInput";
import { Toast } from "antd-mobile";
import { SDTakePhoto } from "@common";
import { navLightBox, navScreen, SDMainColor } from "../../../styles";
import SearchCertificateResults from "./SearchCertificateResults";
import SelectorDate from "../../../sd_selectDate/SelectDate";
import SearchBox from "../../../sd_searchBox/SearchBox";
import SearchBoxItem from "../../../sd_searchBox/SearchBoxItem";
import { certificateModel } from "../../../types";
import { CSS } from "../../../common/SDCSS";
import { getPowerWeek } from "@utils/funcs";
import store from "@boot/store";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  saveBtnBox: {
    marginTop: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

type Props = {
  certificateList: certificateModel[]
};

// 添加证书界面
class AddCertificateScreen extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      certificate_id: 0
    };
    this.isPosting = false;
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired,
    navigatorEvent: () => null
  };
  componentDidMount() {
    this.context.navigatorEvent.setOnNavigatorEvent(
      this.onNavigatorEvent.bind(this),
      "save_CertificateBtn"
    );
  }

  async onNavigatorEvent(event) {
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "save_CertificateBtn") {
        // this is the same id field from the static navigatorButtons definition
        // AlertIOS.alert("NavBar", "Edit button pressed");
        if(this.isPosting) {
          return;
        }
        this.isPosting = true;
        if (
          this.refs["_certificateInput"].state.value == "" ||
          this.refs["_startInput"].state.value == ""
          // this.refs["_scoreInput"].state.value == "" // 证书分数不一定必填
        ) {
          Toast.fail("信息填写不能为空");
          this.isPosting = false;
          return;
        } else {
          // 判断是否在我的证书列表里已经存在了此证书
          if (
            this.props.certificateList.findIndex(
              c => c.certificate.name == this.state.certificate_name
            ) >= 0
          ) {
            Toast.info("你已经添加过了此证书", 0.3);
            this.isPosting = false;
            return;
          }
          Toast.loading("保存中", 0);
          let uploadIds = [];
          if (this.context.refs["_takePhoto"]) {
            uploadIds = await this.context.refs["_takePhoto"].uploadPic();
          }
          if (uploadIds.length <= 0) {
            Toast.info("凭证不能为空", 0.2);
            this.isPosting = false;
            return;
          }
          this.props.actions.addUserCertificateAction(
            {
              attachment_ids: uploadIds,
              // name: this.refs["_certificateInput"].state.value,
              // certificate_id: this.state.certificate_id, // zxy todo
              certificate_name: this.state.certificate_name,
              // score: parseInt(this.refs["_scoreInput"].state.value),
              acquire_date:
                this.refs["_startInput"].state.value.replace(".", "-") + "-01"
            },
            res => {
              Toast.info("添加成功");
              //添加证书后需要添加证书任务
              if(res && res.id){
                //console.warn("添加证书成功", res)
                /* this.context.refs["_CertListItem_cert_" + res.id] && this.context.refs["_CertListItem_cert_" + res.id].punchCert(undefined, {
                  certificate_id: res.id,
                  name: this.state.certificate_name,
                }); */
                if(res.certificate.type == "common") this.punchCert({
                  certificate_id: res.certificate.id,
                  name: this.state.certificate_name,
                });
              }
              setTimeout(() => {
                this.context.navigator.pop();
              }, 1000);

            }
          );
        }
      }
    }
  }

  //添加证书任务
  punchCert(postData) {
    this.props.actions.punchCertAction(postData, res => {}).then(res => {
      //console.warn("punchCertAction res===", res);
      let params = {
        target: "cert",
        type: "common", //getTabType(this.props.targetName),
        size: 50,
        page: 1,
      };
      this.props.actions.punchListAction(
        params,
        res => {}
      ).then(res => {
        //console.warn("punchCert res===", res, params);
        store.dispatch(certPunchListAction(res.results));

        this.props.actions.getUserInfoAction();

        this.props.actions.stateSkillListAction({}, res => {}).then(res => {
          this.props.actions.setSkillStateState(res.results)
        })
        this.props.actions.stateCertListAction({}, res => {}).then(res => {
          this.props.actions.setCertStateState(res.results)
        })

        getPowerWeek().then(data => {
          //刷新排名
          this.context.refs['_rankScreen'] && this.context.refs['_rankScreen'].handleActionToUpdateAllData();
          //this.context.refs['__scoreChartWrap'].getPower();

          this.props.actions.stateCertListAction({}, res => {}).then(res => {
            this.props.actions.setCertStateState(res.results)
          })
        })

      })

    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={{ height: CSS.pixel(20), backgroundColor: "#f3f3f3" }} />
          <LabelInput
            placeholder="证书名称"
            direction=">"
            ref="_certificateInput"
            placeholderRight="请输入证书名称"
            editable={false}
            onPress={() => {
              this.context.navigator.push(
                navScreen("PushScreen", "证书查询", {
                  passProps: {
                    fullScreen: true,
                    noScrollView: true,
                    screen: () => (
                      <SearchBox
                        noAutoNext
                        autoFocus
                        refreshAction={
                          this.props.actions.certificateSuggestAction
                        }
                        noAutoNext={true}
                        queryKey={"prefix"}
                        useCustom={true}
                        enterText="确定"
                        onChange={(text, isCustom) => {
                          if (isCustom) {
                            this.refs["_certificateInput"].setState({
                              value: text
                            });
                            // this.state.certificate_id = item.id;
                            this.state.certificate_name = text;
                            return;
                          }
                        }}
                        onSubmit={text => {
                          this.props.actions
                            .certificateSuggestAction({
                              prefix: text,
                              size: 10
                            })
                            .then(res => {
                              if (this.context.refs["g_searchBox"]) {
                                this.context.refs["g_searchBox"].setState({
                                  data: res
                                });
                              }
                            })
                            .catch(err => {});
                        }}
                        renderItem={(item, index, word) => {
                          return (
                            <SearchBoxItem
                              key={index + ""}
                              word={word}
                              textValue={item.name}
                              item={item}
                              onPress={item => {
                                this.refs["_certificateInput"].setState({
                                  value: item.name
                                });
                                // this.state.certificate_id = item.id;
                                this.state.certificate_name = item.name;
                                this.context.navigator.pop({
                                  animated: true, // does the pop have transition animation or does it happen immediately (optional)
                                  animationType: "fade"
                                });
                              }}
                            />
                          );
                        }}
                      />
                    )
                  }
                })
              );
            }}
          />
          {/* <LabelInput
            // keyboardType="numeric"
            placeholder="考取成绩"
            // direction=">"
            placeholderRight="请输入成绩"
            ref="_scoreInput"
          /> */}
          <SelectorDate
            max={new Date()}
            onOk={(y, m, d) => {
              this.refs["_startInput"].setState({ value: y + "." + m });
            }}
          >
            <LabelInput
              placeholder="通过时间"
              direction=">"
              placeholderRight="请选择通过时间"
              isSelector={true}
              editable={false}
              disablePress={true}
              ref="_startInput"
            />
          </SelectorDate>
          <LabelInput
            footterStyle={{ borderBottomColor: "#fff" }}
            placeholder="上传凭证"
            editable={false}
            footter={<SDTakePhoto max={2} />}
          />
        </ScrollView>
        <View style={{height: CSS.pixel(104), alignItems: 'center'}}>
          <Text style={{color: '#FE8900', fontSize: CSS.textSize(24)}}>提交信息后我们将予以审核，请确保你的信息凭证真实有效</Text>
        </View>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({
  certificateList: state.certificateList
}))(AddCertificateScreen);

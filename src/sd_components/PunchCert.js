import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";
import ConnectWithActions from "@src/connectWithActions";
import LabelInput from "@src/common/SDLabelInput";
import { Toast } from "antd-mobile";
import { SDTakePhoto } from "@common";
import { navLightBox } from "@src/styles";
import SelectorDate from "@src/sd_selectDate/SelectDate";
import SDButton from "@sd_components/SDButton";
import * as sdStyles from "@styles";
import { CSS } from "@common/SDCSS";
import { getDateObj } from "@utils/funcs";
// 获取手机屏幕的大小
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    backgroundColor: sdStyles.SDBGColorMain,
  },
  saveBtnBox: {
    marginTop: 20,
    height: 46,
    paddingLeft: 20,
    paddingRight: 20,
    overflow: "hidden"
  }
});

// 证书考取打卡
class PunchCert extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      alreadyUpload: false,
      defaultImages: [],
      isCanSubmit: false,
      chooseImgNum: 0,
      startDate: '',
      certName: '',
    }
  }

  static contextTypes = {
    navigator: PropTypes.object.isRequired,
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    console.log("PunchCert this.props.data===", this.props)
    this.props.actions.getCertByIdAction({
      id: this.props.data.task.id
    }, res=>{}).then(res => {
      console.log("PunchCert this.props.data===res", this.res)
      let arr = []
      if(res.results.score){

        arr = res.results.attachments.map((n,i)=>{
          return {
            desc:n.desc,
            id:n.id,
            type:n.type,
            url:n.url,
          };
        })

        this.setState({
          defaultImages: [arr[0]],
          alreadyUpload: true,
        })

        setTimeout(() => {
          /* this.refs["_scoreInput"].setState({
            value: res.results.score + "",
          }) */
          //console.warn('acquire_date', res.results.acquire_date)
          /* this.refs["_startInput"].setState({
            value: res.results.acquire_date,
          }) */
          if(res && res.results && res.results.acquire_date) this.setState({
            startDate: res.results.acquire_date,
          })
        }, 100);
      }

      setTimeout(() => {
        if(this.props.data && this.props.data.task.name) {
          /* this.refs["_certificateInput"].setState({
            value: this.props.data.task.name
          }); */
          this.setState({
            certName: this.props.data.task.name,
          })
        }
      }, 100);

    })
  }

  async onPressFinish() {
    const { target, data, professionId } = this.props;
    // ||
    //this.refs["_scoreInput"].state.value == ""
    if (
      this.state.certName == "" ||
      this.state.startDate == ""
    ) {
      Toast.fail("信息填写不能为空");
      return;
    } else {
      Toast.loading("保存中", 0);
      let uploadIds = [];
      if (this.context.refs["_takePhoto"]) {
        uploadIds = await this.context.refs["_takePhoto"].uploadPic();
      }
      if (uploadIds.length <= 0) {
        Toast.info("凭证不能为空", 0.2);
        return;
      }

      if(this.state.alreadyUpload){
        if(this.context.refs["_CertListItem_cert_" + data.task.id]) {
          //Toast.success("上传证书成功！", 0.1);
          this.context.refs["_CertListItem_cert_" + data.task.id].punchCert(professionId, data);
          this.context.navigator.pop();
        } else {
          Toast.fail("考取证书打卡失败！");
        }
        return;
      }
      this.props.actions.addUserCertificateAction(
        {
          attachment_ids: uploadIds,
          // name: this.refs["_certificateInput"].state.value,
          certificate_id: data.task.id,  // zxy todo
          //score: "", //parseInt(this.refs["_scoreInput"].state.value),
          acquire_date: getDateObj(this.state.startDate.replace(".", "-"), true),
        },
        res => {
          //console.log("res===punchcert", res)
          if(this.context.refs["_CertListItem_cert_" + data.task.id]) {
            /* this.props.actions.stateSkillListAction({}, res => {}).then(res => {
              this.props.actions.setSkillStateState(res.results)
            }) */
            this.props.actions.stateCertListAction({}, res => {}).then(res => {
              this.props.actions.setCertStateState(res.results)
            })
            //Toast.success("上传证书成功！", 0.1);
            this.context.refs["_CertListItem_cert_" + data.task.id].punchCert(professionId, data);
            this.context.navigator.pop();
          } else {
            Toast.fail("考取证书打卡失败！");
          }

        }
      );
    }
  }

  chkIsCanSubmit(){
    //console.warn('chkIsCanSubmit', this.state.chooseImgNum, this.state.startDate)
    if (
      this.state.chooseImgNum &&
      this.state.startDate
    ){
      this.setState({
        isCanSubmit: true,
      })
    } else {
      this.setState({
        isCanSubmit: false,
      })
    }
  }

  render() {
    return (
      <View
       style={{ flex: 1 }}
       >
        <ScrollView style={styles.container}>

          <LabelInput
            placeholder="证书名称"
            placeholderColor={sdStyles.SDFontColorSubtitle}
            direction=""
            ref="_certificateInput"
            placeholderRight="请输入证书名称"
            //placeholderRightColor={sdStyles.SDFontColorSubtitle}
            defaultValue={this.state.certName}
            editable={false}
            style={{
              marginTop: CSS.pixel(30, true),
              backgroundColor: '#fff',
            }}
          />
          <View style={{
            flexGrow: 1,
            backgroundColor: '#fff',
            height: height,
          }}>
          {/* <LabelInput placeholder="考取成绩"
            placeholderColor={sdStyles.SDFontColorSubtitle} direction="分" ref="_scoreInput"
            onChange={value => {
              //this.refs["_scoreInput"].setState({ value: value });
              console.log("考取成绩", value)
              if (value && !value.toString().match(/^[0-9\.]{1,3}$/) ||
                parseInt(value, 10) < 1 ||
                parseInt(value, 10) > 1000) {
                this.refs["_scoreInput"].setState({
                  value: ''
                })
                Toast.fail("请输入有效成绩")
                return;
              }

              this.refs["_scoreInput"].setState({
                value: `${value}`
              })
            }}
            style={{
              backgroundColor: '#fff',
            }}
             /> */}
          <SelectorDate
            onOk={(y, m, d) => {
              //console.warn('onOk', y, m, d)
              this.refs["_startInput"].setState({
                value: y + "." + m,
              })
              setTimeout(() => {
                this.setState({
                  startDate: y + "." + m,
                })
                this.chkIsCanSubmit()
              }, 100);
            }}
            max={new Date()}
          >
            <LabelInput
              placeholder="通过时间"
              placeholderColor={sdStyles.SDFontColorSubtitle}
              defaultValue={this.state.startDate}
              direction=">"
              editable={false}
              disablePress={true}
              isSelector={true}
              ref="_startInput"
              style={{
                backgroundColor: '#fff',
              }}
            />
          </SelectorDate>

          <LabelInput
            footterStyle={{ borderBottomColor: "#fff" }}
            placeholder="上传凭证"
            placeholderColor={sdStyles.SDFontColorSubtitle}
            footter={<SDTakePhoto
              defaultImages={this.state.defaultImages}
              hasImageAction={(list)=>{
                //console.warn('hasImageAction', list.length-1)
                this.setState({
                  chooseImgNum: list.length-1,
                })
                setTimeout(() => {
                  this.chkIsCanSubmit()
                }, 200);

              }}
              max={2}
              initWidth={CSS.pixel(302)}
              initHeight={CSS.pixel(207, true)}
            />}
            style={{
              backgroundColor: '#fff',
            }}

          />

          <SDButton
            style={{
              flexDirection: "column",
              alignSelf: "center",
              marginTop: CSS.pixel(86, true),
              marginBottom: CSS.pixel(58, true),
              backgroundColor: this.state.isCanSubmit ? sdStyles.SDMainColor : sdStyles.SDBGColorGreyBtn,
              borderRadius: 20,
              width: CSS.pixel(550),
              zIndex: 6,
              position: "relative",
              top: 0, //CSS.pixel(200, true),
              left: 0,
            }}
            btnStyle={{
              fontSize: CSS.pixel(32),
              color: sdStyles.SDFontColorMain,
              position: "relative",
              top: 0, //-4
            }}
            outerStyle={{
              width: '100%',
              backgroundColor: '#fff',
            }}
            onPress={this.onPressFinish.bind(this)}
            title="完成打卡"
          />

          <View
            style={{
              marginTop: CSS.pixel(0, true),
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: '#fff',
            }}
          >
            <Text style={{ color: "#fc8824", fontSize: CSS.pixel(24), }}>
              请确保你的信息凭证真实有效
            </Text>
          </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ConnectWithActions((state, props) => ({}))(PunchCert);

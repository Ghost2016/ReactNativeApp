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
import { CSS } from "../../../common/SDCSS";
import LabelInput from "../../../common/SDLabelInput";
import SDTouchOpacity from "../../../common/SDTouchOpacity";
import { SDMainColor, navLightBox, navScreen } from "../../../styles";
import { educationModel } from "../../../types";

type Props = {
  education: educationModel
};

export default class AddSchoolOk extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: () => null,
    refs: () => null
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: CSS.pixel(120),
            paddingBottom: CSS.pixel(60)
        }}>
          <Image
            source={require("@img/my/ming_ico_Success.png")}
          />
        </View>
        <View style={{justifyContent: 'center', alignItems : 'center'}}>
            <Text style={{color: '#333', fontSize: CSS.pixel(36)}}>{this.props.education.school.name + " " + this.props.education.degree.name + " · " + this.props.education.major.name}</Text>
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: CSS.pixel(105), marginTop: CSS.pixel(120)}}>
            <Text style={{textAlign: 'center', color: '#333', fontSize: CSS.pixel(30), lineHeight: CSS.pixel(44)}}>教务系统账号绑定成功！系统将同步认证
你的教育信息并导入在校课程</Text>
        </View>

        <View style={{marginTop: CSS.pixel(30), paddingHorizontal: CSS.pixel(105), justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#999', textAlign: 'center', fontSize: CSS.textSize(24), lineHeight: CSS.pixel(34)}}>成绩获取需要一定时间，获取后系统会自动将你的在校成绩导入个人履历中。</Text>
        </View>

        <SDTouchOpacity onPress={() => {
          this.context.navigator.pop({
            animated: false,
            animationType: "fade"
          });
          this.context.navigator.pop({
              animated: true,
              animationType: "fade"
          })
        }} style={{marginTop: CSS.pixel(80), justifyContent: 'center', alignItems:'center'}}>
            <View style={{backgroundColor: SDMainColor, width: CSS.pixel(550), height: CSS.pixel(80), justifyContent: 'center', alignItems: 'center', borderRadius: CSS.pixel(40)}}>
                <Text style={{color: '#333', fontSize: CSS.pixel(32)}}>完成</Text>
            </View>
        </SDTouchOpacity>
      </View>
    );
  }
}

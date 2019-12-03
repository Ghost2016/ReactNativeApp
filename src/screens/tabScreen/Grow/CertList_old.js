/* @flow */
import React, { PureComponent } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Animated,
  Text,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import defaultStyle, { navLightBox } from "@styles";
import * as sdStyles from "@styles";
import { CSS } from "@src/common/SDCSS";
//import { getSuitableSize } from "@utils/qiniupic";
import DotSelect from "@sd_components/DotSelect";
//import SDButton from "@sd_components/SDButton";
import SDCollapse from "@sd_components/SDCollapse";
import SelectButton from "@sd_components/SelectButton";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  }
});

type Props = {};

const screenWidth = Dimensions.get("window").width;

// 动态信息List
export default class CertList extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
  }
  static contextTypes = {
    navigator: PropTypes.object.isRequired
  };
  state={
    selectIndex: [],
  }

  onPressPunch(isPunched, data, index) {
    console.log("onPressPunch cert====", isPunched, data);
    this.props.actions.punchCertAction({
      id: data.id
    }, res => {}).then(res => {
      let temp = [...this.state.selectIndex];
      temp[index] = true
      this.setState({
        selectIndex: temp
      })
    })
  }

  componentWillMount(){
    const { item } = this.props
    let arr = []
    if(item.courses) item.courses.map((n,i)=>{
      arr[i] = false
    })
    this.setState({
      selectIndex: arr,
    })
  }

  render() {
    const { item } = this.props;
    console.log("item cert====", item)
    const isFinished = false;
    return (
      <SDCollapse
        containerStyle={{
          flexDirection: "column",
          alignItems: "flex-start"
        }}
        style={{
          borderWidth: 0,
          borderColor: "#f00"
        }}
        title={`${item.name} 成绩：76`}
        collapse={false}
        right={() => {
          return (
            <Text
              style={{
                fontSize: CSS.textSize(22),
                position: "relative",
                left: CSS.pixel(-20)
              }}
            >
              2018.6
            </Text>
          );
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#fff",
            width: "100%",
            paddingBottom: CSS.pixel(40, true)
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              borderWidth: 0,
              borderColor: "#f00",
              width: "100%",
              paddingHorizontal: CSS.pixel(40),
              marginBottom: CSS.pixel(20, true),
              marginTop: CSS.pixel(20, true)
            }}
          >
            <DotSelect
              title="Word文章格式制作"
              isSelect={true}
              data={null}
              index={0}
              circleBorder={0}
              onPress={() => {}}
              selectColor={
                isFinished ? sdStyles.SDMainColor : sdStyles.SDHelperColorline
              }
              txtStyle={{
                fontSize: CSS.pixel(28),
                position: "relative",
                left: CSS.pixel(-10),
                color: sdStyles.SDFontColorMain
              }}
              isSmall={true}
              style={{ alignSelf: "flex-start", flexGrow: 1 }}
            />
            <SelectButton
              selectTitle="已完成"
              unSelectTitle="完成"
              isSelected={isFinished}
              onPress={this.onPressPunch.bind(this)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Image source={require("@img/grow/growing_pic_certificate.png")} />
          </View>
        </View>
      </SDCollapse>
    );
  }
}
